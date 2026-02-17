from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from typing import List
import logging

from app.db.session import get_db
from app.schemas.student import StudentResponse, StudentDetailResponse, StudentCreate, StudentUpdate
from app.schemas.project import ProjectResponse, ProjectCreate
from app.models import Student, User, Project, AIAnalysis, AITask, AIPrompt, CV, SocialLink
from app.api.deps import get_current_user
from app.core.security import get_password_hash
from app.services.ai.cv_parser import cv_parser
from app.services.github.github_service import github_service



router = APIRouter(prefix="/api/students", tags=["students"])
logger = logging.getLogger(__name__) # Add logger


@router.post("/onboarding/analyze-cv")
async def analyze_cv(
    file: UploadFile = File(...)
):
    """
    Extract information from uploaded CV PDF
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    content = await file.read()
    try:
        data = await cv_parser.parse_cv(content)
        
        # Enrich projects with GitHub data if available
        if "projects" in data and data["projects"]:
            enriched_projects = []
            for project in data["projects"]:
                repo_url = project.get("repo_url")
                if repo_url and "github.com" in repo_url.lower():
                    try:
                        github_data = await github_service.extract_project(repo_url)
                        # Merge GitHub data (prioritizing GitHub descriptions/tags)
                        project["description"] = github_data.get("description", project.get("description"))
                        project["tags"] = github_data.get("tags", project.get("tags", []))
                        project["title"] = github_data.get("title", project.get("title"))
                    except Exception as ge:
                        logger.warning(f"Failed to enrich project {repo_url}: {ge}")
                enriched_projects.append(project)
            data["projects"] = enriched_projects

        return data
    except Exception as e:
        logger.error(f"CV parsing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/onboarding/analyze-github")
async def analyze_github(
    payload: dict
):
    """
    Extract project information from GitHub URL
    """
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="GitHub URL is required")
    
    try:
        data = await github_service.extract_project(url)
        return data
    except Exception as e:
        logger.error(f"GitHub analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/onboarding/list-github-repos")
async def list_github_repos(
    payload: dict
):
    """
    List all repositories for a GitHub user profile
    Body: { "profile_url": "https://github.com/username" }
    """
    profile_url = payload.get("profile_url")
    if not profile_url:
        raise HTTPException(status_code=400, detail="GitHub profile URL required")
    
    # Parse username from URL
    username = github_service._parse_profile_url(profile_url)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid GitHub profile URL. Expected format: https://github.com/username")
    
    try:
        repos = await github_service.list_user_repositories(username)
        return {
            "username": username,
            "repos": repos,
            "count": len(repos)
        }
    except Exception as e:
        logger.error(f"GitHub list repos error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/onboarding/analyze-github-batch")
async def analyze_github_batch(
    payload: dict
):
    """
    Analyze multiple GitHub repositories in batch
    Body: { "repo_urls": ["url1", "url2", ...] }
    """
    repo_urls = payload.get("repo_urls", [])
    if not repo_urls:
        raise HTTPException(status_code=400, detail="Repository URLs required")
    
    # Limit to 10 repos to avoid timeout
    repo_urls = repo_urls[:10]
    
    results = []
    for url in repo_urls:
        try:
            project_data = await github_service.extract_project(url)
            results.append({
                "success": True,
                "data": project_data
            })
        except Exception as e:
            logger.warning(f"Failed to analyze {url}: {e}")
            results.append({
                "success": False,
                "url": url,
                "error": str(e)
            })
    
    return {
        "results": results,
        "total": len(results),
        "successful": sum(1 for r in results if r["success"])
    }


@router.get("/me", response_model=StudentDetailResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the current student's profile
    """
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students have student profiles"
        )
    
    student = db.query(Student).options(
        joinedload(Student.projects).joinedload(Project.ai_analyses),
        joinedload(Student.user).joinedload(User.social_links),
        joinedload(Student.cvs),
        joinedload(Student.certificates)
    ).filter(Student.user_id == current_user.user_id).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Map User fields to Student object for schema compatibility
    if student.user:
        student.email = student.user.email
        student.role = student.user.role
        student.status = student.user.status
        student.profile_photo_url = student.user.profile_photo_url
    else:
        # Fallback if connection is weird
        student.email = current_user.email
        student.role = current_user.role
        student.status = current_user.status
        student.profile_photo_url = current_user.profile_photo_url
    
    return student


@router.get("/{student_id}", response_model=StudentDetailResponse)
def get_student_profile(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get student profile by ID
    """
    student = db.query(Student).options(
        joinedload(Student.projects).joinedload(Project.ai_analyses),
        joinedload(Student.user).joinedload(User.social_links),
        joinedload(Student.cvs),
        joinedload(Student.certificates)
    ).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {student_id} not found")
    if not student.user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Student user record missing")
    student.email = student.user.email
    student.role = student.user.role
    student.status = student.user.status
    return student


@router.get("/", response_model=list[StudentResponse])
def list_students(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all students (paginated)
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of student profiles
    """
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

@router.patch("/me", response_model=StudentResponse)
def update_my_profile(
    student_update: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update the current student's profile
    """
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can update student profiles"
        )
    
    student = db.query(Student).options(
        joinedload(Student.user).joinedload(User.social_links)
    ).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    # Update fields
    update_data = student_update.model_dump(exclude_unset=True)
    logger.info(f"Updating profile for {current_user.email} with data: {update_data}")

    # DB columns (can be set directly)
    db_columns = {"full_name", "university", "degree_level", "Email_Address"}
    for field in db_columns:
        if field in update_data:
            setattr(student, field, update_data[field])

    # bio, ats_score, skills: persist via CV.parsed_json (Student reads them from there)
    cv_fields = {"bio", "ats_score", "skills"}
    if any(f in update_data for f in cv_fields):
        import uuid
        cv = db.query(CV).filter(CV.student_id == student.student_id).first()
        if not cv:
            cv = CV(cv_id=f"cv_{uuid.uuid4().hex[:12]}", student_id=student.student_id, parsed_json={})
            db.add(cv)
        j = cv.parsed_json or {}
        if "bio" in update_data:
            j["professional_bio"] = update_data["bio"]
        if "ats_score" in update_data:
            j["ats_compatibility"] = update_data["ats_score"]
        if "skills" in update_data:
            j["skills"] = update_data["skills"] or []
        cv.parsed_json = j

    # github_url, linkedin_url: persist via SocialLink
    for key, url_key in [("github_url", "github.com"), ("linkedin_url", "linkedin.com")]:
        if key not in update_data:
            continue
        url = update_data[key]
        existing = next(
            (s for s in (student.user.social_links or []) if url_key in (s.url or "").lower()),
            None
        )
        if url:
            import uuid
            if existing:
                existing.url = url
                existing.username = url.rstrip("/").split("/")[-1] if "/" in url else None
            else:
                sl = SocialLink(
                    social_link=f"social_{uuid.uuid4().hex[:12]}",
                    user_id=student.user_id,
                    url=url,
                    username=url.rstrip("/").split("/")[-1] if "/" in url else None
                )
                db.add(sl)
        elif existing:
            db.delete(existing)

    try:
        db.commit()
        db.refresh(student)
        logger.info(f"Profile updated successfully. New ATS Score: {student.ats_score}")
    except Exception as e:
        logger.error(f"Failed to commit profile update: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return student

@router.get("/me/projects", response_model=list[ProjectResponse])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all projects for the current student
    """
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access projects"
        )
    
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    # Get all projects with their AI analyses
    projects = db.query(Project).options(
        joinedload(Project.ai_analyses)
    ).filter(Project.owner_id == student.student_id).all()
    
    return projects

@router.post("/me/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def add_project_to_me(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a new project to the current student's profile
    """
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can add projects"
        )
    
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )
    
    import uuid
    import json
    project_id = f"P-{uuid.uuid4().hex[:8]}"
    
    title = project_in.title
    description = project_in.description
    repo_url = project_in.repo_url
    tags = project_in.tags or []
    
    # Auto-enrich from GitHub if possible
    if repo_url and "github.com" in repo_url.lower():
        try:
            github_data = await github_service.extract_project(repo_url)
            title = github_data.get("title", title)
            description = github_data.get("description", description)
            # Add GitHub tags to existing tags
            github_tags = github_data.get("tags", [])
            tags = list(set(tags + github_tags))
            logger.info(f"Auto-enriched project {title} from GitHub with tags: {github_tags}")
        except Exception as ge:
            logger.warning(f"Failed to auto-enrich manual project {repo_url}: {ge}")

    new_project = Project(
        project_id=project_id,
        owner_id=student.student_id,
        title=title,
        repo_url=repo_url
    )
    db.add(new_project)

    # Persist the rich data (description, tags, etc) as an AIAnalysis record
    # This keeps the 'project' table clean as per governance
    # 1. Get or create manual task/prompt
    task = db.query(AITask).filter(AITask.task_code == "MANUAL_ENTRY").first()
    if not task:
        task = AITask(task_id="T-MANUAL", task_code="MANUAL_ENTRY", description="Manually entered data")
        db.add(task)
    
    prompt = db.query(AIPrompt).filter(AIPrompt.prompt_id == "P-MANUAL").first()
    if not prompt:
        prompt = AIPrompt(prompt_id="P-MANUAL", task_id="T-MANUAL", prompt_text="User manual input")
        db.add(prompt)

    # 2. Store the data
    analysis = AIAnalysis(
        analysis_id=f"A-{uuid.uuid4().hex[:8]}",
        task_id=task.task_id,
        prompt_id=prompt.prompt_id,
        entity_type="project",
        entity_id=project_id,
        output_json={
            "description": description,
            "tags": tags,
            "strengths": project_in.strengths or [],
            "weaknesses": project_in.weaknesses or []
        }
    )
    db.add(analysis)
    db.commit()
    db.refresh(new_project)
    
    # Return response model (it will use the properties on new_project)
    return new_project

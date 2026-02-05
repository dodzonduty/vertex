"""
Onboarding API routes
Handles user registration and onboarding for students and companies
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models import User, Student, Company, SocialLink, Project, CV, AITask, AIPrompt, AIAnalysis
from app.core.security import get_password_hash, create_access_token
from app.schemas.auth import TokenResponse
from pydantic import BaseModel, EmailStr


router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])


# Schemas
class SocialLinkCreate(BaseModel):
    url: str
    username: Optional[str] = None


class ProjectCreate(BaseModel):
    title: str
    repo_url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None


class StudentOnboardingRequest(BaseModel):
    # User fields
    email: EmailStr
    password: str
    
    # Student fields
    full_name: str
    university: Optional[str] = None
    degree_level: Optional[str] = None
    
    # Optional fields
    social_links: Optional[List[SocialLinkCreate]] = None
    projects: Optional[List[ProjectCreate]] = None
    parsed_cv: Optional[dict] = None


class CompanySocialLinkCreate(BaseModel):
    type: str  # e.g. website, linkedin, twitter
    url: str


class CompanyOnboardingRequest(BaseModel):
    # User fields
    email: EmailStr
    password: str
    
    # Company fields
    name: str
    industry: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    size: Optional[str] = None
    social_links: Optional[List[CompanySocialLinkCreate]] = None


@router.post("/student", response_model=TokenResponse)
def onboard_student(
    request: StudentOnboardingRequest,
    db: Session = Depends(get_db)
):
    """
    Student onboarding endpoint
    Creates User + Student + SocialLinks + Projects in one transaction
    
    Args:
        request: Student onboarding data
        db: Database session
        
    Returns:
        Access token and user information
        
    Raises:
        HTTPException: If email already exists
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Generate IDs
        import uuid
        user_id = f"U-{uuid.uuid4().hex[:8]}"
        student_id = f"S-{uuid.uuid4().hex[:8]}"
        
        # Create User
        user = User(
            user_id=user_id,
            email=request.email,
            password_hash=get_password_hash(request.password),
            role="student",
            status="active"
        )
        db.add(user)
        
        # Create Student
        student = Student(
            student_id=student_id,
            user_id=user_id,
            full_name=request.full_name,
            university=request.university,
            degree_level=request.degree_level,
            Email_Address=request.email  # Duplicate for compatibility
        )
        db.add(student)

        # Create CV record if parsed data is provided (this enables bio/ats properties)
        if request.parsed_cv:
            cv = CV(
                cv_id=f"CV-{uuid.uuid4().hex[:8]}",
                student_id=student_id,
                parsed_json=request.parsed_cv
            )
            db.add(cv)
        
        # Create Social Links if provided
        if request.social_links:
            for link_data in request.social_links:
                social_link = SocialLink(
                    social_link=f"SL-{uuid.uuid4().hex[:8]}",
                    user_id=user_id,
                    url=link_data.url,
                    username=link_data.username
                )
                db.add(social_link)
        
        # Create Projects if provided
        if request.projects:
            # Ensure task/prompt exist for onboarding projects
            task = db.query(AITask).filter(AITask.task_code == "ONBOARDING").first()
            if not task:
                task = AITask(task_id="T-ONBOARD", task_code="ONBOARDING", description="Extracted during onboarding")
                db.add(task)
            
            prompt = db.query(AIPrompt).filter(AIPrompt.prompt_id == "P-ONBOARD").first()
            if not prompt:
                prompt = AIPrompt(prompt_id="P-ONBOARD", task_id="T-ONBOARD", prompt_text="CV Parsing during signup")
                db.add(prompt)

            for proj_data in request.projects:
                p_id = f"P-{uuid.uuid4().hex[:8]}"
                project = Project(
                    project_id=p_id,
                    owner_id=student_id,
                    title=proj_data.title,
                    repo_url=proj_data.repo_url
                )
                db.add(project)

                # Store rich project details in AIAnalysis
                if proj_data.description or proj_data.tags:
                    analysis = AIAnalysis(
                        analysis_id=f"A-{uuid.uuid4().hex[:8]}",
                        task_id=task.task_id,
                        prompt_id=prompt.prompt_id,
                        entity_type="project",
                        entity_id=p_id,
                        output_json={
                            "description": proj_data.description,
                            "tags": proj_data.tags or [],
                            "strengths": proj_data.strengths or [],
                            "weaknesses": proj_data.weaknesses or []
                        }
                    )
                    db.add(analysis)
        
        # Commit transaction
        db.commit()
        db.refresh(user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.user_id, "email": user.email, "role": user.role}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user.user_id,
            email=user.email,
            role=user.role
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create student account: {str(e)}"
        )


@router.post("/company", response_model=TokenResponse)
def onboard_company(
    request: CompanyOnboardingRequest,
    db: Session = Depends(get_db)
):
    """
    Company onboarding endpoint
    Creates User + Company in one transaction
    
    Args:
        request: Company onboarding data
        db: Database session
        
    Returns:
        Access token and user information
        
    Raises:
        HTTPException: If email already exists
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Generate IDs
        import uuid
        user_id = f"U-{uuid.uuid4().hex[:8]}"
        company_id = f"C-{uuid.uuid4().hex[:8]}"
        
        # Create User
        user = User(
            user_id=user_id,
            email=request.email,
            password_hash=get_password_hash(request.password),
            role="company",
            status="active"
        )
        db.add(user)
        
        # Create Company
        company = Company(
            company_id=company_id,
            user_id=user_id,
            name=request.name,
            industry=request.industry,
            description=request.description,
            verified=False,
            phone=request.phone,
            address=request.address,
            size=request.size
        )
        db.add(company)

        # Create Social Links if provided
        if request.social_links:
            for link_data in request.social_links:
                social_link = SocialLink(
                    social_link=f"social_{uuid.uuid4().hex[:12]}",
                    user_id=user_id,
                    url=link_data.url,
                    username=link_data.url.rstrip("/").split("/")[-1] if "/" in link_data.url else None
                )
                db.add(social_link)
        
        # Commit transaction
        db.commit()
        db.refresh(user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.user_id, "email": user.email, "role": user.role}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user.user_id,
            email=user.email,
            role=user.role
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create company account: {str(e)}"
        )

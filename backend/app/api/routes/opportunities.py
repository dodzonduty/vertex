"""
API routes for Opportunities
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.api import deps
from app.models.opportunity import Opportunity
from app.models.user import User
from app.models.tag import Tag
from app.models.tag_assignment import TagAssignment
from app.schemas.opportunity import OpportunityResponse, OpportunityCreateInput
import uuid

router = APIRouter(prefix="/api", tags=["opportunities"])

@router.post("/opportunities/", response_model=OpportunityResponse)
def create_opportunity(
    opp_in: OpportunityCreateInput,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Create a new opportunity
    """
    # 1. Prepare Description JSON (Rich Data)
    host_name = "Unknown Host"
    if current_user.role == "company" and current_user.company:
        host_name = current_user.company.name
    elif current_user.role == "professor" and current_user.professor:
        host_name = current_user.professor.full_name

    rich_description = {
        "text": opp_in.description,
        "date": opp_in.date,
        "endDate": opp_in.endDate,
        "location": opp_in.location,
        "prizes": opp_in.prizes,
        "requirements": opp_in.requirements,
        "judgingCriteria": opp_in.judgingCriteria,
        "rules": opp_in.rules,
        "applicationLink": opp_in.applicationLink,
        "maxParticipants": opp_in.maxParticipants,
        "registrationDeadline": opp_in.registrationDeadline,
        "host": host_name,
        # Default placeholder image based on type
        "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCLIp0CIanjTtvkxnyAXdaEozBHpAQHExEEx64XXLNm5_a8vX1Jq4FROlTxUjfTU7_DfcJVXzcxIPqI8QWg3aiqPxsfpDywiM4-xztZzL1bl1vDbYuMLSFx8Dtm7z1bzXL-JTDJyoJybgPXWS8IDs3rqa3sr9-YDgJEnPraB-FGQpcwXBTj6awOxOBbp1bfbFFDcIGVafaWIiJVSPw8xfPupvatbR7mu76CQgSr9JyUonggUOyh-8px8lUrE9kVRCmm4wn2bJAfHyA"
    }
    
    # 2. Create Model
    new_opp = Opportunity(
        opportunity_id=f"OPP-{uuid.uuid4().hex[:8]}",
        type=opp_in.type.lower(), 
        title=opp_in.title,
        description=rich_description,
        status="active",
        created_by_type=current_user.role,
        created_by_id=current_user.user_id
    )
    
    db.add(new_opp)
    db.commit()
    db.refresh(new_opp)

    # 3. Handle Tags
    if opp_in.tags:
        for tag_name in opp_in.tags:
            # Clean tag
            clean_name = tag_name.strip()
            if not clean_name:
                continue
                
            # Find or Create Tag
            # Strategy: If user wants "limited to tags found", we technically shouldn't create. 
            # But for usability in a blank system, we'll Create if not exists with type 'domain'
            tag = db.query(Tag).filter(func.lower(Tag.name) == clean_name.lower()).first()
            
            if not tag:
                tag = Tag(
                    tag_id=f"TAG-{uuid.uuid4().hex[:8]}",
                    name=clean_name, 
                    type="domain" # Default type for auto-created tags
                )
                db.add(tag)
                db.flush() # Flush to get ID if needed, though we set it manually
            
            # Create Assignment
            assignment = TagAssignment(
                tag_id=tag.tag_id,
                entity_type="opportunity",
                entity_id=new_opp.opportunity_id,
                confidence_score=1.0
            )
            db.add(assignment)
        
        db.commit()
    
    return new_opp

@router.get("/opportunities/", response_model=List[OpportunityResponse])
def read_opportunities(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Retrieve all opportunities.
    For Company/Professor: Only returns *their* created opportunities.
    For Admin: Returns all.
    """
    query = db.query(Opportunity)
    
    # Data Isolation: Companies/Professors only see what they created
    if current_user.role in ["company", "professor"]:
        query = query.filter(Opportunity.created_by_id == current_user.user_id)
        
    opportunities = query.offset(skip).limit(limit).all()
    opportunities = query.offset(skip).limit(limit).all()
    return opportunities

@router.get("/opportunities/{opportunity_id}", response_model=OpportunityResponse)
def read_single_opportunity(
    opportunity_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Optional[User] = Depends(deps.get_current_user_optional)
):
    """
    Retrieve a specific opportunity by ID.
    Includes company profile photo in hosted_by information and enrolled teams count.
    Also checks if current user is enrolled.
    """
    from fastapi import HTTPException
    from app.models.company import Company
    from app.models.team import Team
    from app.models.team_member import TeamMember
    
    opp = db.query(Opportunity).filter(Opportunity.opportunity_id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    # Count enrolled teams for this opportunity
    enrolled_teams_count = db.query(Team).filter(Team.opportunity_id == opportunity_id).count()
    
    # Check enrollment status for current user
    is_enrolled = False
    if current_user and current_user.role == 'student' and current_user.student:
        student_id = current_user.student.student_id
        # Check if student is in any team for this opportunity
        enrollment = db.query(TeamMember).join(Team).filter(
            Team.opportunity_id == opportunity_id,
            TeamMember.student_id == student_id
        ).first()
        if enrollment:
            is_enrolled = True
    
    # Set default is_enrolled on the ORM object (it's not a DB column but accessible via Pydantic model from_attributes if we patch it)
    # Since opp is an ORM object and is_enrolled is not a column, we can attach it dynamically 
    # BUT Pydantic from_attributes might miss it if it's not on the object. 
    # Safest way is to ensure the response model picks it up. 
    # Setting it on the instance usually works for Pydantic v2 from_attributes if not strict.
    opp.is_enrolled = is_enrolled
    
    # Enrich with company profile photo if created by a company
    if opp.created_by_type == "company":
        creator_user = db.query(User).filter(User.user_id == opp.created_by_id).first()
        if creator_user:
            company = db.query(Company).filter(Company.user_id == creator_user.user_id).first()
            
            # Add hosted_by information to description
            if isinstance(opp.description, dict):
                opp.description["hosted_by"] = {
                    "name": company.name if company else "Unknown Company",
                    "type": "Organization",
                    "profile_photo_url": creator_user.profile_photo_url if creator_user.profile_photo_url else None,
                    "company_id": company.company_id if company else None
                }
                # Add enrolled teams count
                opp.description["enrolled_teams_count"] = enrolled_teams_count
    elif isinstance(opp.description, dict):
        # Add count even if not a company
        opp.description["enrolled_teams_count"] = enrolled_teams_count
        
    return opp

@router.get("/opportunities-list")
def read_opportunities_list(
    db: Session = Depends(deps.get_db),
    type: str = "hackathons",
    tags: Optional[List[str]] = Query(None),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve opportunities list (Real replacement for mock)
    Matches the structure expected by the frontend: {"count": int, "results": list}
    """
    from app.models.tag import Tag
    from app.models.tag_assignment import TagAssignment

    query = db.query(Opportunity)
    
    # 1. Filter by category type (hackathons -> hackathon)
    opportunity_type = type.rstrip('s').lower()
    if opportunity_type:
        query = query.filter(Opportunity.type == opportunity_type)
    
    # 2. Filter by Tags (if provided)
    if tags:
        # Filter out '#All' if present and strip '#' prefix from others
        clean_tags = []
        for t in tags:
            if t.lower() not in ["#all", "all"]:
                # Strip '#' if present
                clean_t = t.lstrip('#')
                clean_tags.append(clean_t)
        
        if clean_tags:
            # Join with TagAssignment to filter
            # We want opportunities that have AT LEAST ONE of the tags (OR logic for tags)
            # Match case-insensitively or exactly based on seed data
            query = query.join(
                TagAssignment, 
                (TagAssignment.entity_id == Opportunity.opportunity_id) & 
                (TagAssignment.entity_type == "opportunity")
            ).join(Tag).filter(
                # Match either with or without the hash in the DB (resilient)
                (Tag.name.in_(clean_tags)) | 
                (Tag.name.in_([f"#{t}" for t in clean_tags]))
            )
            
            # Use distinct to avoid duplicate opportunities if they match multiple tags
            query = query.distinct(Opportunity.opportunity_id)
    
    
    total_count = query.count()
    results = query.offset(skip).limit(limit).all()
    
    # 3. Format results for frontend
    formatted_results = []
    for opp in results:
        desc_data = opp.description if isinstance(opp.description, dict) else {}
        
        # Helper to get price
        prizes = desc_data.get("prizes", [])
        price = prizes[0] if isinstance(prizes, list) and prizes else desc_data.get("price", "TBA")

        # Helper to get summary
        summary = desc_data.get("summary") or desc_data.get("text") or "No description available"
        if len(summary) > 150:
            summary = summary[:147] + "..."

        # Fetch tags for badges
        opp_tags = db.query(Tag.name).join(TagAssignment).filter(
            (TagAssignment.entity_id == opp.opportunity_id) & 
            (TagAssignment.entity_type == "opportunity")
        ).limit(2).all()
        
        badges = []
        for i, t in enumerate(opp_tags):
            style = "blue-soft" if i == 0 else "gray-soft"
            badges.append({"text": t.name, "style": style})
            
        formatted_results.append({
            "id": opp.opportunity_id,
            "title": opp.title,
            "host": desc_data.get("host", "Unknown Host"),
            "badges": badges or [{"text": opp.type.capitalize(), "style": "blue-soft"}],
            "summary": summary,
            "date": desc_data.get("date", "TBA"),
            "price": price,
            "location": desc_data.get("location", "Remote"),
            "image": desc_data.get("image", "https://viaplaceholder.com/300x200"),
            "type": opp.type
        })
    
    return {
        "count": total_count,
        "results": formatted_results
    }

@router.get("/opportunities/count")
def get_opportunities_count(db: Session = Depends(deps.get_db)):
    """
    Get total count of opportunities
    """
    count = db.query(func.count(Opportunity.opportunity_id)).scalar()
    return {"count": count}

@router.get("/opportunities/top")
def get_top_opportunities(
    db: Session = Depends(deps.get_db),
    limit: int = 5
):
    """
    Get top opportunities (recently created for now) - Flattened for Frontend
    """
    opportunities = db.query(Opportunity).order_by(Opportunity.created_at.desc()).limit(limit).all()
    
    formatted_results = []
    for opp in opportunities:
        desc_data = opp.description if isinstance(opp.description, dict) else {}
        
        # Helper to get price
        prizes = desc_data.get("prizes", [])
        price = prizes[0] if isinstance(prizes, list) and prizes else desc_data.get("price", "TBA")
        
        formatted_results.append({
            "opportunity_id": opp.opportunity_id,
            "title": opp.title,
            "type": opp.type,
            "price": price,
            "date": desc_data.get("date", "TBA"),
            "location": desc_data.get("location", "Remote"),
            "badge_text": opp.type.capitalize(),
            "badge_color": "blue" if opp.type == "hackathon" else "emerald",
            "image": desc_data.get("image", "https://via.placeholder.com/300x200")
        })
        
    return formatted_results

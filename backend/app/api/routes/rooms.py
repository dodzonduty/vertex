from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from pydantic import BaseModel
from datetime import datetime

from app.api import deps
from app.models.team import Team
from app.models.team_opening import TeamOpening
from app.models.team_member import TeamMember
from app.models.student import Student
from app.models.team_application import TeamApplication
from app.models.user import User

router = APIRouter(prefix="/api/rooms", tags=["rooms"])

# Pydantic Schemas (Local for now, could move to schemas folder)
class RoleInput(BaseModel):
    title: str
    count: int = 1
    description: Optional[str] = None
    tags: List[str] = []

class RoomCreateInput(BaseModel):
    opportunity_id: str
    title: str
    description: str
    roles: List[RoleInput]

class JoinRequestInput(BaseModel):
    opening_id: str
    message: Optional[str] = "I'm interested in joining your team!"

@router.get("/")
def get_rooms(
    opportunity_id: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50
):
    """
    Get a list of open rooms (Teams with status='open') for a specific opportunity
    """
    teams = db.query(Team).filter(
        Team.status == 'open',
        Team.opportunity_id == opportunity_id
    ).offset(skip).limit(limit).all()
    
    results = []
    for team in teams:
        # Get Host Name
        host_name = "Unknown"
        host_id = None
        if team.created_by_student_id:
            host_student = db.query(Student).filter(Student.student_id == team.created_by_student_id).first()
            if host_student:
                host_name = host_student.full_name
                host_id = host_student.student_id
        
        # Format Roles (Openings)
        qs_roles = []
        for op in team.openings:
            qs_roles.append({
                "id": op.opening_id,
                "title": op.role_title,
                "description": op.query_description or "",
                "count": op.total_slots,
                "filled": op.filled_slots,
                "tags": op.tags or []
            })
            
        # Format Members
        qs_members = []
        for mem in team.members:
            # Initials as avatar fallback
            initials = "".join([n[0] for n in mem.student.full_name.split(" ")[:2]]) if mem.student and mem.student.full_name else "??"
            qs_members.append({
                "id": mem.student_id,
                "name": mem.student.full_name if mem.student else "Unknown",
                "role": mem.role or "Member",
                "avatar": initials
            })
            
        results.append({
            "id": team.team_id,
            "title": team.name,
            "description": team.description,
            "host": host_name,
            "host_id": host_id,
            "roles": qs_roles,
            "members": qs_members,
            "status": team.status,
            "createdAt": team.created_at.strftime("%Y-%m-%d") if team.created_at else "Recently"
        })
        
    return results

@router.post("/")
def create_room(
    room_in: RoomCreateInput,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Create a new Room (Team)
    """
    # 1. Get Student Profile
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required to create a room")
        
    # 2. Create Team
    team_id = f"T-{uuid.uuid4().hex[:8]}"
    new_team = Team(
        team_id=team_id,
        name=room_in.title,
        description=room_in.description,
        status="open",
        created_by_student_id=student.student_id,
        opportunity_id=room_in.opportunity_id
    )
    db.add(new_team)
    
    # 3. Add Host as Member
    host_member = TeamMember(
        team_id=team_id,
        student_id=student.student_id,
        role="Host"
    )
    db.add(host_member)
    
    # 4. Create Roles (Openings)
    for role in room_in.roles:
        new_opening = TeamOpening(
            opening_id=f"OP-{uuid.uuid4().hex[:8]}",
            team_id=team_id,
            role_title=role.title,
            query_description=role.description,
            total_slots=role.count,
            filled_slots=0,
            tags=role.tags,
            status="Open"
        )
        db.add(new_opening)
        
    db.commit()
    db.refresh(new_team)
    
    return {"message": "Room created successfully", "id": team_id}

@router.post("/{team_id}/join")
def join_room(
    team_id: str,
    join_in: JoinRequestInput,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Request to join a room (Team Application)
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
         raise HTTPException(status_code=400, detail="Student profile required")

    team = db.query(Team).filter(Team.team_id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # 1. Prevent Self-Join
    if team.created_by_student_id == student.student_id:
        raise HTTPException(status_code=400, detail="You cannot join your own room")

    # Check if already applied or member (Simplified check)
    existing_member = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.student_id == student.student_id
    ).first()
    if existing_member:
        return {"message": "You are already a member of this team"}
        
    new_app = TeamApplication(
        team_app_id=f"APP-{uuid.uuid4().hex[:8]}",
        team_id=team_id,
        team_opening_id=join_in.opening_id,
        applicant_student_id=student.student_id,
        message=join_in.message,
        status="Pending"
    )
    db.add(new_app)
    db.commit()
    
    return {"message": "Join request sent successfully"}


@router.get("/dashboard/my-activity")
def get_my_room_activity(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get dashboard data:
    1. Rooms created by me (Hosts) + Incoming Applications
    2. My Enrollments (implied from rooms)
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
        
    # 1. Rooms Hosted
    hosted_teams = db.query(Team).filter(Team.created_by_student_id == student.student_id).all()
    
    rooms_data = []
    for team in hosted_teams:
        # Get Applications
        apps = db.query(TeamApplication).filter(TeamApplication.team_id == team.team_id).all()
        app_list = []
        for app in apps:
            applicant = db.query(Student).filter(Student.student_id == app.applicant_student_id).first()
            opening = db.query(TeamOpening).filter(TeamOpening.opening_id == app.team_opening_id).first()
            
            # --- GEMINI COMPATIBILITY STUB ---
            # Ideally this is computed async or cached.
            # Mocking for now as per immediate requirement.
            # Real implementation would call app.core.ai.analyze_match(applicant, opening)
            compatibility_score = 85 # Placeholder
            compatibility_reason = "Match based on React skills"
            
            app_list.append({
                "id": app.team_app_id,
                "applicant_name": applicant.full_name if applicant else "Unknown",
                "applicant_id": applicant.student_id if applicant else None,
                "role_title": opening.role_title if opening else "Unknown Role",
                "message": app.message,
                "status": app.status,
                "compatibility": {
                    "score": compatibility_score,
                    "reason": compatibility_reason
                }
            })

        rooms_data.append({
            "id": team.team_id,
            "title": team.name,
            "opportunity_id": team.opportunity_id, # Link to Hackathon
            "applications": app_list
        })
        
    return {
        "hosted_rooms": rooms_data
    }

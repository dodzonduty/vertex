from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from pydantic import BaseModel

from app.api import deps
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.team_invitation import TeamInvitation, InvitationStatus
from app.models.student import Student
from app.models.user import User
from app.models.opportunity import Opportunity

router = APIRouter(prefix="/api/enrollment", tags=["enrollment"])

# Pydantic Schemas
class SoloEnrollmentInput(BaseModel):
    opportunity_id: str

class GroupEnrollmentInput(BaseModel):
    opportunity_id: str
    team_name: str
    invited_emails: List[str] = []

class EnrollmentResponse(BaseModel):
    message: str
    team_id: str
    enrollment_type: str  # "solo" or "group"

class InvitationResponse(BaseModel):
    status: str

@router.post("/solo", response_model=EnrollmentResponse)
def enroll_solo(
    enrollment_in: SoloEnrollmentInput,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Enroll a student solo in a hackathon/opportunity
    """
    # Get student profile
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
    
    # Verify opportunity exists
    opportunity = db.query(Opportunity).filter(
        Opportunity.opportunity_id == enrollment_in.opportunity_id
    ).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    # Check if already enrolled
    existing_team = db.query(Team).join(TeamMember).filter(
        Team.opportunity_id == enrollment_in.opportunity_id,
        TeamMember.student_id == student.student_id
    ).first()
    
    if existing_team:
        raise HTTPException(status_code=400, detail="You are already enrolled in this event")
    
    # Create solo team
    team_id = f"T-{uuid.uuid4().hex[:8]}"
    new_team = Team(
        team_id=team_id,
        name=f"{student.full_name}'s Solo Team",
        description="Solo participant",
        status="full",  # Solo teams are automatically full
        created_by_student_id=student.student_id,
        opportunity_id=enrollment_in.opportunity_id
    )
    db.add(new_team)
    
    # Add student as member
    team_member = TeamMember(
        team_id=team_id,
        student_id=student.student_id,
        role="Solo Participant"
    )
    db.add(team_member)
    
    db.commit()
    
    return EnrollmentResponse(
        message=f"Successfully registered to compete at {opportunity.title}!",
        team_id=team_id,
        enrollment_type="solo"
    )

@router.post("/group", response_model=EnrollmentResponse)
def enroll_group(
    enrollment_in: GroupEnrollmentInput,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Enroll a student with a group in a hackathon/opportunity
    Creates a team and sends invitations to specified emails
    """
    # Get student profile
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
    
    # Verify opportunity exists and get max participants
    opportunity = db.query(Opportunity).filter(
        Opportunity.opportunity_id == enrollment_in.opportunity_id
    ).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    # Check max participants limit
    max_participants = None
    if opportunity.description and isinstance(opportunity.description, dict):
        max_str = opportunity.description.get("maxParticipants")
        if max_str and max_str.lower() != "unlimited":
            try:
                max_participants = int(max_str)
            except:
                pass
    
    # Validate team size
    total_members = 1 + len(enrollment_in.invited_emails)  # Creator + invitees
    if max_participants and total_members > max_participants:
        raise HTTPException(
            status_code=400,
            detail=f"Team size ({total_members}) exceeds maximum allowed participants ({max_participants})"
        )
    
    # Check if already enrolled
    existing_team = db.query(Team).join(TeamMember).filter(
        Team.opportunity_id == enrollment_in.opportunity_id,
        TeamMember.student_id == student.student_id
    ).first()
    
    if existing_team:
        raise HTTPException(status_code=400, detail="You are already enrolled in this event")
    
    # Create team
    team_id = f"T-{uuid.uuid4().hex[:8]}"
    new_team = Team(
        team_id=team_id,
        name=enrollment_in.team_name,
        description=f"Team for {opportunity.title}",
        status="open" if enrollment_in.invited_emails else "full",
        created_by_student_id=student.student_id,
        opportunity_id=enrollment_in.opportunity_id
    )
    db.add(new_team)
    
    # Add creator as member
    team_member = TeamMember(
        team_id=team_id,
        student_id=student.student_id,
        role="Team Leader"
    )
    db.add(team_member)
    
    # Create invitations
    invitation_count = 0
    for email in enrollment_in.invited_emails:
        if not email.strip():
            continue
            
        # Check if invitee exists in system
        invitee_user = db.query(User).filter(User.email == email.strip()).first()
        invitee_student = None
        if invitee_user:
            invitee_student = db.query(Student).filter(Student.user_id == invitee_user.user_id).first()
        
        invitation_id = f"INV-{uuid.uuid4().hex[:8]}"
        invitation = TeamInvitation(
            invitation_id=invitation_id,
            team_id=team_id,
            inviter_student_id=student.student_id,
            invitee_email=email.strip(),
            invitee_student_id=invitee_student.student_id if invitee_student else None,
            status=InvitationStatus.PENDING
        )
        db.add(invitation)
        invitation_count += 1
    
    db.commit()
    
    invitation_msg = ""
    if invitation_count > 0:
        invitation_msg = f" Invitations sent to {invitation_count} member(s)."
    
    return EnrollmentResponse(
        message=f"Successfully created team '{enrollment_in.team_name}' for {opportunity.title}!{invitation_msg}",
        team_id=team_id,
        enrollment_type="group"
    )

@router.get("/my-enrollments")
def get_my_enrollments(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get all enrollments (teams) for the current student
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
    
    # Get all teams the student is a member of
    teams = db.query(Team).join(TeamMember).filter(
        TeamMember.student_id == student.student_id
    ).all()
    
    enrollments = []
    for team in teams:
        opportunity = db.query(Opportunity).filter(
            Opportunity.opportunity_id == team.opportunity_id
        ).first()
        
        if not opportunity:
            continue
        
        desc = opportunity.description if isinstance(opportunity.description, dict) else {}
        
        enrollments.append({
            "team_id": team.team_id,
            "team_name": team.name,
            "opportunity_id": opportunity.opportunity_id,
            "opportunity_title": opportunity.title,
            "opportunity_type": opportunity.type,
            "status": team.status,
            "role": "Solo" if "Solo" in team.name else "Team",
            "event_date": desc.get("date", "TBA"),
            "event_end_date": desc.get("endDate"),
            "location": desc.get("location", "Remote"),
            "image": desc.get("image", "")
        })
    
    return {"enrollments": enrollments}

@router.get("/my-invitations")
def get_my_invitations(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Get all pending team invitations for the current student
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
    
    # Get invitations by email or student_id, but exclude invitations sent by the current user
    invitations = db.query(TeamInvitation).filter(
        (TeamInvitation.invitee_email == current_user.email) |
        (TeamInvitation.invitee_student_id == student.student_id),
        TeamInvitation.inviter_student_id != student.student_id,  # Exclude self-invitations
        TeamInvitation.status == InvitationStatus.PENDING
    ).all()
    
    result = []
    for inv in invitations:
        team = db.query(Team).filter(Team.team_id == inv.team_id).first()
        if not team:
            continue
            
        opportunity = db.query(Opportunity).filter(
            Opportunity.opportunity_id == team.opportunity_id
        ).first()
        
        inviter = db.query(Student).filter(Student.student_id == inv.inviter_student_id).first()
        
        result.append({
            "invitation_id": inv.invitation_id,
            "team_id": team.team_id,
            "team_name": team.name,
            "inviter_name": inviter.full_name if inviter else "Unknown",
            "opportunity_title": opportunity.title if opportunity else "Unknown Event",
            "opportunity_id": opportunity.opportunity_id if opportunity else None,
            "created_at": inv.created_at.isoformat() if inv.created_at else None
        })
    
    return {"invitations": result}

@router.post("/invitations/{invitation_id}/accept", response_model=InvitationResponse)
def accept_invitation(
    invitation_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Accept a team invitation
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
    
    invitation = db.query(TeamInvitation).filter(
        TeamInvitation.invitation_id == invitation_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    if invitation.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Invitation already processed")
    
    # Verify this invitation is for the current user
    if invitation.invitee_email != current_user.email and invitation.invitee_student_id != student.student_id:
        raise HTTPException(status_code=403, detail="This invitation is not for you")
    
    # Update invitation status
    invitation.status = InvitationStatus.ACCEPTED
    invitation.invitee_student_id = student.student_id  # Link to student if not already
    
    # Add student to team
    team_member = TeamMember(
        team_id=invitation.team_id,
        student_id=student.student_id,
        role="Team Member"
    )
    db.add(team_member)
    
    db.commit()
    
    return InvitationResponse(status="accepted")

@router.post("/invitations/{invitation_id}/decline", response_model=InvitationResponse)
def decline_invitation(
    invitation_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Decline a team invitation
    """
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required")
    
    invitation = db.query(TeamInvitation).filter(
        TeamInvitation.invitation_id == invitation_id
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    if invitation.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Invitation already processed")
    
    # Verify this invitation is for the current user
    if invitation.invitee_email != current_user.email and invitation.invitee_student_id != student.student_id:
        raise HTTPException(status_code=403, detail="This invitation is not for you")
    
    # Update invitation status
    invitation.status = InvitationStatus.DECLINED
    invitation.invitee_student_id = student.student_id  # Link to student if not already
    
    db.commit()
    
    return InvitationResponse(status="declined")

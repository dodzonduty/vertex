from sqlalchemy import String, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin
import enum

class InvitationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"

class TeamInvitation(Base, TimestampMixin):
    """
    TEAM_INVITATION model
    Represents an invitation for a student to join a team
    """
    __tablename__ = "team_invitation"
    
    invitation_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    team_id: Mapped[str] = mapped_column(ForeignKey("team.team_id", ondelete="CASCADE"))
    inviter_student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"))
    invitee_email: Mapped[str] = mapped_column(String(255))
    invitee_student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"), nullable=True)
    status: Mapped[InvitationStatus] = mapped_column(SQLEnum(InvitationStatus), default=InvitationStatus.PENDING)
    
    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="invitations")
    inviter: Mapped["Student"] = relationship("Student", foreign_keys=[inviter_student_id])
    invitee: Mapped["Student"] = relationship("Student", foreign_keys=[invitee_student_id], back_populates="team_invitations")

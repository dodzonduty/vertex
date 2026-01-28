from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class TeamMember(Base, TimestampMixin):
    """
    TEAM_MEMBER model
    """
    __tablename__ = "team_member"
    
    team_id: Mapped[str] = mapped_column(ForeignKey("team.team_id", ondelete="CASCADE"), primary_key=True)
    student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="members")
    student: Mapped["Student"] = relationship("Student", back_populates="team_memberships")

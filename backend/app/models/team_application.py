from sqlalchemy import String, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base, TimestampMixin

class TeamApplication(Base, TimestampMixin):
    """
    TEAM_APPLICATION model
    """
    __tablename__ = "team_application"
    
    team_app_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    team_opening_id: Mapped[str] = mapped_column(ForeignKey("team_opening.opening_id", ondelete="SET NULL"), nullable=True)
    team_id: Mapped[str] = mapped_column(ForeignKey("team.team_id", ondelete="CASCADE"))
    applicant_student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"))
    message: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Pending") # Pending | Approved | Rejected
    applied_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="team_applications")
    applicant: Mapped["Student"] = relationship("Student", back_populates="team_applications")
    opening: Mapped["TeamOpening"] = relationship("TeamOpening", back_populates="applications")
    votes: Mapped[list["JoinRequestVote"]] = relationship("JoinRequestVote", back_populates="team_application", cascade="all, delete-orphan")

from sqlalchemy import String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base, TimestampMixin

class JoinRequestVote(Base, TimestampMixin):
    """
    JOIN_REQUEST_VOTE model
    """
    __tablename__ = "join_request_vote"
    
    vote_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    team_app_id: Mapped[str] = mapped_column(ForeignKey("team_application.team_app_id", ondelete="CASCADE"))
    voter_student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"))
    vote: Mapped[bool] = mapped_column(Boolean, nullable=False) # True=Accept, False=Deny
    voted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    team_application: Mapped["TeamApplication"] = relationship("TeamApplication", back_populates="votes")
    voter: Mapped["Student"] = relationship("Student", back_populates="votes")

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base, TimestampMixin

class Application(Base, TimestampMixin):
    """
    APPLICATION model - Student or Team applying to Opportunity
    """
    __tablename__ = "application"
    
    application_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    opportunity_id: Mapped[str] = mapped_column(ForeignKey("opportunity.opportunity_id", ondelete="CASCADE"))
    student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"), nullable=True)
    team_id: Mapped[str] = mapped_column(ForeignKey("team.team_id", ondelete="CASCADE"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=True)
    applied_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    opportunity: Mapped["Opportunity"] = relationship("Opportunity", back_populates="applications")
    student: Mapped["Student"] = relationship("Student", back_populates="applications")
    team: Mapped["Team"] = relationship("Team", back_populates="applications")

from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base, TimestampMixin

class BadgeAssignment(Base, TimestampMixin):
    """
    BADGE_ASSIGNMENT model - Generic assignment
    """
    __tablename__ = "badge_assignment"
    
    badge_id: Mapped[str] = mapped_column(ForeignKey("badge.badge_id", ondelete="CASCADE"), primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(50), primary_key=True) # student | project
    entity_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    assigned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    badge: Mapped["Badge"] = relationship("Badge", back_populates="assignments")

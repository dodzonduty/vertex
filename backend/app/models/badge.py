from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Badge(Base, TimestampMixin):
    """
    BADGE model
    """
    __tablename__ = "badge"
    
    badge_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    criteria: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    # Relationships
    assignments: Mapped[list["BadgeAssignment"]] = relationship("BadgeAssignment", back_populates="badge", cascade="all, delete-orphan")

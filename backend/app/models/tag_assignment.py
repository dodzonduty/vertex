from sqlalchemy import String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class TagAssignment(Base, TimestampMixin):
    """
    TAG_ASSIGNMENT model - Generic assignment
    """
    __tablename__ = "tag_assignment"
    
    tag_id: Mapped[str] = mapped_column(ForeignKey("tag.tag_id", ondelete="CASCADE"), primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(50), primary_key=True) # student | project | team_opening | opportunity
    entity_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=True)
    
    # Relationships
    tag: Mapped["Tag"] = relationship("Tag", back_populates="assignments")

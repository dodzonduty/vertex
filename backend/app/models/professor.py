from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Professor(Base, TimestampMixin):
    """
    PROFESSOR model
    """
    __tablename__ = "professor"
    
    professor_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.user_id", ondelete="CASCADE"), unique=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    institution: Mapped[str] = mapped_column(String(255), nullable=True)
    research_summary: Mapped[str] = mapped_column(Text, nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="professor")
    # Professor creates opportunities (mapped via polymorphic/generic id in Opportunity or specific relationship)

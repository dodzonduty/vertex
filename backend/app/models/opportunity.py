from sqlalchemy import String, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Opportunity(Base, TimestampMixin):
    """
    OPPORTUNITY model - Created by COMPANY or PROFESSOR
    """
    __tablename__ = "opportunity"
    
    opportunity_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # hackathon | thesis | sponsorship
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[dict] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=True)
    created_by_type: Mapped[str] = mapped_column(String(50), nullable=False) # company | professor
    created_by_id: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Relationships
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="opportunity", cascade="all, delete-orphan")

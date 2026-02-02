from typing import Optional
from sqlalchemy import String, ForeignKey, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Company(Base, TimestampMixin):
    """
    COMPANY model
    """
    __tablename__ = "company"
    
    company_id: Mapped[str] = mapped_column(String(50), primary_key=True)  # Prefix C-
    user_id: Mapped[str] = mapped_column(ForeignKey("user.user_id", ondelete="CASCADE"), unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # e.g. Start-up, Growth Stage, Enterprise

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="company")

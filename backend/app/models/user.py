from sqlalchemy import String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum
from .base import Base, TimestampMixin


class UserRole(str, Enum):
    """User role enumeration"""
    STUDENT = "student"
    PROFESSOR = "professor"
    COMPANY = "company"
    ADMIN = "admin"


class User(Base, TimestampMixin):
    """
    USER model
    """
    __tablename__ = "user"
    
    user_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=True)
    
    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    professor: Mapped["Professor"] = relationship("Professor", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company: Mapped["Company"] = relationship("Company", back_populates="user", uselist=False, cascade="all, delete-orphan")
    social_links: Mapped[list["SocialLink"]] = relationship("SocialLink", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"

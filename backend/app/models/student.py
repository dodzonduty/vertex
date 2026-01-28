from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Student(Base, TimestampMixin):
    """
    STUDENT model
    """
    __tablename__ = "student"
    
    student_id: Mapped[str] = mapped_column(String(50), primary_key=True) # Prefix S-
    user_id: Mapped[str] = mapped_column(ForeignKey("user.user_id", ondelete="CASCADE"), unique=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    university: Mapped[str] = mapped_column(String(255), nullable=True)
    degree_level: Mapped[str] = mapped_column(String(100), nullable=True)
    Email_Address: Mapped[str] = mapped_column(String(255), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="student")
    certificates: Mapped[list["Certificate"]] = relationship("Certificate", back_populates="student", cascade="all, delete-orphan")
    cvs: Mapped[list["CV"]] = relationship("CV", back_populates="student", cascade="all, delete-orphan")
    projects: Mapped[list["Project"]] = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    team_memberships: Mapped[list["TeamMember"]] = relationship("TeamMember", back_populates="student", cascade="all, delete-orphan")
    team_applications: Mapped[list["TeamApplication"]] = relationship("TeamApplication", back_populates="applicant", cascade="all, delete-orphan")
    votes: Mapped[list["JoinRequestVote"]] = relationship("JoinRequestVote", back_populates="voter", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    # Tags and Badges via generic assignment logic or specific relationships if needed

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Team(Base, TimestampMixin):
    """
    TEAM model
    """
    __tablename__ = "team"
    
    team_id: Mapped[str] = mapped_column(String(50), primary_key=True) # Prefix T-
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_by_student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    members: Mapped[list["TeamMember"]] = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    openings: Mapped[list["TeamOpening"]] = relationship("TeamOpening", back_populates="team", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="team", cascade="all, delete-orphan")
    team_applications: Mapped[list["TeamApplication"]] = relationship("TeamApplication", back_populates="team", cascade="all, delete-orphan")

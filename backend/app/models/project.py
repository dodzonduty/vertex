from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Project(Base, TimestampMixin):
    """
    PROJECT model - Owned by a STUDENT
    """
    __tablename__ = "project"
    
    project_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    owner_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    repo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    repo_fingerprint: Mapped[str] = mapped_column(String(255), nullable=True) # sha256_hash
    
    # Relationships
    owner: Mapped["Student"] = relationship("Student", back_populates="projects")
    ai_analyses: Mapped[list["AIAnalysis"]] = relationship(
        "AIAnalysis",
        primaryjoin="and_(Project.project_id==AIAnalysis.entity_id, AIAnalysis.entity_type=='project')",
        foreign_keys="AIAnalysis.entity_id",
        back_populates="project",
        cascade="all, delete-orphan",
        overlaps="ai_analyses"
    )
    # Tags and Badges via generic assignment

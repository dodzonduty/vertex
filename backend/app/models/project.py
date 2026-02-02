from typing import Optional, List
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
    
    @property
    def description(self) -> Optional[str]:
        if not self.ai_analyses or len(self.ai_analyses) == 0:
            return None
        # Sort by generated_at descending
        latest = sorted(self.ai_analyses, key=lambda x: (x.generated_at or x.created_at), reverse=True)[0]
        if latest.output_json:
            return latest.output_json.get("description")
        return None

    @property
    def tags(self) -> List[str]:
        if not self.ai_analyses or len(self.ai_analyses) == 0:
            return []
        latest = sorted(self.ai_analyses, key=lambda x: (x.generated_at or x.created_at), reverse=True)[0]
        if latest.output_json:
            return latest.output_json.get("tags", [])
        return []
    
    @property
    def strengths(self) -> List[str]:
        if not self.ai_analyses or len(self.ai_analyses) == 0:
            return []
        latest = sorted(self.ai_analyses, key=lambda x: (x.generated_at or x.created_at), reverse=True)[0]
        if latest.output_json:
            return latest.output_json.get("strengths", [])
        return []

    @property
    def weaknesses(self) -> List[str]:
        if not self.ai_analyses or len(self.ai_analyses) == 0:
            return []
        latest = sorted(self.ai_analyses, key=lambda x: (x.generated_at or x.created_at), reverse=True)[0]
        if latest.output_json:
            # Note: Project schema uses 'weaknesses' but analysis output might use 'improvements' or 'weaknesses'
            return latest.output_json.get("weaknesses", latest.output_json.get("improvements", []))
        return []
    
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

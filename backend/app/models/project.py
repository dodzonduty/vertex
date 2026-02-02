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
    description: Mapped[str] = mapped_column(Text, nullable=True)
    repo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    tags_json: Mapped[str] = mapped_column(Text, nullable=True) # JSON string of tags
    strengths_json: Mapped[str] = mapped_column(Text, nullable=True)
    weaknesses_json: Mapped[str] = mapped_column(Text, nullable=True)
    repo_fingerprint: Mapped[str] = mapped_column(String(255), nullable=True) # sha256_hash
    
    @property
    def tags(self) -> list[str]:
        import json
        if self.tags_json:
            try:
                return json.loads(self.tags_json)
            except:
                return []
        return []
    
    @tags.setter
    def tags(self, value: list[str]):
        import json
        self.tags_json = json.dumps(value) if value else "[]"

    @property
    def strengths(self) -> list[str]:
        import json
        if self.strengths_json:
            try:
                return json.loads(self.strengths_json)
            except:
                return []
        return []

    @strengths.setter
    def strengths(self, value: list[str]):
        import json
        self.strengths_json = json.dumps(value) if value else "[]"

    @property
    def weaknesses(self) -> list[str]:
        import json
        if self.weaknesses_json:
            try:
                return json.loads(self.weaknesses_json)
            except:
                return []
        return []

    @weaknesses.setter
    def weaknesses(self, value: list[str]):
        import json
        self.weaknesses_json = json.dumps(value) if value else "[]"
    
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

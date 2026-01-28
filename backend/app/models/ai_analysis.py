from sqlalchemy import String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base, TimestampMixin

class AIAnalysis(Base, TimestampMixin):
    """
    AI_ANALYSIS model
    """
    __tablename__ = "ai_analysis"
    
    analysis_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    task_id: Mapped[str] = mapped_column(ForeignKey("ai_task.task_id", ondelete="CASCADE"))
    prompt_id: Mapped[str] = mapped_column(ForeignKey("ai_prompt.prompt_id", ondelete="CASCADE"))
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False) # student | project | professor | opportunity | cv | team_opening
    entity_id: Mapped[str] = mapped_column(String(50), nullable=False)
    input_hash: Mapped[str] = mapped_column(String(255), nullable=True) # sha256(content)
    output_json: Mapped[dict] = mapped_column(JSON, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    task: Mapped["AITask"] = relationship("AITask", back_populates="analyses")
    prompt: Mapped["AIPrompt"] = relationship("AIPrompt", back_populates="analyses")
    
    # Specific relationships for convenience
    project: Mapped["Project"] = relationship(
        "Project", 
        primaryjoin="and_(AIAnalysis.entity_id==Project.project_id, AIAnalysis.entity_type=='project')", 
        foreign_keys=[entity_id], 
        back_populates="ai_analyses", 
        viewonly=True,
        overlaps="ai_analyses"
    )
    cv: Mapped["CV"] = relationship(
        "CV", 
        primaryjoin="and_(AIAnalysis.entity_id==CV.cv_id, AIAnalysis.entity_type=='cv')", 
        foreign_keys=[entity_id], 
        back_populates="ai_analyses", 
        viewonly=True,
        overlaps="ai_analyses"
    )
    student: Mapped["Student"] = relationship(
        "Student",
        primaryjoin="and_(AIAnalysis.entity_id==Student.student_id, AIAnalysis.entity_type=='student')",
        foreign_keys=[entity_id],
        viewonly=True,
        overlaps="ai_analyses"
    )
    opportunity: Mapped["Opportunity"] = relationship(
        "Opportunity",
        primaryjoin="and_(AIAnalysis.entity_id==Opportunity.opportunity_id, AIAnalysis.entity_type=='opportunity')",
        foreign_keys=[entity_id],
        viewonly=True,
        overlaps="ai_analyses"
    )

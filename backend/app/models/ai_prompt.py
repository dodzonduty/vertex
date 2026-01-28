from sqlalchemy import String, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class AIPrompt(Base, TimestampMixin):
    """
    AI_PROMPT model
    """
    __tablename__ = "ai_prompt"
    
    prompt_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    task_id: Mapped[str] = mapped_column(ForeignKey("ai_task.task_id", ondelete="CASCADE"))
    prompt_text: Mapped[str] = mapped_column(Text, nullable=False)
    prompt_version: Mapped[str] = mapped_column(String(50), nullable=True)
    output_schema: Mapped[dict] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Relationships
    task: Mapped["AITask"] = relationship("AITask", back_populates="prompts")
    analyses: Mapped[list["AIAnalysis"]] = relationship("AIAnalysis", back_populates="prompt", cascade="all, delete-orphan")

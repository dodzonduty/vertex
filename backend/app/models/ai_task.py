from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class AITask(Base, TimestampMixin):
    """
    AI_TASK model
    """
    __tablename__ = "ai_task"
    
    task_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    task_code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False) # CV_ANALYSIS | GITHUB_ANALYSIS | etc.
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Relationships
    prompts: Mapped[list["AIPrompt"]] = relationship("AIPrompt", back_populates="task", cascade="all, delete-orphan")
    analyses: Mapped[list["AIAnalysis"]] = relationship("AIAnalysis", back_populates="task", cascade="all, delete-orphan")

from sqlalchemy import String, Float, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from .base import Base, TimestampMixin

class MatchResult(Base, TimestampMixin):
    """
    MATCH_RESULT model
    """
    __tablename__ = "match_result"
    
    match_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    source_entity_type: Mapped[str] = mapped_column(String(50), nullable=False) # student | company
    source_entity_id: Mapped[str] = mapped_column(String(50), nullable=False)
    target_entity_type: Mapped[str] = mapped_column(String(50), nullable=False) # student | project | professor
    target_entity_id: Mapped[str] = mapped_column(String(50), nullable=False)
    match_type: Mapped[str] = mapped_column(String(100), nullable=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    explanation: Mapped[dict] = mapped_column(JSON, nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

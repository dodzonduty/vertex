from sqlalchemy import String, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class CV(Base, TimestampMixin):
    """
    CV model
    """
    __tablename__ = "cv"
    
    cv_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"))
    raw_text: Mapped[str] = mapped_column(Text, nullable=True)
    parsed_json: Mapped[dict] = mapped_column(JSON, nullable=True)
    
    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="cvs")
    ai_analyses: Mapped[list["AIAnalysis"]] = relationship(
        "AIAnalysis",
        primaryjoin="and_(CV.cv_id==AIAnalysis.entity_id, AIAnalysis.entity_type=='cv')",
        foreign_keys="AIAnalysis.entity_id",
        back_populates="cv",
        cascade="all, delete-orphan",
        overlaps="ai_analyses"
    )

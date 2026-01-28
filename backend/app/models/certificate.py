from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base, TimestampMixin

class Certificate(Base, TimestampMixin):
    """
    CERTIFICATE model
    """
    __tablename__ = "certificate"
    
    certificate_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    student_id: Mapped[str] = mapped_column(ForeignKey("student.student_id", ondelete="CASCADE"))
    certificate_name: Mapped[str] = mapped_column(String(255), nullable=False)
    issuer: Mapped[str] = mapped_column(String(255), nullable=False)
    obtained_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="certificates")

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Tag(Base, TimestampMixin):
    """
    TAG model
    """
    __tablename__ = "tag"
    
    tag_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # skill | domain | role
    
    # Relationships
    assignments: Mapped[list["TagAssignment"]] = relationship("TagAssignment", back_populates="tag", cascade="all, delete-orphan")

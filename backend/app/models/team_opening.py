from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class TeamOpening(Base, TimestampMixin):
    """
    TEAM_OPENING model
    """
    __tablename__ = "team_opening"
    
    opening_id: Mapped[str] = mapped_column(String(50), primary_key=True)
    team_id: Mapped[str] = mapped_column(ForeignKey("team.team_id", ondelete="CASCADE"))
    query_description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Open") # Open | Closed
    
    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="openings")
    applications: Mapped[list["TeamApplication"]] = relationship("TeamApplication", back_populates="opening", cascade="all, delete-orphan")

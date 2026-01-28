from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class SocialLink(Base, TimestampMixin):
    """
    SOCIAL_LINK model
    """
    __tablename__ = "social_link"
    
    social_link: Mapped[str] = mapped_column(String(255), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user.user_id", ondelete="CASCADE"))
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    username: Mapped[str] = mapped_column(String(100), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="social_links")

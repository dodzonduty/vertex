from typing import Optional
from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin

class Student(Base, TimestampMixin):
    """
    STUDENT model
    """
    __tablename__ = "student"
    
    student_id: Mapped[str] = mapped_column(String(50), primary_key=True) # Prefix S-
    user_id: Mapped[str] = mapped_column(ForeignKey("user.user_id", ondelete="CASCADE"), unique=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    university: Mapped[str] = mapped_column(String(255), nullable=True)
    degree_level: Mapped[str] = mapped_column(String(100), nullable=True)
    Email_Address: Mapped[str] = mapped_column(String(255), nullable=True)
    
    @property
    def github_url(self) -> Optional[str]:
        if not self.user or not self.user.social_links:
            return None
        for link in self.user.social_links:
            if link.url and "github.com" in link.url.lower():
                return link.url
        return None

    @property
    def linkedin_url(self) -> Optional[str]:
        if not self.user or not self.user.social_links:
            return None
        for link in self.user.social_links:
            if link.url and "linkedin.com" in link.url.lower():
                return link.url
        return None

    @property
    def bio(self) -> Optional[str]:
        if not self.cvs or len(self.cvs) == 0:
            return None
        # Robust sorting by updated_at
        ordered_cvs = sorted([cv for cv in self.cvs if cv.updated_at], key=lambda x: x.updated_at, reverse=True)
        if not ordered_cvs:
            return None
        latest_cv = ordered_cvs[0]
        if latest_cv.parsed_json:
            return latest_cv.parsed_json.get("professional_bio")
        return None

    @property
    def ats_score(self) -> int:
        if not self.cvs or len(self.cvs) == 0:
            return 0
        ordered_cvs = sorted([cv for cv in self.cvs if cv.updated_at], key=lambda x: x.updated_at, reverse=True)
        if not ordered_cvs:
            return 0
        latest_cv = ordered_cvs[0]
        if latest_cv.parsed_json:
            score = latest_cv.parsed_json.get("ats_compatibility", 0)
            try:
                return int(score)
            except (TypeError, ValueError):
                return 0
        return 0

    @property
    def skills(self) -> list[str]:
        """Skills from CV parsed_json or TagAssignment; fallback to empty list."""
        if self.cvs:
            ordered = sorted([c for c in self.cvs if c.updated_at], key=lambda x: x.updated_at, reverse=True)
            if ordered and ordered[0].parsed_json:
                s = ordered[0].parsed_json.get("skills", [])
                return s if isinstance(s, list) else []
        return []
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="student")
    certificates: Mapped[list["Certificate"]] = relationship("Certificate", back_populates="student", cascade="all, delete-orphan")
    cvs: Mapped[list["CV"]] = relationship("CV", back_populates="student", cascade="all, delete-orphan")
    projects: Mapped[list["Project"]] = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    team_memberships: Mapped[list["TeamMember"]] = relationship("TeamMember", back_populates="student", cascade="all, delete-orphan")
    team_applications: Mapped[list["TeamApplication"]] = relationship("TeamApplication", back_populates="applicant", cascade="all, delete-orphan")
    team_invitations: Mapped[list["TeamInvitation"]] = relationship("TeamInvitation", foreign_keys="[TeamInvitation.invitee_student_id]", back_populates="invitee", cascade="all, delete-orphan")
    votes: Mapped[list["JoinRequestVote"]] = relationship("JoinRequestVote", back_populates="voter", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    # Tags and Badges via generic assignment logic or specific relationships if needed

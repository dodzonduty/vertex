"""
Vertex Database Models (SQLAlchemy)
Strictly adhering to the provided ERD
"""

from .base import Base, TimestampMixin
from .user import User
from .student import Student
from .professor import Professor
from .company import Company
from .social_link import SocialLink
from .certificate import Certificate
from .cv import CV
from .project import Project
from .team import Team
from .team_member import TeamMember
from .team_opening import TeamOpening
from .team_application import TeamApplication
from .join_request_vote import JoinRequestVote
from .opportunity import Opportunity
from .application import Application
from .tag import Tag
from .tag_assignment import TagAssignment
from .badge import Badge
from .badge_assignment import BadgeAssignment
from .ai_task import AITask
from .ai_prompt import AIPrompt
from .ai_analysis import AIAnalysis
from .match_result import MatchResult

__all__ = [
    "Base",
    "TimestampMixin",
    "User",
    "Student",
    "Professor",
    "Company",
    "SocialLink",
    "Certificate",
    "CV",
    "Project",
    "Team",
    "TeamMember",
    "TeamOpening",
    "TeamApplication",
    "JoinRequestVote",
    "Opportunity",
    "Application",
    "Tag",
    "TagAssignment",
    "Badge",
    "BadgeAssignment",
    "AITask",
    "AIPrompt",
    "AIAnalysis",
    "MatchResult",
]

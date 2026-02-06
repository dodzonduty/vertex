"""
API routes for Tags
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api import deps
from app.models.tag import Tag
from app.models.opportunity import Opportunity
from app.schemas.tag import TagResponse

router = APIRouter(prefix="/api/tags", tags=["tags"])

@router.get("")
@router.get("/")
def read_tags(
    type: str = "hackathons",
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve all tags as strings with # prefix.
    If no tags are in the database, returns default tags based on type.
    """
    # Normalize type
    type_lower = type.lower() if type else "hackathons"
    
    tags = db.query(Tag).offset(skip).limit(limit).all()
    
    if not tags:
        # Fallback/Default tags if database is empty
        if "hackathon" in type_lower:
            tag_names = ["#All", "#AI_Safety", "#Frontend", "#Web3", "#Sustainability", "#ZeroKnowledge", "#Mobile", "#GameDev", "#DeFi", "#Cloud"]
        else:
            tag_names = ["#All", "#Internship", "#Grant", "#Research", "#Fellowship", "#Mentorship", "#OpenSource", "#Startup", "#Hardware"]
        return {"tags": tag_names}

    tag_names = ["#All"] + [f"#{tag.name}" if not tag.name.startswith("#") else tag.name for tag in tags]
    return {"tags": tag_names}

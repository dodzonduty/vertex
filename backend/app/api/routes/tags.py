"""
API routes for Tags
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.models.tag import Tag
from app.schemas.tag import TagResponse

router = APIRouter(prefix="/api/tags", tags=["tags"])

@router.get("/")
def read_tags(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve all tags as strings with # prefix
    """
    tags = db.query(Tag).offset(skip).limit(limit).all()
    tag_names = ["#All"] + [f"#{tag.name}" if not tag.name.startswith("#") else tag.name for tag in tags]
    return {"tags": tag_names}

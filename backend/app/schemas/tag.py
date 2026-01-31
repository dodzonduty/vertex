"""
Pydantic schemas for Tag
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TagBase(BaseModel):
    name: str
    type: str  # skill | domain | role

class TagCreate(TagBase):
    tag_id: str

class TagUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None

class TagResponse(TagBase):
    tag_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

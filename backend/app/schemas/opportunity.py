"""
Pydantic schemas for Opportunity
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class OpportunityBase(BaseModel):
    type: str  # hackathon | thesis | sponsorship
    title: str
    description: Optional[Any] = None
    status: Optional[str] = None
    created_by_type: str  # company | professor
    created_by_id: str

class OpportunityCreate(OpportunityBase):
    opportunity_id: str

class OpportunityUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[Any] = None
    status: Optional[str] = None
    created_by_type: Optional[str] = None
    created_by_id: Optional[str] = None

class OpportunityResponse(OpportunityBase):
    opportunity_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

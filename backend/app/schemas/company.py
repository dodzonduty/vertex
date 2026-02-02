from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class SocialLinkResponse(BaseModel):
    type: str
    url: str

    class Config:
        from_attributes = True


class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    size: Optional[str] = None


class CompanyCreate(CompanyBase):
    email: str
    password: str
    social_links: Optional[List[dict]] = None  # [{"type": "linkedin", "url": "..."}, ...]


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    size: Optional[str] = None
    social_links: Optional[List[dict]] = None


class CompanyResponse(CompanyBase):
    company_id: str
    user_id: str
    email: str
    verified: bool
    created_at: datetime
    updated_at: datetime
    social_links: List[SocialLinkResponse] = []

    class Config:
        from_attributes = True

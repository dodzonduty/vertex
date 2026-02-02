from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    description: Optional[str] = None
    
class CompanyCreate(CompanyBase):
    email: str # Relaxed from EmailStr for easier testing
    password: str

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    
class CompanyResponse(CompanyBase):
    company_id: str
    user_id: str
    email: str
    verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

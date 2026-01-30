"""
Pydantic schemas for student endpoints
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class StudentBase(BaseModel):
    """Base student schema"""
    full_name: str
    university: Optional[str] = None
    degree_level: Optional[str] = None
    Email_Address: Optional[EmailStr] = None


class StudentResponse(BaseModel):
    """Student profile response"""
    student_id: str
    user_id: str
    full_name: str
    university: Optional[str] = None
    degree_level: Optional[str] = None
    Email_Address: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class StudentDetailResponse(BaseModel):
    """Detailed student profile with user info"""
    student_id: str
    user_id: str
    full_name: str
    university: Optional[str] = None
    degree_level: Optional[str] = None
    Email_Address: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # User info
    email: str
    role: str
    status: Optional[str] = None
    
    class Config:
        from_attributes = True


class StudentCreate(StudentBase):
    """Schema for creating a student"""
    email: EmailStr
    password: str


class StudentUpdate(BaseModel):
    """Schema for updating student profile"""
    full_name: Optional[str] = None
    university: Optional[str] = None
    degree_level: Optional[str] = None
    Email_Address: Optional[EmailStr] = None

"""
Pydantic schemas for authentication endpoints
"""
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Request body for login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response for successful login"""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    role: str
    status: str | None = None


class UserResponse(BaseModel):
    """User response schema"""
    user_id: str
    email: str
    role: str
    status: str | None = None
    
    class Config:
        from_attributes = True

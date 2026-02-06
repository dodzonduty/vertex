from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from pydantic import BaseModel

from app.db.session import get_db
from app.models import Company, User
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/companies", tags=["companies"])

# Pydantic schemas
class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    size: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class CompanyResponse(BaseModel):
    company_id: str
    name: str
    industry: Optional[str] = None
    description: Optional[str] = None
    size: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    verified: bool
    email: str
    role: str
    status: Optional[str] = None
    profile_photo_url: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/me", response_model=CompanyResponse)
def get_my_company_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the current company's profile
    """
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can access company profiles"
        )
    
    company = db.query(Company).options(
        joinedload(Company.user)
    ).filter(Company.user_id == current_user.user_id).first()
    
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )
    
    # Map User fields to Company object for schema compatibility
    company.email = current_user.email
    company.role = current_user.role
    company.status = current_user.status
    company.profile_photo_url = current_user.profile_photo_url
    
    return company

@router.patch("/me", response_model=CompanyResponse)
def update_my_company_profile(
    company_update: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update the current company's profile
    """
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only companies can update company profiles"
        )
    
    company = db.query(Company).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )
    
    # Update fields
    update_data = company_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)
    
    try:
        db.commit()
        db.refresh(company)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    # Map User fields for response
    company.email = current_user.email
    company.role = current_user.role
    company.status = current_user.status
    company.profile_photo_url = current_user.profile_photo_url
    
    return company

@router.get("/", response_model=List[dict])
def list_companies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all companies (paginated)
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of company profiles with user information
    """
    companies = db.query(Company).options(
        joinedload(Company.user)
    ).offset(skip).limit(limit).all()
    
    # Format response to include user profile photo
    result = []
    for company in companies:
        result.append({
            "company_id": company.company_id,
            "name": company.name,
            "industry": company.industry,
            "description": company.description,
            "size": company.size,
            "verified": company.verified,
            "user": {
                "email": company.user.email if company.user else None,
                "profile_photo_url": company.user.profile_photo_url if company.user else None
            }
        })
    
    return result

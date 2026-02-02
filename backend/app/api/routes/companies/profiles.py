from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
import uuid
import logging

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models import User, Company, SocialLink
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse, SocialLinkResponse
from app.core.security import get_password_hash

router = APIRouter()
logger = logging.getLogger(__name__)


def _infer_link_type(url: str) -> str:
    if not url:
        return "website"
    url_lower = url.lower()
    if "linkedin.com" in url_lower:
        return "linkedin"
    if "github.com" in url_lower:
        return "github"
    if "twitter.com" in url_lower or "x.com" in url_lower:
        return "twitter"
    return "website"


def _social_links_from_user(user: User) -> list:
    if not user or not user.social_links:
        return []
    return [
        {"type": _infer_link_type(link.url), "url": link.url}
        for link in user.social_links if link.url
    ]

@router.post("/signup", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def signup_company(
    company_in: CompanyCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new company account and profile
    """
    # Check if user already exists
    user = db.query(User).filter(User.email == company_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )
    
    # Create User record
    user_id = f"U-{uuid.uuid4().hex[:8]}"
    company_id = f"C-{uuid.uuid4().hex[:8]}"
    
    new_user = User(
        user_id=user_id,
        email=company_in.email,
        password_hash=get_password_hash(company_in.password),
        role="company",
        status="active"
    )
    db.add(new_user)
    
    # Create Company record
    new_company = Company(
        company_id=company_id,
        user_id=user_id,
        name=company_in.name,
        industry=company_in.industry,
        description=company_in.description,
        verified=False
    )
    db.add(new_company)
    
    try:
        db.commit()
        db.refresh(new_company)
        # Manually attach email for response model since it's on the User relationship
        new_company.email = new_user.email
        return new_company
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating company: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create account: {str(e)}")

@router.get("/me", response_model=CompanyResponse)
def get_my_company_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current logged-in company profile
    """
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only company accounts can access this profile."
        )

    company = db.query(Company).options(
        joinedload(Company.user).joinedload(User.social_links)
    ).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found.")

    company.email = current_user.email
    company.social_links = [
        SocialLinkResponse(type=_infer_link_type(s.url), url=s.url)
        for s in (company.user.social_links or []) if s.url
    ]
    return company

@router.patch("/me", response_model=CompanyResponse)
def update_my_company_profile(
    company_update: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update current company profile
    """
    if current_user.role != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only company accounts can update this profile."
        )

    company = db.query(Company).options(
        joinedload(Company.user).joinedload(User.social_links)
    ).filter(Company.user_id == current_user.user_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found.")

    update_data = company_update.model_dump(exclude_unset=True)
    social_links_data = update_data.pop("social_links", None)

    for field, value in update_data.items():
        if hasattr(company, field):
            setattr(company, field, value)

    if social_links_data is not None:
        # Replace existing social links
        existing = db.query(SocialLink).filter(SocialLink.user_id == current_user.user_id).all()
        for sl in existing:
            db.delete(sl)
        for item in social_links_data:
            url = item.get("url") if isinstance(item, dict) else getattr(item, "url", None)
            if url:
                link_type = item.get("type", "website") if isinstance(item, dict) else getattr(item, "type", "website")
                sl = SocialLink(
                    social_link=f"social_{uuid.uuid4().hex[:12]}",
                    user_id=current_user.user_id,
                    url=url,
                    username=url.rstrip("/").split("/")[-1] if "/" in url else None
                )
                db.add(sl)

    try:
        db.commit()
        db.refresh(company)
        company.email = current_user.email
        company.social_links = [
            SocialLinkResponse(type=_infer_link_type(s.url), url=s.url)
            for s in (company.user.social_links or []) if s.url
        ]
        return company
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating company: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

"""
Authentication API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session
import base64

from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.models import User
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user


router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login endpoint - authenticate user and return JWT token
    
    Args:
        credentials: Email and password
        db: Database session
        
    Returns:
        Access token and user information
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email (Case-insensitive)
    search_email = credentials.email.lower().strip()
    user = db.query(User).filter(func.lower(User.email) == search_email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.user_id, "email": user.email, "role": user.role}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.user_id,
        email=user.email,
        role=user.role
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information
    
    Args:
        current_user: Current authenticated user from token
        
    Returns:
        User information
    """
    return current_user


@router.post("/upload-profile-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload profile photo for the current user (student or company)
    Converts image to base64 and stores in database
    """
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Check file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 5MB limit"
        )
    
    # Convert to base64
    base64_image = base64.b64encode(content).decode('utf-8')
    data_url = f"data:{file.content_type};base64,{base64_image}"
    
    # Update user's profile photo
    current_user.profile_photo_url = data_url
    db.commit()
    
    return {
        "message": "Profile photo uploaded successfully",
        "profile_photo_url": data_url
    }

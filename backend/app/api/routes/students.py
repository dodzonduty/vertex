"""
Student API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.student import StudentResponse, StudentDetailResponse
from app.models import Student, User
from app.api.deps import get_current_user


router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("/{student_id}", response_model=StudentDetailResponse)
def get_student_profile(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get student profile by ID
    
    Args:
        student_id: Student ID (S- prefix)
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Student profile with user information
        
    Raises:
        HTTPException: If student not found
    """
    # Query student with user relationship
    student = db.query(Student).filter(Student.student_id == student_id).first()
    
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found"
        )
    
    # Build detailed response
    return StudentDetailResponse(
        student_id=student.student_id,
        user_id=student.user_id,
        full_name=student.full_name,
        university=student.university,
        degree_level=student.degree_level,
        Email_Address=student.Email_Address,
        created_at=student.created_at,
        updated_at=student.updated_at,
        email=student.user.email,
        role=student.user.role,
        status=student.user.status
    )


@router.get("/", response_model=list[StudentResponse])
def list_students(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all students (paginated)
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of student profiles
    """
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

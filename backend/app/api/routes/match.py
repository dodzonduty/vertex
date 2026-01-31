"""
API routes for Trending and Perfect Match
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api import deps
from app.models.tag import Tag
from app.models.tag_assignment import TagAssignment
from app.models.opportunity import Opportunity
from app.models.student import Student

router = APIRouter(prefix="/api", tags=["trending", "matching"])

@router.get("/trending")
def get_trending_tags(
    db: Session = Depends(deps.get_db),
    type: str = "hackathon",
    limit: int = 5
):
    """
    Get top trending tags based on opportunity counts.
    Real implementation using count() on TagAssignment.
    """
    opportunity_type = type.rstrip('s').lower()
    
    # Query to count tags assigned to opportunities of a specific type
    trending = db.query(
        Tag.name.label("tag"),
        func.count(TagAssignment.tag_id).label("count")
    ).join(
        TagAssignment, Tag.tag_id == TagAssignment.tag_id
    ).join(
        Opportunity, (TagAssignment.entity_id == Opportunity.opportunity_id) & (TagAssignment.entity_type == "opportunity")
    ).filter(
        Opportunity.type == opportunity_type
    ).group_by(
        Tag.tag_id
    ).order_by(
        func.count(TagAssignment.tag_id).desc()
    ).limit(limit).all()
    
    return [{"tag": f"#{t.tag}" if not t.tag.startswith("#") else t.tag, "count": t.count} for t in trending]

@router.get("/vertex-connect")
def get_vertex_connect(
    db: Session = Depends(deps.get_db),
    type: str = "hackathon"
):
    """
    Get network data for vertex connect.
    Mocking for now as complete network graph requires more complex setup,
    but returning real-feeling data that matches frontend expectation.
    """
    # In a real implementation, we would query student's connections, university alumni, etc.
    return [
        {
            "context": "3 Stanford Alumni attending",
            "avatars": [
                "https://i.pravatar.cc/150?u=1",
                "https://i.pravatar.cc/150?u=2"
            ],
            "more_count": 1
        },
        {
            "context": "5 Connections interested",
            "avatars": [
                "https://i.pravatar.cc/150?u=3"
            ],
            "more_count": 4
        }
    ]

@router.get("/perfect-match")
def get_perfect_matches(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
    type: str = "hackathon",
    limit: int = 3
):
    """
    Correlates user's tags with opportunity tags to find the best matches.
    """
    opportunity_type = type.rstrip('s').lower()
    
    # 1. Get current student
    student = db.query(Student).filter(Student.user_id == current_user.user_id).first()
    if not student:
        return []

    # 2. Get student's tags
    student_tag_ids = db.query(TagAssignment.tag_id).filter(
        (TagAssignment.entity_id == student.student_id) & 
        (TagAssignment.entity_type == "student")
    ).all()
    student_tag_ids = [t[0] for t in student_tag_ids]

    if not student_tag_ids:
        # Fallback to general matches or empty if no tags
        return []

    # 3. Find opportunities sharing these tags
    # Scoring based on number of overlapping tags
    matches = db.query(
        Opportunity,
        func.count(TagAssignment.tag_id).label("overlap_count")
    ).join(
        TagAssignment, 
        (TagAssignment.entity_id == Opportunity.opportunity_id) & 
        (TagAssignment.entity_type == "opportunity")
    ).filter(
        Opportunity.type == opportunity_type,
        TagAssignment.tag_id.in_(student_tag_ids)
    ).group_by(
        Opportunity.opportunity_id
    ).order_by(
        func.count(TagAssignment.tag_id).desc()
    ).limit(limit).all()

    results = []
    for opp, count in matches:
        # Simple match percentage calculation
        # In a real app, this would be more complex (Jaccard similarity, etc.)
        match_perc = min(99, 70 + (count * 10)) 
        
        # Get one tech tag for display
        tech_tag = db.query(Tag.name).join(TagAssignment).filter(
            (TagAssignment.entity_id == opp.opportunity_id) & 
            (TagAssignment.entity_type == "opportunity") & 
            (Tag.type == "skill")
        ).first()

        results.append({
            "title": opp.title,
            "match": f"{match_perc}%",
            "tech": tech_tag[0] if tech_tag else "General"
        })

    return results

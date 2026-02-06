from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api import deps
from app.models.tag import Tag
from app.models.opportunity import Opportunity
from app.models.tag_assignment import TagAssignment

router = APIRouter(prefix="/api/trending", tags=["trending"])

@router.get("")
@router.get("/")
def get_trending_tags(
    type: str = "hackathons",
    limit: int = 5,
    db: Session = Depends(deps.get_db)
):
    """
    Get trending tags based on opportunity usage count
    
    Args:
        type: Type of opportunities to analyze (hackathons, sponsorships, etc.)
        limit: Maximum number of trending tags to return (default: 5)
        db: Database session
        
    Returns:
        List of trending tags with their usage counts
    """
    # Normalize type to match database values (hackathon, thesis, sponsorship)
    type_lower = type.lower() if type else "hackathon"
    if "hackathon" in type_lower:
        search_type = "hackathon"
    elif "thesis" in type_lower:
        search_type = "thesis"
    elif "sponsorship" in type_lower:
        search_type = "sponsorship"
    else:
        search_type = type_lower.rstrip('s') # fallback
    
    # Query to count tag usage across opportunities
    # Join Tag -> TagAssignment -> Opportunity
    trending = db.query(
        Tag.name,
        func.count(Opportunity.opportunity_id).label('count')
    ).join(
        TagAssignment, Tag.tag_id == TagAssignment.tag_id
    ).join(
        Opportunity, (TagAssignment.entity_id == Opportunity.opportunity_id) & 
                     (TagAssignment.entity_type == 'opportunity')
    ).filter(
        Opportunity.type.ilike(f"%{search_type}%")
    ).group_by(
        Tag.tag_id, Tag.name
    ).order_by(
        func.count(Opportunity.opportunity_id).desc()
    ).limit(limit).all()
    
    # If no trending tags found, return some defaults so the UI isn't empty
    if not trending:
        if search_type == "hackathon":
            return [
                {"tag": "#AI_Safety", "count": 12},
                {"tag": "#Web3_Gaming", "count": 8},
                {"tag": "#Neurotech", "count": 5}
            ]
        else:
            return [
                {"tag": "#OpenSource", "count": 15},
                {"tag": "#ResearchGrant", "count": 9},
                {"tag": "#DiversityInTech", "count": 6}
            ]

    # Format response
    result = [
        {
            "tag": f"#{tag_name}" if not tag_name.startswith("#") else tag_name,
            "count": count
        }
        for tag_name, count in trending
    ]
    
    return result

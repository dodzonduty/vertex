"""
API routes for Opportunities
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.api import deps
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityResponse

router = APIRouter(prefix="/api", tags=["opportunities"])

@router.get("/opportunities/", response_model=List[OpportunityResponse])
def read_opportunities(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve all opportunities
    """
    opportunities = db.query(Opportunity).offset(skip).limit(limit).all()
    return opportunities

@router.get("/opportunities-list")
def read_opportunities_list(
    db: Session = Depends(deps.get_db),
    type: str = "hackathons",
    tags: Optional[List[str]] = Query(None),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve opportunities list (Real replacement for mock)
    Matches the structure expected by the frontend: {"count": int, "results": list}
    """
    from app.models.tag import Tag
    from app.models.tag_assignment import TagAssignment

    query = db.query(Opportunity)
    
    # 1. Filter by category type (hackathons -> hackathon)
    opportunity_type = type.rstrip('s').lower()
    if opportunity_type:
        query = query.filter(Opportunity.type == opportunity_type)
    
    # 2. Filter by Tags (if provided)
    if tags:
        # Filter out '#All' if present and strip '#' prefix from others
        clean_tags = []
        for t in tags:
            if t.lower() not in ["#all", "all"]:
                # Strip '#' if present
                clean_t = t.lstrip('#')
                clean_tags.append(clean_t)
        
        if clean_tags:
            # Join with TagAssignment to filter
            # We want opportunities that have AT LEAST ONE of the tags (OR logic for tags)
            # Match case-insensitively or exactly based on seed data
            query = query.join(
                TagAssignment, 
                (TagAssignment.entity_id == Opportunity.opportunity_id) & 
                (TagAssignment.entity_type == "opportunity")
            ).join(Tag).filter(
                # Match either with or without the hash in the DB (resilient)
                (Tag.name.in_(clean_tags)) | 
                (Tag.name.in_([f"#{t}" for t in clean_tags]))
            )
            
            # Use distinct to avoid duplicate opportunities if they match multiple tags
            query = query.distinct()
    
    
    total_count = query.count()
    results = query.offset(skip).limit(limit).all()
    
    # 3. Format results for frontend
    formatted_results = []
    for opp in results:
        desc_data = opp.description if isinstance(opp.description, dict) else {}
        
        # Fetch tags for badges
        opp_tags = db.query(Tag.name).join(TagAssignment).filter(
            (TagAssignment.entity_id == opp.opportunity_id) & 
            (TagAssignment.entity_type == "opportunity")
        ).limit(2).all()
        
        badges = []
        for i, t in enumerate(opp_tags):
            style = "blue-soft" if i == 0 else "gray-soft"
            badges.append({"text": t.name, "style": style})
            
        formatted_results.append({
            "id": opp.opportunity_id,
            "title": opp.title,
            "host": desc_data.get("host", "Unknown Host"),
            "badges": badges or [{"text": opp.type.capitalize(), "style": "blue-soft"}],
            "summary": desc_data.get("summary", "No summary available"),
            "date": desc_data.get("date", "TBA"),
            "price": desc_data.get("price", "TBA"),
            "location": desc_data.get("location", "Remote"),
            "image": desc_data.get("image", "https://via.placeholder.com/300x200"),
            "type": opp.type
        })
    
    return {
        "count": total_count,
        "results": formatted_results
    }

@router.get("/opportunities/count")
def get_opportunities_count(db: Session = Depends(deps.get_db)):
    """
    Get total count of opportunities
    """
    count = db.query(func.count(Opportunity.opportunity_id)).scalar()
    return {"count": count}

@router.get("/opportunities/top", response_model=List[OpportunityResponse])
def get_top_opportunities(
    db: Session = Depends(deps.get_db),
    limit: int = 5
):
    """
    Get top opportunities (recently created for now)
    """
    opportunities = db.query(Opportunity).order_by(Opportunity.created_at.desc()).limit(limit).all()
    return opportunities

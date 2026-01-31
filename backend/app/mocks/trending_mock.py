from fastapi import APIRouter
import random

router = APIRouter(prefix="/api/trending", tags=["trending"])

@router.get("/")
async def get_trending_tags(type: str = "hackathon"):
    """Returns a list of trending tags with counts based on opportunity type."""
    
    # Mock Data
    hackathon_trends = [
        {"tag": "#AI_Safety", "count": 24},
        {"tag": "#Web3_Gaming", "count": 18},
        {"tag": "#Neurotech", "count": 12},
        {"tag": "#ZeroKnowledge", "count": 9},
        {"tag": "#GreenTech", "count": 7}
    ]
    
    sponsorship_trends = [
        {"tag": "#OpenSource", "count": 32},
        {"tag": "#ResearchGrant", "count": 15},
        {"tag": "#DiversityInTech", "count": 14},
        {"tag": "#CloudNative", "count": 10},
        {"tag": "#EdTech", "count": 8}
    ]
    
    # Normalize type key
    is_hackathon = "hackathon" in type.lower()
    
    # Select basic list
    data = hackathon_trends if is_hackathon else sponsorship_trends
    
    # Return top 3-5 items
    return data[:5]

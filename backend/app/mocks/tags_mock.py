from fastapi import APIRouter

router = APIRouter(prefix="/api/tags", tags=["tags"])

@router.get("/")
async def get_tags(type: str = "hackathon"):
    """Returns a list of tags based on the opportunity type."""
    data = {
        "hackathons": [
            "#All", "#AI_Safety", "#Frontend", "#Web3", "#Sustainability", 
            "#ZeroKnowledge", "#Mobile", "#GameDev", "#DeFi", "#Cloud"
        ],
        "sponsorships": [
            "#All", "#Internship", "#Grant", "#Research", "#Fellowship", 
            "#Mentorship", "#OpenSource", "#Startup", "#Hardware"
        ]
    }
    # Normalize type to match keys (basic error handling/fallback)
    key = "hackathons" if "hackathon" in type.lower() else "sponsorships"
    return {"tags": data.get(key, data["hackathons"])}

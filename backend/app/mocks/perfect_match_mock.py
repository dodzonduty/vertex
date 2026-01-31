from fastapi import APIRouter

router = APIRouter(prefix="/api/perfect-match", tags=["perfect-match"])

@router.get("/")
async def get_perfect_matches(type: str = "hackathon"):
    """Returns a list of perfect matches based on opportunity type."""
    
    # Mock Data
    hackathon_matches = [
        {"title": "Neural Dev Summit", "match": "98%", "tech": "AI/ML"},
        {"title": "Web3 Frontier Hack", "match": "92%", "tech": "Solidity"},
        {"title": "Global Game Jam", "match": "89%", "tech": "Unity"}
    ]
    
    sponsorship_matches = [
        {"title": "Privacy Shield Grant", "match": "95%", "tech": "Research"},
        {"title": "Open Source Fellow", "match": "91%", "tech": "Rust"},
        {"title": "Cloud Native Grant", "match": "87%", "tech": "Kubernetes"}
    ]
    
    # Normalize type key
    is_hackathon = "hackathon" in type.lower()
    
    # Select basic list
    data = hackathon_matches if is_hackathon else sponsorship_matches
    
    # Return top 3
    return data[:3]

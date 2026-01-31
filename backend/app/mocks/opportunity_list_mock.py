from fastapi import APIRouter, Query
from typing import List, Optional

router = APIRouter(prefix="/api/opportunities-list", tags=["opportunities-list"])

@router.get("/")
async def get_opportunities_list(type: str = "hackathons", tags: Optional[List[str]] = Query(None)):
    """
    Returns a list of filtered opportunities.
    Supports filtering by 'type' and multiple 'tags' (OR logic).
    """
    
    # --- Mock Images ---
    img_ai = "https://lh3.googleusercontent.com/aida-public/AB6AXuCQWjvyaaToRihbJ_vk23_-pbgti7yXe_itSyT5IuWwTW7luvIYPkAXx0uWXmU8YGmIxUSyQyMDWPoFd9WU5R5WkE-D-OzFGOvZqBn53B9Qnzlrdgb9dor5o6tXMiSxNw-J6tCnQDGmEycAGGQwK48B-PyhKJn60UoLIy8jx0-IdcMfjqpR17JGHbzocYwsMJ8nfrPWF44hSTwvcfZCRxMkWLopysgLqp3SiJp_WgVkFMQehQgzeB6kqmONX5tLJESi0mdrYNMr7NA"
    img_green = "https://lh3.googleusercontent.com/aida-public/AB6AXuCLIp0CIanjTtvkxnyAXdaEozBHpAQHExEEx64XXLNm5_a8vX1Jq4FROlTxUjfTU7_DfcJVXzcxIPqI8QWg3aiqPxsfpDywiM4-xztZzL1bl1vDbYuMLSFx8Dtm7z1bzXL-JTDJyoJybgPXWS8IDs3rqa3sr9-YDgJEnPraB-FGQpcwXBTj6awOxOBbp1bfbFFDcIGVafaWIiJVSPw8xfPupvatbR7mu76CQgSr9JyUonggUOyh-8px8lUrE9kVRCmm4wn2bJAfHyA"
    img_fin = "https://lh3.googleusercontent.com/aida-public/AB6AXuDBvcqg_z4t5DtImBaF4zDg1paUIXivAjiu0n3bTJpS__wzsQQ8fTjIo5ThuSuTP1puePPfX3W8klgrWopzhwEuo_F-oqNhM-JTwb2UpbOuAUZhtfHZU26mz6tmlCXzTuuDeOEarNRaPPirtfDkzynNPlwErvz5kBvcSfmS3tyGP4nPDxAzdgKIBxLw9YTfzizh4yxi8o76B2l7D0R1Vd8_EZpU5bgTojtkWTtdlExRh-dg2RJ0Ocasmg4phBDl3HFl3k4nK3k3bPk"
    img_quant = "https://lh3.googleusercontent.com/aida-public/AB6AXuAp8YPsSejPInMICvOmgu4F2_EVDQxpbvygjd6wuuOZ7a8D8DtJ9o6s8p9yfaIbEgewA-9EK089KOU2hW_qdUm7zLUBx0C3q4aJoy0BIO6UdTA7RpQh8DVt1DC_zcIZRmjX_eTn-t0OTJVetB8Wf8hyUehicsGiajLA-14XsLVJWMV1Gx_CKvaF6kYW5vCwVLHu_35XtKFy4YbD4gRXAX8BDh8ioh4SCzTaO_6i_BqxIEfAAEogZSJkXccXbX2PxrLuj8TVfwIIS-A"

    # --- Base Data Sets ---
    
    hackathons = [
        {
            "id": "h1",
            "title": "Global AI Hack 2026",
            "host": "AI Nexus Foundation",
            "badges": [{"text": "Recommended", "style": "blue-solid"}, {"text": "Hackathon", "style": "blue-soft"}],
            "summary": "Build the next generation of autonomous agents in this 48-hour global challenge.",
            "date": "Oct 12-14, 2026",
            "price": "$10,000 Prize",
            "location": "Remote",
            "image": img_ai,
            "tags": ["#AI_Safety", "#Web3"]
        },
        {
            "id": "h2",
            "title": "GreenTech Sprint",
            "host": "EcoInnovate",
            "badges": [{"text": "Hackathon", "style": "amber-soft"}, {"text": "#Sustainability", "style": "gray-soft"}],
            "summary": "Accelerating sustainable solutions through rapid prototyping and deep tech.",
            "date": "Dec 01-05, 2026",
            "price": "$7,500 Prize",
            "location": "Hybrid • London",
            "image": img_green,
            "tags": ["#Sustainability", "#GreenTech"]
        },
        {
             "id": "h3",
            "title": "Quantum Leap Hack",
            "host": "Q-Systems Lab",
            "badges": [{"text": "Advanced", "style": "purple-soft"}, {"text": "Hackathon", "style": "blue-soft"}],
            "summary": "Explore the frontiers of quantum computing and build algorithms for the future.",
            "date": "Jan 20-22, 2027",
            "price": "$20,000 Prize",
            "location": "Zurich",
            "image": img_quant,
            "tags": ["#Quantum", "#Research"]
        }
    ]

    sponsorships = [
         {
            "id": "s1",
            "title": "Future Finance Fellowship",
            "host": "Global Bank Corp",
            "badges": [{"text": "Fellowship", "style": "purple-solid"}, {"text": "Finance", "style": "amber-soft"}],
            "summary": "A 6-month fellowship for students interested in the intersection of AI and Finance.",
            "date": "Apply by Nov 15",
            "price": "$5,000 Grant",
            "location": "New York",
            "image": img_fin,
            "tags": ["#FinTech", "#Web3"]
        },
        {
            "id": "s2",
            "title": "Open Source Grant",
            "host": "Linux Foundation",
            "badges": [{"text": "Grant", "style": "emerald-solid"}, {"text": "Open Source", "style": "blue-soft"}],
            "summary": "Supporting developers who are building critical open source infrastructure.",
            "date": "Rolling Basis",
            "price": "$2,000/mo",
            "location": "Remote",
            "image": img_ai,
            "tags": ["#OpenSource", "#Backend"]
        }
    ]

    # --- Filtering Logic ---
    
    # 1. Filter by Type
    is_hackathon = "hackathon" in type.lower()
    data_pool = hackathons if is_hackathon else sponsorships
    
    # 2. Filter by Tags (if provided)
    # Filter strategies: 
    # - If tags contains "#All", ignore filtering.
    # - Else, return items that possess at least ONE of the selected tags.
    
    selected_tags = tags if tags else []
    
    # Normalize: if '#All' is present or list is empty, treat as no filter
    if selected_tags and "#All" not in selected_tags and "#all" not in [t.lower() for t in selected_tags]:
        filtered_pool = []
        for item in data_pool:
            item_tags = [t.lower() for t in item.get("tags", [])]
            # Check for overlap
            if any(sel.lower() in item_tags for sel in selected_tags):
                filtered_pool.append(item)
        data_pool = filtered_pool

    # 3. Calculate Counts
    total_count = 128 if is_hackathon else 42  # Mock total count for "Showing X results"
    
    return {
        "count": total_count,
        "results": data_pool
    }

from fastapi import APIRouter

router = APIRouter(prefix="/api/vertex-connect", tags=["vertex-connect"])

@router.get("/")
async def get_vertex_connect(type: str = "hackathon"):
    """
    Returns network activity data based on opportunity type.
    
    RESPONSE CONTRACT (Critical for Real Implementation):
    Return a list of objects representing groups of connections.
    Each object MUST contain:
    - `context` (str): Text describing the opportunity or event (e.g., "at AI Hack '26").
    - `avatars` (List[str]): A list of image URLs (icons) representing the students/users attending.
    - `more_count` (int): Number of additional people not shown in the avatars list.
    
    This ensures the UI can render "Student Icons + Context" as requested.
    """
    
    # Mock Images
    avatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCKhzgbOX7dojRT4Udhgarlw6jjkbOHTpMWq-ORt2lAwxIoJc-qv9xjAH-cW0YLVimXKyyehuBbE5PHTPYmrAeJrYUPruPccE1LhiBph9VspqnggkZilrlgxsu-A46UErZa3KtbPjLKtmoJQI6ZHyAgk_LH8TOP5PhWlA6d9Q_BaQCg6qb2hE4PdSQZj65hmmk6zBnoR7anyd07ywianWxDFxvUDKNTQBC7DJJoIcaHWIwUTWqnVsKkUvGx2b6qBr-X5xpkUM8p1VI",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCuR6oZ4b0rdwgyFfN1tkq_qnGJAa211dbmNhFQ-iomkk6j-srV9kBLVBCuIX4YlyGIlomer-3cq8gAofI-8arfipnWPhSpOqq9zHFw0S09gbqNhcHDs5tmT-xRqrucjq8fq0gPI3godyzlqzTVzVZEmED__nXsKsG-JmfcdEuMyFzXP6jDtu6aH1Ex52rlW8nMreWj78iy06yo6kqdRGY7o_Hd6nVB6cQ1AHP3zwS3oXU75BKu8LnLOCPXUnD0iKX-qRmX1T9kACg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC-6gWa-8i5eAcNz7nsE6-Bc3yEZob7EeBkhGDc3iGd59wHtA_0LE9PxZME3qa9i0JcEEzBoiyMEdX-LPKJFNM1vBsR-o6h4-BcZkWRAEOao5OoHHyzKXaecGZKswF64O-4O1P4jBRaMg0p5C7pX2JlkHvKsP71zQAz_wsrhIIdsHurGLz-iHUr5NIdMtW84osD1GVsvbCkpFZ5R-os5CkRRBwZVR1pHcjyYJFtoBkd6ns5JBLKcO4Vsj6UsEaDn4ohk-HH5Qim0Zw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCmonHusA3D0sD9uQQiqt-0tEmXNZscOfAWUfPSLhEaAd2JdocDXnsnBXrlbKEZi0yYizpdDjLDWTuZ8QETtZizRqa6ugRRV50ZlQhj6a3cGEk_pFP3bKNCLsfLutkMSUZvvjOYlEuG7ORUJ_eec5r1klL3zHf7CiC_Jt9pDt9NTcDWQ4Ee6-1xsRUkMXDOcYOjORsMkM_8UxshDn0bb-yGt1wBToA6FRQBBkmwJj_gz3m8_S1nfXDK2e2_D0PY_IFtZlQehNMqUaM",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDEMBjaAuzZyqnt1VnE9HnPIif7PGlYj1UhOhckaKPDPLgTOqcNxI9jy6BU8MM07eP4npTBFiinddazkY2waoWhFYEORrjOSH9l29sAPgCkiJMneWd0LXAgxKLvQonclVEtPv0rJASe7vpIsTrbuiDAsQHz_ud5QIC1-j8THJNNSkjKjEd1r9nXsPrHtYpXjZIH5PQMZbVYTTzzHn0_PzTIgNimddRggyICqSDDFSS9S23b88YoSoM_oHsiTcxMzzN75Q3t9laAk6U"
    ]
    
    # Mock Data
    hackathon_data = [
        {
            "context": "at AI Hack '26",
            "avatars": [avatars[0], avatars[1], avatars[2]],
            "more_count": 12
        },
        {
            "context": "at ETHGlobal SF",
            "avatars": [avatars[3], avatars[4]],
            "more_count": 6
        }
    ]
    
    sponsorship_data = [
        {
            "context": "at NextGen Grant",
            "avatars": [avatars[1], avatars[3], avatars[0]],
            "more_count": 18
        },
        {
            "context": "at DeepMind Research",
            "avatars": [avatars[2], avatars[4]],
            "more_count": 4
        }
    ]
    
    # Normalize type key
    is_hackathon = "hackathon" in type.lower()
    
    return hackathon_data if is_hackathon else sponsorship_data

from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict
import base64

router = APIRouter(prefix="/api/mocks/profile-picture", tags=["mocks"])

# Simple in-memory storage for demonstration
# In production, this would be a cloud storage bucket URL in the database
profile_pictures: Dict[str, str] = {}

@router.post("/upload/{user_id}")
async def upload_picture(user_id: str, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    # Store as base64 for the mock
    encoded = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{file.content_type};base64,{encoded}"
    profile_pictures[user_id] = data_url
    
    return {"user_id": user_id, "profile_picture_url": data_url}

@router.get("/{user_id}")
async def get_picture(user_id: str):
    url = profile_pictures.get(user_id)
    if not url:
        # Return a default or 404
        return {"user_id": user_id, "profile_picture_url": None}
    return {"user_id": user_id, "profile_picture_url": url}

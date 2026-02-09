"""
API routes for AI assistance using Gemini
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
import google.generativeai as genai
from typing import Optional, Dict, Any

from app.api import deps
from app.core.config import settings
from app.models.user import User
from app.models.student import Student
from app.models.company import Company
from app.models.opportunity import Opportunity
from app.models.cv import CV
from sqlalchemy import or_, func, cast, String
from sqlalchemy.orm import contains_eager

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    # We'll handle the missing key at the endpoint level to allow the app to start
    pass

import json

def search_platform_data(db: Session, query: str) -> Dict[str, Any]:
    """
    Search for relevant students, companies, and opportunities to provide structured context for AI.
    """
    results = {
        "students": [],
        "companies": [],
        "opportunities": []
    }
    
    # Split query into keywords for broader matching
    keywords = [k.strip() for k in query.split() if len(k.strip()) > 1]
    if not keywords:
        keywords = [query]
    
    search_filters = []
    for k in keywords:
        search_filters.append(f"%{k}%")

    # Search Students
    # We broaden the search to match ANY keyword in ANY field
    student_conditions = []
    for f in search_filters:
        student_conditions.extend([
            Student.full_name.ilike(f),
            Student.university.ilike(f),
            Student.degree_level.ilike(f),
            CV.raw_text.ilike(f),
            cast(CV.parsed_json, String).ilike(f)
        ])
        
    students = db.query(Student).outerjoin(CV).filter(or_(*student_conditions)).distinct(Student.student_id).limit(10).all()
    
    for s in students:
        # Robustly fetch the latest CV for this student manually to ensure data is present
        cv = db.query(CV).filter(CV.student_id == s.student_id).order_by(CV.updated_at.desc()).first()
        
        s_skills = []
        s_bio = ""
        if cv and cv.parsed_json:
            s_skills = cv.parsed_json.get("skills", [])
            s_bio = cv.parsed_json.get("professional_bio", "")
        
        results["students"].append({
            "student_id": s.student_id,
            "full_name": s.full_name,
            "university": s.university,
            "degree_level": s.degree_level,
            "ats_score": s.ats_score,
            "skills": s_skills,
            "bio": s_bio,
            "photo_url": s.user.profile_photo_url if s.user else None
        })

    # Search Companies
    company_conditions = []
    for f in search_filters:
        company_conditions.extend([
            Company.name.ilike(f),
            Company.industry.ilike(f),
            Company.description.ilike(f)
        ])
    
    companies = db.query(Company).filter(or_(*company_conditions)).limit(5).all()
    
    for c in companies:
        results["companies"].append({
            "company_id": c.company_id,
            "name": c.name,
            "industry": c.industry,
            "size": c.size,
            "description": c.description,
            "photo_url": c.user.profile_photo_url if c.user else None
        })

    # Search Opportunities
    opp_conditions = []
    for f in search_filters:
        opp_conditions.extend([
            Opportunity.title.ilike(f),
            Opportunity.type.ilike(f)
        ])
        if db.bind.dialect.name == 'postgresql':
            opp_conditions.append(cast(Opportunity.description.op('->>')('text'), String).ilike(f))
        else:
            opp_conditions.append(cast(Opportunity.description, String).ilike(f))

    opps = db.query(Opportunity).filter(or_(*opp_conditions)).limit(5).all()
    
    for o in opps:
        results["opportunities"].append({
            "opportunity_id": o.opportunity_id,
            "title": o.title,
            "type": o.type,
            "description": o.description.get('text', '') if isinstance(o.description, dict) else str(o.description)
        })

    print(f"DEBUG: Search for '{query}' found {len(results['students'])} students, {len(results['companies'])} companies, {len(results['opportunities'])} opps")
    return results

@router.post("/ask")
async def ask_ai(
    query: str = Body(..., embed=True),
    context: Optional[str] = Body(None, embed=True),
    current_user: User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db)
):
    """
    Ask Gemini for assistance based on the user's query and context. 
    Returns structured JSON with answers and matching platform records.
    """
    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured. Please set GEMINI_API_KEY in the .env file."
        )

    try:
        # Dynamically find available flash models to avoid 404s
        available_flash_models = []
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods and 'flash' in m.name.lower():
                    available_flash_models.append(m.name)
        except Exception as list_e:
            print(f"DEBUG: Could not list models: {list_e}")
            available_flash_models = ['models/gemini-1.5-flash', 'models/gemini-2.0-flash'] # Fallback list

        # Sort to prioritize 2.0 or 1.5
        available_flash_models.sort(reverse=True)
        
        # Use first available flash model as primary
        model_name = available_flash_models[0] if available_flash_models else 'models/gemini-1.5-flash'
        generation_config = {
            "response_mime_type": "application/json",
        }
        
        # Retrieve real data from DB
        platform_data = search_platform_data(db, query)
        
        # Log data summary
        print(f"DEBUG: Search for '{query}' found {len(platform_data['students'])} students, {len(platform_data['companies'])} companies, {len(platform_data['opportunities'])} opps")
        
        # Simplify data for the prompt to reduce token usage and improve matching
        prompt_students = [
            {
                "id": s["student_id"],
                "name": s["full_name"],
                "uni": s["university"],
                "degree": s["degree_level"],
                "skills": s["skills"],
                "bio": s["bio"][:200] + "..." if len(s["bio"]) > 200 else s["bio"]
            } 
            for s in platform_data["students"]
        ]
        
        # Construct system prompt
        system_prompt = f"""
        You are the Vertex Platform Assistant. Vertex is a student opportunity matching platform.
        Current User Role: {current_user.role}
        {"Current Page Context: " + context if context else ""}
        
        DATA FROM THE VERTEX DATABASE:
        {json.dumps({"students": prompt_students, "companies": platform_data["companies"], "opportunities": platform_data["opportunities"]})}
        
        TASK:
        Respond to the user's query in JSON format.
        
        JSON SCHEMA:
        {{
          "answer": "Your conversational response here. Use markdown for formatting.",
          "recommended_students": [], // Subset of IDs from the provided students data that match the query
          "recommended_companies": [], // Subset of IDs from the provided companies data that match the query
          "recommended_opportunities": [] // Subset of IDs from the provided opportunities data that match the query
        }}

        INSTRUCTIONS:
        1. DATA PRIORITY: You MUST look at the records in "DATA FROM THE VERTEX DATABASE" first.
        2. MANDATORY MATCHING: If the user's query relates to any record in the database, you MUST include its "id" in the `recommended_students`, `recommended_companies`, or `recommended_opportunities` lists.
        3. NO EXCUSES: Even if you are giving general advice, you MUST link to the best available records. For example, if you find Habeba Mostafa Desoky (degree: Undergraduate Student), she MUST be recommended for "undergraduate" or "student" queries.
        4. JSON FORMAT: You MUST return valid JSON. The `answer` field should be used for your conversational response.
        5. CONVERSATIONAL SUMMARY: Your `answer` should start by mentioning the matches you found. E.g., "I've matched your search with Habeba Mostafa Desoky, an undergraduate student..."
        6. NO GENERIC ADVICE ONLY: Only give tips if NO matches are found in the database.
        7. Be concise, authoritative, and helpful.
        """
        
        # Generate content with fallback for quota or parsing issues
        print(f"DEBUG: Calling Gemini with model={model_name}, query='{query}'")
        try:
            model = genai.GenerativeModel(model_name, generation_config=generation_config)
            response = model.generate_content([system_prompt, query])
            ai_data = json.loads(response.text)
            print(f"DEBUG: Successfully got JSON from {model_name}")
        except Exception as e:
            print(f"DEBUG: {model_name} failed: {str(e)}. Attempting dynamic fallback...")
            # Try next available flash model
            fallback_model = available_flash_models[1] if len(available_flash_models) > 1 else 'models/gemini-1.5-flash'
            if fallback_model == model_name:
                fallback_model = 'models/gemini-pro' # Ultimate fallback
            
            try:
                model = genai.GenerativeModel(fallback_model, generation_config=generation_config)
                response = model.generate_content([system_prompt, query])
                ai_data = json.loads(response.text)
                print(f"DEBUG: Successfully got JSON from fallback {fallback_model}")
            except Exception as e2:
                print(f"DEBUG: All models failed including {fallback_model}: {str(e2)}")
                # If all structured attempts fail, return a plain text answer with injected data
                return {
                    "answer": f"I found some internal matches but the AI service is currently at its usage limit. (Verified {len(platform_data['students'])} matches in database)",
                    "recommended_students": platform_data['students'][:3], 
                    "recommended_companies": platform_data['companies'][:3],
                    "recommended_opportunities": platform_data['opportunities'][:3],
                    "status": "partial_success"
                }

        # Enrich the AI's ID recommendations with the full object data for the frontend
        enriched_students = [s for s in platform_data["students"] if s["student_id"] in ai_data.get("recommended_students", [])]
        enriched_companies = [c for c in platform_data["companies"] if c["company_id"] in ai_data.get("recommended_companies", [])]
        enriched_opps = [o for o in platform_data["opportunities"] if o["opportunity_id"] in ai_data.get("recommended_opportunities", [])]

        return {
            "answer": ai_data.get("answer", "I found some matches for you."),
            "recommended_students": enriched_students,
            "recommended_companies": enriched_companies,
            "recommended_opportunities": enriched_opps,
            "status": "success"
        }
    except Exception as e:
        import traceback
        error_msg = f"AI ERROR: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        with open("ai_error.log", "a") as f:
            f.write(error_msg + "\n" + "-"*40 + "\n")
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")

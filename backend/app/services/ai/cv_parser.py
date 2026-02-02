import pdfplumber
import io
import logging
from typing import Dict, Any, Optional
from .gemini_service import gemini_service

logger = logging.getLogger(__name__)

CV_PARSING_PROMPT = """
Analyze the following text extracted from a student's CV. 
Extract the information into the following JSON format:
{
    "full_name": "Name",
    "university": "University name",
    "degree_level": "e.g. Junior, Senior, PhD, etc.",
    "email": "email address",
    "phone": "phone number",
    "github_url": "github profile url",
    "linkedin_url": "linkedin profile url",
    "professional_bio": "A 2-3 sentence professional summary based on the CV. Make it inspiring.",
    "ats_compatibility": 85,
    "skills": ["skill1", "skill2"],
    "projects": [
        {
            "title": "Project Name",
            "description": "Detailed description of what you built and used",
            "tags": ["React", "Python", "etc"],
            "repo_url": "optional url",
            "strengths": ["Well-documented", "Complex logic", "Clean architecture"],
            "improvements": ["Could add tests", "Optimize DB queries"]
        }
    ],
    "experience": [
        {"title": "role", "company": "company", "description": "desc", "date": "date"}
    ]
}

Only return the JSON. If a field is missing, use null.
"""

class CVParser:
    async def parse_cv(self, file_content: bytes) -> Dict[str, Any]:
        """
        Extract text from PDF and parse with Gemini
        """
        try:
            text = ""
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            if not text.strip():
                raise ValueError("Could not extract text from PDF. It might be a scanned image.")

            # Send to Gemini
            parsed_data = await gemini_service.generate_json(
                prompt=f"CV Text:\n{text}\n\n{CV_PARSING_PROMPT}",
                system_instruction="You are an expert HR recruitment assistant specializing in parsing CVs into structured data."
            )
            
            return parsed_data
        except Exception as e:
            logger.error(f"CV parsing error: {e}")
            raise ValueError(f"Failed to parse CV: {str(e)}")

cv_parser = CVParser()

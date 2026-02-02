import google.generativeai as genai
import json
import logging
from typing import Optional, Any, Dict
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.available_models = []
        
        if self.api_key:
            try:
                # Clean key in case of spaces
                clean_key = self.api_key.strip()
                genai.configure(api_key=clean_key)
                
                try:
                    self.available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
                except Exception as list_e:
                    logger.warning(f"Could not list models: {list_e}")
                
                self.model = genai.GenerativeModel('gemini-flash-latest')
            except Exception as e:
                self.model = None
                logger.error(f"Gemini configuration error: {e}")
        else:
            self.model = None
            logger.warning("GEMINI_API_KEY not set. Gemini services will be unavailable.")

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a structured JSON response from Gemini with fallbacks
        """
        if not self.api_key:
            raise ValueError("Gemini API key is not configured")

        # Models to try in order of preference for the FREE tier
        models_to_try = [
            'gemini-flash-latest',
            'gemini-pro-latest',
            'gemini-2.0-flash-lite-001',
            'gemini-2.0-flash-lite',
            'gemini-2.0-flash', 
            'gemini-2.5-flash-lite',
            'gemini-1.5-flash', 
            'gemini-1.5-pro', 
            'gemini-pro'
        ]
        
        # If we successfully listed models, prioritize those and ensure we try them all
        if self.available_models:
            known_models = [m.replace('models/', '') for m in self.available_models]
            # Prioritize models we know exist
            prioritized = [m for m in models_to_try if m in known_models]
            # Add any other available models that weren't in our preference list but might work
            others = [m for m in known_models if m not in prioritized]
            models_to_try = prioritized + others

        last_error = None
        for model_name in models_to_try:
            try:
                logger.info(f"Attempting AI analysis with model: {model_name}")
                
                # Setup model
                if "1.5" in model_name or "2.0" in model_name or "2.5" in model_name or "pro" in model_name or "flash" in model_name:
                    curr_model = genai.GenerativeModel(
                        model_name=model_name,
                        system_instruction=system_instruction
                    )
                else:
                    curr_model = genai.GenerativeModel(model_name=model_name)
                    if system_instruction:
                        prompt = f"{system_instruction}\n\nTask:\n{prompt}"

                # Request JSON format
                gen_config = {}
                if any(x in model_name for x in ["1.5", "2.0", "2.5", "flash", "pro"]):
                    gen_config["response_mime_type"] = "application/json"

                response = curr_model.generate_content(
                    prompt,
                    generation_config=gen_config
                )
                
                if not response.text:
                    logger.warning(f"Empty response from {model_name}")
                    continue

                content = response.text
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                return json.loads(content)
                
            except Exception as e:
                error_msg = str(e).lower()
                logger.warning(f"Model {model_name} failed: {e}")
                last_error = e
                
                # If it's a 404 (Not Found) or 429 (Quota Exceeded), try the NEXT model
                if "404" in error_msg or "not found" in error_msg or "429" in error_msg or "quota" in error_msg:
                    logger.info(f"Retrying with another model due to error with {model_name}...")
                    continue
                else:
                    # For critical errors, stop
                    break
        
        raise last_error or ValueError("AI parsing failed after trying all available models")

gemini_service = GeminiService()

import httpx
import logging
import re
from typing import Dict, Any, List, Optional
from ..ai.gemini_service import gemini_service

logger = logging.getLogger(__name__)

GITHUB_PROJECT_PROMPT = """
Based on the following repository information and README content, create a professional project summary for a developer portfolio.
Return the result in the following JSON format:
{
    "title": "Project Title",
    "description": "A clear, professional 2-3 sentence description of the project's purpose and technical implementation.",
    "tags": ["PrimaryLanguage", "Framework", "Library", "etc."],
    "repo_url": "url",
    "strengths": ["Well-documented", "Complex logic", "Clean architecture"],
    "improvements": ["Could add tests", "Optimize DB queries"]
}

Categorize the project with 3-5 relevant technical tags (e.g., 'React', 'FastAPI', 'Machine Learning').
"""

class GitHubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Vertex-Platform"
        }

    def _parse_url(self, url: str) -> Optional[tuple]:
        """Parse GitHub URL into owner and repo"""
        match = re.search(r"github\.com/([^/]+)/([^/]+)/?$", url.replace(".git", ""))
        if match:
            return match.group(1), match.group(2)
        return None

    async def extract_project(self, repo_url: str) -> Dict[str, Any]:
        """
        Extract repository info and README, then summarize with AI
        """
        parsed = self._parse_url(repo_url)
        if not parsed:
            raise ValueError("Invalid GitHub repository URL")
        
        owner, repo = parsed
        
        async with httpx.AsyncClient() as client:
            # 1. Get Repo Info
            repo_resp = await client.get(f"{self.base_url}/repos/{owner}/{repo}", headers=self.headers)
            if repo_resp.status_code != 200:
                raise ValueError(f"GitHub repository not found: {repo}")
            
            repo_data = repo_resp.json()
            
            # 2. Try to get README
            readme_text = ""
            readme_resp = await client.get(f"{self.base_url}/repos/{owner}/{repo}/readme", headers=self.headers)
            if readme_resp.status_code == 200:
                import base64
                readme_content = readme_resp.json().get("content", "")
                readme_text = base64.b64decode(readme_content).decode('utf-8', errors='ignore')

            # 3. Summarize with Gemini
            context = f"Repo: {repo}\nDescription: {repo_data.get('description')}\nREADME:\n{readme_text[:2000]}"
            
            project_data = await gemini_service.generate_json(
                prompt=f"{context}\n\n{GITHUB_PROJECT_PROMPT}",
                system_instruction="You are a technical portfolio assistant that highlights student projects."
            )
            
            # Ensure repo_url is included
            project_data["repo_url"] = repo_url
            return project_data

github_service = GitHubService()

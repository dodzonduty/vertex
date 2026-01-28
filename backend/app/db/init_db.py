"""
Database initialization and seed data
Run this after migrations to populate initial data
"""

from sqlalchemy.orm import Session
from app.models import Tag


def init_db(db: Session) -> None:
    """
    Initialize database with seed data
    This should be run after migrations
    """
    
    # Check if tags already exist
    existing_tags = db.query(Tag).count()
    if existing_tags > 0:
        print("Database already initialized. Skipping seed data.")
        return
    
    # Create initial tags for common skills and technologies
    initial_tags = [
        # Skills (Languages & Frameworks)
        Tag(tag_id="skill-python", name="Python", type="skill"),
        Tag(tag_id="skill-js", name="JavaScript", type="skill"),
        Tag(tag_id="skill-ts", name="TypeScript", type="skill"),
        Tag(tag_id="skill-java", name="Java", type="skill"),
        Tag(tag_id="skill-cpp", name="C++", type="skill"),
        Tag(tag_id="skill-react", name="React", type="skill"),
        Tag(tag_id="skill-vue", name="Vue.js", type="skill"),
        Tag(tag_id="skill-node", name="Node.js", type="skill"),
        Tag(tag_id="skill-fastapi", name="FastAPI", type="skill"),
        Tag(tag_id="skill-postgresql", name="PostgreSQL", type="skill"),
        
        # Domains
        Tag(tag_id="domain-web", name="Web Development", type="domain"),
        Tag(tag_id="domain-mobile", name="Mobile Development", type="domain"),
        Tag(tag_id="domain-ai", name="AI & Machine Learning", type="domain"),
        Tag(tag_id="domain-cyber", name="Cybersecurity", type="domain"),
        Tag(tag_id="domain-data", name="Data Science", type="domain"),
        
        # Roles
        Tag(tag_id="role-frontend", name="Frontend Developer", type="role"),
        Tag(tag_id="role-backend", name="Backend Developer", type="role"),
        Tag(tag_id="role-fullstack", name="Fullstack Developer", type="role"),
        Tag(tag_id="role-devops", name="DevOps Engineer", type="role"),
        Tag(tag_id="role-data-scientist", name="Data Scientist", type="role"),
    ]
    
    # Add all tags to the session
    db.add_all(initial_tags)
    db.commit()
    
    print(f"✅ Database initialized with {len(initial_tags)} tags")


if __name__ == "__main__":
    from app.db.session import SessionLocal
    
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlalchemy import create_engine
from app.core.config import settings
from app.models.base import Base
import app.models  # Import all models to register them with Base

def init_sqlite_db():
    print(f"Creating tables in {settings.DATABASE_URL}...")
    
    # SQLite connection args
    connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
    
    engine = create_engine(
        settings.DATABASE_URL, 
        connect_args=connect_args
    )
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")

if __name__ == "__main__":
    init_sqlite_db()

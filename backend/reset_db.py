"""
Wipe all data from the database (keeps schema intact).
Run from the backend directory:
    python reset_db.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from app.db.session import engine

def main():
    print("⚠️  This will DELETE ALL DATA from the database!")
    confirm = input("Type 'yes' to confirm: ").strip().lower()
    if confirm != 'yes':
        print("Aborted.")
        return

    with engine.connect() as conn:
        # Get all table names
        result = conn.execute(text(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'alembic_version'"
        ))
        tables = [row[0] for row in result]

        if not tables:
            print("No tables found.")
            return

        print(f"Found {len(tables)} tables: {', '.join(tables)}")

        # Truncate all tables with CASCADE
        for table in tables:
            conn.execute(text(f'TRUNCATE TABLE "{table}" CASCADE'))
            print(f"  ✓ Cleared: {table}")

        conn.commit()
        print(f"\n🧹 Done! All {len(tables)} tables cleared. Schema preserved.")

if __name__ == "__main__":
    main()

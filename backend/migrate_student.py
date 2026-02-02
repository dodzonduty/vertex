import sqlite3

def migrate():
    try:
        conn = sqlite3.connect('vertex.db')
        cursor = conn.cursor()
        cursor.execute('PRAGMA table_info(student)')
        existing_cols = [row[1] for row in cursor.fetchall()]
        print(f"Existing student columns: {existing_cols}")
        
        if 'bio' not in existing_cols:
            cursor.execute('ALTER TABLE student ADD COLUMN bio TEXT')
            print("Added 'bio'")
        if 'ats_score' not in existing_cols:
            cursor.execute('ALTER TABLE student ADD COLUMN ats_score INTEGER DEFAULT 0')
            print("Added 'ats_score'")
        if 'skills_json' not in existing_cols:
            cursor.execute('ALTER TABLE student ADD COLUMN skills_json TEXT')
            print("Added 'skills_json'")
            
        conn.commit()
        conn.close()
        print("Student migration complete")
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()

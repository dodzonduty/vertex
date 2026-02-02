import sqlite3

def migrate():
    try:
        conn = sqlite3.connect('vertex.db')
        cursor = conn.cursor()
        
        # Check project table columns
        cursor.execute('PRAGMA table_info(project)')
        existing_cols = [row[1] for row in cursor.fetchall()]
        print(f"Existing project columns: {existing_cols}")
        
        if 'tags_json' not in existing_cols:
            cursor.execute('ALTER TABLE project ADD COLUMN tags_json TEXT')
            print("Successfully added 'tags_json' column to 'project' table.")
            
        conn.commit()
        conn.close()
        print("Migration complete!")
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()

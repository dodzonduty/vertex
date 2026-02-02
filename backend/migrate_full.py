import sqlite3

def migrate():
    try:
        conn = sqlite3.connect('vertex.db')
        cursor = conn.cursor()
        
        # Student table migration
        cursor.execute('PRAGMA table_info(student)')
        existing_student_cols = [row[1] for row in cursor.fetchall()]
        print(f"Existing student columns: {existing_student_cols}")
        
        if 'github_url' not in existing_student_cols:
            cursor.execute('ALTER TABLE student ADD COLUMN github_url VARCHAR(500)')
            print("Added student.github_url")
        if 'linkedin_url' not in existing_student_cols:
            cursor.execute('ALTER TABLE student ADD COLUMN linkedin_url VARCHAR(500)')
            print("Added student.linkedin_url")
            
        # Project table migration
        cursor.execute('PRAGMA table_info(project)')
        existing_project_cols = [row[1] for row in cursor.fetchall()]
        print(f"Existing project columns: {existing_project_cols}")
        
        if 'strengths_json' not in existing_project_cols:
            cursor.execute('ALTER TABLE project ADD COLUMN strengths_json TEXT')
            print("Added project.strengths_json")
        if 'weaknesses_json' not in existing_project_cols:
            cursor.execute('ALTER TABLE project ADD COLUMN weaknesses_json TEXT')
            print("Added project.weaknesses_json")
            
        conn.commit()
        conn.close()
        print("Model-wide migration complete")
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()

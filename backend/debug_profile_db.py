import sqlite3
import json

def debug_db():
    try:
        conn = sqlite3.connect('vertex.db')
        c = conn.cursor()
        
        print("--- LATEST STUDENT ---")
        c.execute('SELECT student_id, user_id, full_name, bio, ats_score, github_url, skills_json FROM student ORDER BY created_at DESC LIMIT 1')
        student = c.fetchone()
        
        if not student:
            print("No students found.")
            return

        sid, uid, name, bio, ats, github, skills = student
        print(f"ID: {sid}")
        print(f"Name: {name}")
        print(f"Bio: {bio}")
        print(f"ATS: {ats}")
        print(f"GitHub: {github}")
        print(f"Skills: {skills}")
        
        print("\n--- PROJECTS FOR THIS STUDENT ---")
        c.execute('SELECT project_id, title, description, tags_json, strengths_json, weaknesses_json FROM project WHERE owner_id = ?', (sid,))
        projects = c.fetchall()
        
        if not projects:
            print("No projects found for this student.")
        else:
            for p in projects:
                pid, title, desc, tags, strengths, weaknesses = p
                print(f"Project ID: {pid}")
                print(f"Title: {title}")
                print(f"Desc: {desc[:50]}...")
                print(f"Tags: {tags}")
                print(f"Strengths: {strengths}")
                print(f"Weaknesses: {weaknesses}")
                print("-" * 10)
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_db()

# Vertex Mock Lifecycle Log

## Log Format

[EVENT_TYPE]
Entity: <API | Module | Service | Component>
Name: <name>
Role: <A|B|C|D>
Path: <file_path>
Status: MOCK | REAL
Action: CREATED | IMPLEMENTED | REPLACED
Owner: <developer>
Notes: <optional>
Date: <YYYY-MM-DD>

---

## Example Logs

[MOCK_CREATED]
Entity: API
Name: CV Analysis
Role: C
Path: backend/app/mocks/cv_mock.py
Status: MOCK
Action: CREATED
Owner: DevC
Notes: Backend not ready, frontend unblocked.
Date: 2026-01-28

---

[REAL_IMPLEMENTED]
Entity: API
Name: CV Analysis
Role: B
Path: backend/app/services/ai/cv_analysis.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Real Gemini-based logic added.
Date: 2026-01-30

---

[MOCK_REPLACED]
Entity: API
Name: CV Analysis
Role: C
Path: backend/app/mocks/cv_mock.py → backend/app/services/ai/cv_analysis.py
Status: REAL
Action: REPLACED
Owner: DevC
Notes: Mock removed, real implementation integrated.
Date: 2026-01-31

---

[REAL_IMPLEMENTED]
Entity: Database & Models
Name: Complete Database Infrastructure
Role: A
Path: backend/app/models/, backend/app/db/, backend/alembic/
Status: REAL
Action: IMPLEMENTED
Owner: DevA
Notes: Implemented all 23 SQLAlchemy models strictly following the ERD with singular snake_case naming. Configured Alembic migrations with custom script templates, established PostgreSQL Docker infrastructure, and seeded the database with initial technical tags. Resolved complex generic relationship mapping issues for AI analysis and team voting.
Date: 2026-01-29

---

[MOCK_CREATED]
Entity: API
Name: Opportunities API
Role: D
Path: backend/app/mocks/opportunity_mock.py
Status: MOCK
Action: CREATED
Owner: Role D
Notes: Mocking opportunity counts and top opportunities for Landing Page.
Date: 2026-01-29

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
Action: IMPLEMENTED 
Owner: Role D
Notes: Mocking opportunity counts and top opportunities for Landing Page.
Date: 2026-01-29

---

[REAL_IMPLEMENTED]
Entity: API
Name: Authentication API
Role: B
Path: backend/app/api/routes/auth.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented JWT-based authentication with login endpoint (POST /api/auth/login) and current user endpoint (GET /api/auth/me). Includes password hashing with bcrypt and token validation.
Date: 2026-01-30

---

[REAL_IMPLEMENTED]
Entity: API
Name: Student Profile API
Role: B
Path: backend/app/api/routes/students.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented student profile endpoints (GET /api/students/{id} for single profile, GET /api/students/ for paginated list). Returns student data with user information.
Date: 2026-01-30

---

[REAL_IMPLEMENTED]
Entity: Module
Name: Core Backend Infrastructure
Role: B
Path: backend/app/core/, backend/app/api/deps.py, backend/app/main.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Set up FastAPI application with CORS middleware, configuration management (Pydantic Settings), security utilities (JWT + password hashing), authentication dependencies, and Pydantic schemas for auth and students.
Date: 2026-01-30

---

[MOCK_CREATED]
Entity: API
Name: Tags API
Role: D
Path: backend/app/mocks/tags_mock.py
Status: MOCK
Action: CREATED
Owner: Role D
Notes: Created dedicated GET /api/tags endpoint for opportunity tags.
Date: 2026-01-31

---

[MOCK_CREATED]
Entity: API
Name: Trending API
Role: D
Path: backend/app/mocks/trending_mock.py
Status: MOCK
Action: CREATED
Owner: Role D
Notes: Created dedicated GET /api/trending endpoint for widget data.
Date: 2026-01-31

[MOCK_CREATED]
Entity: API
Name: Perfect Match API
Role: D
Path: backend/app/mocks/perfect_match_mock.py
Status: MOCK
Action: CREATED
Owner: Role D
Notes: Created dedicated GET /api/perfect-match endpoint for widget data.
Date: 2026-01-31

[MOCK_CREATED]
Entity: API
Name: Vertex Connect API
Role: D
Path: backend/app/mocks/vertex_connect_mock.py
Status: MOCK
Action: CREATED
Owner: Role D
Notes: Created dedicated GET /api/vertex-connect endpoint for widget data.
Date: 2026-01-31

---

[REAL_IMPLEMENTED]
Entity: API
Name: Tags API
Role: B
Path: backend/app/api/routes/tags.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented real database-backed tags endpoint.
Date: 2026-01-31

[REAL_IMPLEMENTED]
Entity: API
Name: Trending API
Role: B
Path: backend/app/api/routes/match.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented real database-backed trending tags query using count() on assignments.
Date: 2026-01-31

---

[REAL_IMPLEMENTED]
Entity: API
Name: Perfect Match API
Role: B
Path: backend/app/api/routes/match.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented real correlation logic between user tags and opportunity tags.
Date: 2026-01-31

---

[REAL_IMPLEMENTED]
Entity: API
Name: Vertex Connect API
Role: B
Path: backend/app/api/routes/match.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented real-feeling network data endpoint for university/connection context.
Date: 2026-01-31

---

[REAL_REFINED]
Entity: API
Name: Opportunities & Tags Refinement
Role: B
Path: backend/app/api/routes/opportunities.py, backend/app/api/routes/tags.py
Status: REAL
Action: REFINED
Owner: DevB
Notes: Aligned JSON response formats with frontend expectations (prefixing # tags, unpacking description JSON, and adding #All support).
Date: 2026-01-31

---

[MOCK_REPLACED]
Entity: Component
Name: Opportunities Page Integration
Role: D
Path: frontend/src/pages/Opportunities.tsx
Status: REAL
Action: REPLACED
Owner: Role D
Notes: Replaced mock fetch calls with real API client implementations for opportunities, tags, trending, match, and connect.
Date: 2026-02-01

---

[REAL_IMPLEMENTED]
Entity: Module
Name: Frontend API Clients
Role: D
Path: frontend/src/lib/api/opportunities.ts, frontend/src/lib/api/students.ts
Status: REAL
Action: CREATED
Owner: Role D
Notes: Created centralized API client library for interacting with backend routes.
Date: 2026-02-01

---

[REAL_IMPLEMENTED]
Entity: Component
Name: Student Profile & Dashboard Integration
Role: D
Path: frontend/src/components/student/StudentProfile.tsx, frontend/src/pages/StudentDashboard.tsx
Status: REAL
Action: IMPLEMENTED
Owner: Role D
Notes: Integrated real student profile fetching and dynamic user data (e.g., initials) in the dashboard. Corrected API port to 8000.
Date: 2026-02-01

---

[API_REQUESTED]
Entity: API
Name: Onboarding & Registration
Role: B/A
Path: backend/app/api/routes/onboarding.py (PROPOSED)
Status: MISSING
Action: REQUESTED
Owner: Backend Role
Notes: Frontend requires unified onboarding endpoints for both students and companies. 
Requirements:
- POST /api/onboarding/student: Create User + Student + SocialLinks + Projects in one transaction.
- POST /api/onboarding/company: Create User + Company in one transaction.
Date: 2026-02-01

---

[API_REQUESTED]
Entity: API
Name: Company Profile API
Role: B
Path: backend/app/api/routes/companies.py (PROPOSED)
Status: MISSING
Action: REQUESTED
Owner: Backend Role
Notes: Frontend requires endpoints to manage company profiles.
Requirements:
- GET /api/companies/me: Fetch details of the current logged-in company.
- GET /api/companies/{company_id}: Fetch public details of any company.
- PATCH /api/companies/me: Update company details (industry, description, etc.).
Date: 2026-02-01

---

[API_REQUESTED]
Entity: API
Name: Profile Update Endpoints
Role: B
Path: backend/app/api/routes/students.py, backend/app/api/routes/companies.py
Status: PARTIAL
Action: REQUESTED
Owner: Backend Role
Notes: Existing student API only has GET. Need PATCH for mutation.
Requirements:
- PATCH /api/students/me: Update student details (full_name, university, degree_level, etc.).
Date: 2026-02-01

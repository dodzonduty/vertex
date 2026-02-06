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
Status: PARTIAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented endpoint structure matching frontend, but logic is simplified/mocked until full graph data is available. returns real-feeling static data.
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

---

[REAL_IMPLEMENTED]
Entity: API
Name: Onboarding API
Role: B
Path: backend/app/api/routes/onboarding.py
Status: REAL
Action: IMPLEMENTED
Owner: DevB
Notes: Implemented unified onboarding endpoints for both students and companies. Creates User + Student/Company + SocialLinks + Projects in atomic transactions. Returns JWT token upon successful registration.
Requirements fulfilled:

- POST /api/onboarding/student: Create User + Student + SocialLinks + Projects in one transaction
- POST /api/onboarding/company: Create User + Company in one transaction
  Date: 2026-02-02

---

[REAL_IMPLEMENTED]
Entity: API & Feature
Name: Company Profile Persistence & Onboarding
Role: B/D
Path: backend/app/api/routes/companies/profiles.py, frontend/src/pages/CompanyOnboarding.tsx, frontend/src/components/company/CompanyProfile.tsx
Status: REAL
Action: IMPLEMENTED
Owner: Antigravity
Notes: Fully implemented Company persistence foundation.

- Created `signup` endpoint (creates User + Company).
- Created `/me` endpoint (GET/PATCH) for profile management.
- Connected Frontend Onboarding to real API (fixed 422 error by removing `role` payload and aligning schema).
- Connected Company Profile UI to real data (support for editing Name, Description, Industry).
  Date: 2026-02-02

---

[REAL_REFINED]
Entity: Database & Models
Name: Student Model Property-Based Refactoring
Role: A/B
Path: backend/app/models/student.py, backend/app/api/routes/students.py
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Refactored Student model to remove redundant columns (bio, ats_score, skills_json, github_url, linkedin_url) in favor of derived properties.

- bio and ats_score are now derived from the latest parsed CV.
- github_url and linkedin_url are derived from SocialLink records.
- Updated API routes to stop direct saves to these columns, fixing the UndefinedColumn error.
- Removed deprecated SQLite migration scripts.
  Date: 2026-02-02

---

[REAL_REFINED]
Entity: Module
Name: Config & Database
Role: B
Path: backend/app/core/config.py
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Fixed config to load .env from project root (Vertex/.env) instead of backend/; changed default DATABASE_URL from SQLite to PostgreSQL; added .vscode/settings.json for Python interpreter (fixes pydantic_settings import).
Date: 2026-02-02

---

[REAL_REFINED]
Entity: Module
Name: API Error Formatting
Role: D
Path: frontend/src/lib/api/config.ts
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Added formatApiErrorDetail() to convert FastAPI 422 validation errors (array of objects) into readable strings; fixes "[object Object]" in toast messages.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: Component
Name: Student Onboarding Flow
Role: D
Path: frontend/src/pages/StudentOnboarding.tsx
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Fixed onboarding flow: only treat "Email already registered" as account-exists (then try login); persist token from signup response on success; align signupPayload with backend schema (email, password, full_name, university, degree_level, social_links, projects).
Date: 2026-02-02

---

[REAL_REFINED]
Entity: API
Name: Student Profile GET /me
Role: B
Path: backend/app/api/routes/students.py
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Fixed route ordering: GET /me must be defined BEFORE GET /{student_id} so /me is not matched as student_id="me"; added certificates to StudentDetailResponse and joinedload; frontend profile page now loads correctly.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: API
Name: Student Profile PATCH /me
Role: B
Path: backend/app/api/routes/students.py
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Fixed PATCH to persist bio, ats_score, skills via CV.parsed_json (Student model has read-only properties); persist github_url, linkedin_url via SocialLink; updated Student.skills property to read from CV.parsed_json.
Date: 2026-02-02

---

[REAL_IMPLEMENTED]
Entity: Database & Models
Name: Company Contact Fields
Role: A
Path: backend/app/models/company.py, alembic/versions/20260202_add_company_contact_fields.py
Status: REAL
Action: IMPLEMENTED
Owner: Antigravity
Notes: Added phone, address, size columns to Company model; migration add_company_contact.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: API
Name: Onboarding API (Company)
Role: B
Path: backend/app/api/routes/onboarding.py
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Extended CompanyOnboardingRequest with phone, address, size, social_links; onboarding creates SocialLink records; returns JWT on success.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: API
Name: Company Profile API
Role: B
Path: backend/app/api/routes/companies/profiles.py, backend/app/schemas/company.py
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: GET /me and PATCH /me now support phone, address, size, social_links; joinedload user.social_links; infer link type from URL; full CRUD for company profile.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: Component
Name: Company Onboarding Page
Role: D
Path: frontend/src/pages/CompanyOnboarding.tsx
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Added form fields for phone, address, size, social links (type + URL); set auth token from signup response; aligns with backend CompanyOnboardingRequest.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: Component
Name: Company Profile Page
Role: D
Path: frontend/src/components/company/CompanyProfile.tsx
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Load and display phone, address, size, social_links; edit mode for phone, address, social links (add/remove); handle API response (social_links camelCase mapping); save sends all fields to PATCH /me.
Date: 2026-02-02

---

[REAL_REFINED]
Entity: API & Feature
Name: Profile Photo Persistence & API Synchronization
Role: B/D
Path: backend/app/api/routes/auth.py, backend/app/schemas/auth.py, frontend/src/components/Header.tsx, frontend/src/components/student/StudentProfile.tsx
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Implemented persistent profile photo storage.

- Added `profile_photo_url` to `User` model and `UserResponse` schema.
- Implemented `POST /api/auth/upload-profile-photo` to store base64 images in PostgreSQL.
- Updated `GET /api/auth/me` to return the photo URL.
- Synchronized frontend components (`Header`, `StudentProfile`, `CompanyProfile`) to use real authenticated endpoints instead of mocks.
- Disabled conflicting mocks: `/api/mocks/profile-picture/*`, `/api/opportunities/count`, and `/api/opportunities/top`.
  Date: 2026-02-06

---

[REAL_REFINED]
Entity: Component
Name: Student Dashboard & Profile Refactoring
Role: D
Path: frontend/src/pages/StudentDashboard.tsx, frontend/src/components/student/StudentProfile.tsx
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Refactored student dashboard to fetch real user data and photos.

- Replaced mock state with data from `GET /api/auth/me`.
- Implemented initials fallback for avatars when no photo is present.
- Added `profile_photo_url` to `StudentDetailResponse` schema and `GET /api/students/me` endpoint.
- Connected student profile photo upload to the real persistence layer.
  Date: 2026-02-06

---

[MOCK_REPLACED]
Entity: API
Name: Tags & Trending API Integration
Role: B/D
Path: backend/app/api/routes/tags.py, backend/app/api/routes/trending.py, frontend/src/components/OpportunitiesContent.tsx, frontend/src/components/company/CompanyEvents.tsx
Status: REAL
Action: REPLACED
Owner: Antigravity
Notes: Replaced remaining mocks for Tags and Trending.

- Created dedicated `trending.py` router for dynamic tag frequency calculation via database joins.
- Optimized `tags.py` to support category filtering and provided rich fallback defaults for empty databases.
- Resolved route conflicts between `opportunities`, `match`, and `tags` routers by removing redundant endpoints.
- Updated frontend components to handle normalized JSON response structures (e.g., `{ tags: [] }`).
- Disabled `tags_mock` and `trending_mock`.
  Date: 2026-02-06

---

[REAL_REFINED]
Entity: API
Name: Opportunity Metadata Enrichment
Role: B/D
Path: backend/app/api/routes/opportunities.py, frontend/src/pages/OpportunityProfile.tsx
Status: REAL
Action: REFINED
Owner: Antigravity
Notes: Added real-time metadata to opportunity listings.

- Implemented `enrolled_teams_count` calculation in `GET /api/opportunities/{id}`.
- Enriched `hosted_by` object with real company profile photos from the database.
- Displayed participant counts dynamically in the Opportunity Profile sidebar.
  Date: 2026-02-06

# Vertex System Contracts (FastAPI)

## Auth API

Status: REAL  
Route: POST /api/auth/login, GET /api/auth/me, POST /api/auth/upload-profile-photo
Location: backend/app/api/routes/auth.py

Implemented_By: Role B  
Owner: DevB  
Replacement_Required: NO

---

## Student Profile API

Status: REAL
Route: GET /api/students/me, GET /api/students/{id}, GET /api/students/, PATCH /api/students/me, POST /api/students/me/projects
Location: backend/app/api/routes/students.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: GET /me must be declared before GET /{id}. PATCH persists bio/ats_score/skills via CV, github/linkedin via SocialLink.

---

## CV Analysis API

Status: MOCK  
Route: POST /api/ai/cv-analyze  
Location: backend/app/mocks/cv_mock.py

Mocked_By: Role C  
Mock_Owner: DevC  
Replacement_Required: YES

---

## GitHub Project Analysis API

Status: MOCK  
Route: POST /api/ai/github-analyze  
Location: backend/app/mocks/github_mock.py

Mocked_By: Role C  
Mock_Owner: DevC  
Replacement_Required: YES

---

## Matching API

Status: MOCK  
Route: POST /api/match  
Location: backend/app/mocks/match_mock.py

Mocked_By: Role C  
Mock_Owner: DevC  
Replacement_Required: YES

---

## Opportunities API

Status: REAL
Route: POST /api/opportunities/, GET /api/opportunities/{id}, GET /api/opportunities-list
Location: backend/app/api/routes/opportunities.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: Real-time filtering by type/tags. Single opportunity enrichments (enrolled_teams_count, hosted_by logos). Original landing page mocks removed.

---

---

## Tags API

Status: REAL
Route: GET /api/tags
Location: backend/app/api/routes/tags.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: Dynamically fetches tags from database with # prefixing. Provides fallback richness for clean DBs.

---

## Trending API

Status: REAL
Route: GET /api/trending
Location: backend/app/api/routes/trending.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: Calculates trending stats using real-time database joins and frequency counts.

---

## Perfect Match API

Status: MOCK
Route: GET /api/perfect-match
Location: backend/app/mocks/perfect_match_mock.py

Mocked_By: Role D
Mock_Owner: Role D
Replacement_Required: YES

---

## Vertex Connect API

Status: MOCK
Route: GET /api/vertex-connect
Location: backend/app/mocks/vertex_connect_mock.py

Mocked_By: Role D
Mock_Owner: Role D
Replacement_Required: YES

---

## Opportunity List API

Status: REAL
Route: GET /api/opportunities-list
Location: backend/app/api/routes/opportunities.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: Real replacement for opportunity_list_mock. Supports pagination and rich filtering.

---

## Company Profile API

Status: REAL
Route: GET /api/companies/me, PATCH /api/companies/me, POST /api/companies/signup
Location: backend/app/api/routes/companies/profiles.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: Returns phone, address, size, social_links. Company model has phone, address, size columns. Social links via User.social_links.

---

## Onboarding API

Status: REAL
Route: POST /api/onboarding/student, POST /api/onboarding/company
Location: backend/app/api/routes/onboarding.py

Implemented_By: Role B
Owner: DevB
Replacement_Required: NO
Notes: Student: email, password, full_name, university, degree_level, social_links, projects. Company: email, password, name, industry, description, phone, address, size, social_links. Returns JWT.

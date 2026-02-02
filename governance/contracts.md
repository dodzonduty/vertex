# Vertex System Contracts (FastAPI)

## Auth API
Status: REAL  
Route: POST /api/auth/login, GET /api/auth/me  
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
Status: MOCK
Route: GET /api/opportunities/count, GET /api/opportunities/top
Location: backend/app/mocks/opportunity_mock.py

Mocked_By: Role D
Mock_Owner: Role D
Replacement_Required: YES

---

---

## Tags API
Status: MOCK
Route: GET /api/tags
Location: backend/app/mocks/tags_mock.py

Mocked_By: Role D
Mock_Owner: Role D
Replacement_Required: YES

---

## Trending API
Status: MOCK
Route: GET /api/trending
Location: backend/app/mocks/trending_mock.py

Mocked_By: Role D
Mock_Owner: Role D
Replacement_Required: YES

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
Status: MOCK
Route: GET /api/opportunities-list
Location: backend/app/mocks/opportunity_list_mock.py

Mocked_By: Role D
Mock_Owner: Role D
Replacement_Required: YES

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





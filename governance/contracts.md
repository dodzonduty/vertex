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
Route: GET /api/students/{id}, GET /api/students/  
Location: backend/app/api/routes/students.py  

Implemented_By: Role B  
Owner: DevB  
Replacement_Required: NO  

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

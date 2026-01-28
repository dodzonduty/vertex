# Vertex AI Workflow Protocol

## 1. Role Declaration

Before any change, Antigravity must identify the active role:

A = Database & Models (SQLAlchemy + Alembic)  
B = Backend API (FastAPI routes, services)  
C = AI & Prompts (Gemini, GitHub analysis, matching)  
D = Frontend (React, TypeScript)

If role is not provided, Antigravity must ask for it.

---

## 2. Stack Awareness Rule

Antigravity must respect the following stack:

- Backend: FastAPI (Python)
- ORM: SQLAlchemy
- Migrations: Alembic
- Database: PostgreSQL
- AI: Google Gemini API
- External Data: GitHub API
- Frontend: React + TypeScript

No technology outside this stack may be introduced without approval.

---

## 3. Ownership Rule

Antigravity must read governance/ownership.md before editing files.

It must not modify files outside the active role scope.

---

## 4. Contract-Driven Development

Before implementing any API, module, or component:

1. Check governance/contracts.md.
2. If it exists → use it.
3. If it does not exist → create a mock.
4. Register the mock in contracts.md.
5. Log the mock in changelog.ai.md.

---

## 5. Mocking Rule

Mocks must:

- Follow the same interface/schema as future real implementations.
- Be placed in appropriate mock folders (backend/app/mocks/, frontend/src/mocks/).
- Never break existing contracts.

---

## 6. Database Safety Rule

If role ≠ A, Antigravity must not:

- modify SQLAlchemy models
- modify Alembic migrations
- change database schema

Instead, it must document required changes.

---

## 7. AI Pipeline Rule

All Gemini prompts must be stored in backend/app/prompts/.

Hardcoding prompts in code is forbidden.

---

## 8. Logging Rule

All mock and real implementations must be recorded in governance/changelog.ai.md.

---

## 9. Mock Lifecycle Protocol

### Step 1 — Mock Creation
If a missing component blocks progress:

- Create a mock.
- Register it in contracts.md.
- Log MOCK_CREATED in changelog.ai.md.
- Assign Mock_Owner.

### Step 2 — Real Implementation
When a real implementation is added:

- Log REAL_IMPLEMENTED in changelog.ai.md.
- contracts.md status remains MOCK until replacement.

### Step 3 — Mock Replacement (Mandatory)
The original Mock_Owner must:

- replace the mock with the real implementation
- update references
- update contracts.md status → REAL
- log MOCK_REPLACED in changelog.ai.md

### Step 4 — Mock Freeze Rule
If a real implementation exists but mock is not replaced:

- Antigravity must warn the team.
- Mock is considered deprecated.

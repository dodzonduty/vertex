# Vertex Ownership Matrix (FastAPI)

## Role A — Database & Models
Owns:
- backend/app/models/
- backend/alembic/
- backend/app/db/

---

## Role B — Backend API
Owns:
- backend/app/api/
- backend/app/services/ (except ai/)
- backend/app/core/

---

## Role C — AI & Matching
Owns:
- backend/app/services/ai/
- backend/app/prompts/

---

## Role D — Frontend
Owns:
- frontend/

---

## Shared (Read-Only)
- shared/
- docs/
- governance/

---

## Cross-Role Rule

If a role needs changes in another role’s domain:

- DO NOT modify directly.
- Document the required change in governance/changelog.ai.md.

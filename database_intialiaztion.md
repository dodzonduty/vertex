# Vertex Backend - Database Setup Guide

## Developer A - Database & Models

This guide covers the database setup for the Vertex project.

---

## Prerequisites

- Python 3.10+
- Docker Desktop (running)
- PostgreSQL client (optional, for GUI access)

---

## Quick Start

### 1. Start PostgreSQL Database

```bash
# From project root
docker-compose up -d postgres
```

### 2. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run Database Migrations

```bash
# Create initial migration (first time only)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 4. Seed Database (Optional)

```bash
# Populate with initial tags
python -m app.db.init_db
```

---
## Common Commands

### Database Management

```bash
# Start database
docker-compose up -d postgres

# Stop database
docker-compose down

# View database logs
docker-compose logs postgres

# Access PostgreSQL CLI
docker exec -it vertex_postgres psql -U vertex_user -d vertex_db
```


### Database Inspection

```bash
# Connect to database
docker exec -it vertex_postgres psql -U vertex_user -d vertex_db

# List all tables
\dt

# Describe table structure
\d table_name

# View all users
SELECT * FROM users;

# Exit
\q
```

---

## File Structure

```
backend/
├── alembic/
│   ├── versions/          # Migration files
│   └── env.py            # Alembic config
├── app/
│   ├── db/
│   │   ├── session.py    # Database session
│   │   └── init_db.py    # Seed data
│   └── models/
│       ├── __init__.py   # Model exports
│       ├── base.py       # Base model
│       ├── user.py
│       ├── student.py
│       ├── professor.py
│       ├── company.py
│       ├── project.py
│       ├── tag.py
│       ├── match.py
│       └── ai_analysis.py
└── requirements.txt
```

---

## Environment Variables

Create a `.env` file in the project root (already created):

```env
DATABASE_URL=postgresql://vertex_user:vertex_pass@localhost:5432/vertex_db
ENVIRONMENT=development
```

---

## Troubleshooting

### Docker Issues

```bash
# Check if Docker is running
docker ps

# Restart Docker Desktop if needed
# Then restart database
docker-compose down
docker-compose up -d postgres
```

### Migration Issues

```bash
# If autogenerate doesn't detect changes:
# 1. Make sure all models are imported in alembic/env.py
# 2. Check that models inherit from Base
# 3. Try manual migration:
alembic revision -m "Manual migration"
# Then edit the generated file in alembic/versions/
```

### Connection Issues

```bash
# Test database connection
docker exec -it vertex_postgres psql -U vertex_user -d vertex_db -c "SELECT 1;"

# If connection fails, check:
# 1. Docker is running
# 2. Container is running: docker ps
# 3. Port 5432 is not in use by another service
```
## Support

For issues or questions:
- Check `docs/` folder for ERD and architecture
- Review `governance/` folder for ownership and contracts
- Update `governance/changelog.ai.md` for any changes

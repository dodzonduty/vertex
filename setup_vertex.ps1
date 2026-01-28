New-Item -ItemType Directory -Force -Path "governance"
$govFiles = @("workflow.md", "ownership.md", "contracts.md", "changelog.ai.md")
foreach ($file in $govFiles) { New-Item -ItemType File -Force -Path "governance\$file" }

$backendDirs = @(
    "backend/app/api/routes/companies",
    "backend/app/core",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/services/ai",
    "backend/app/services/github",
    "backend/app/services/matching",
    "backend/app/prompts",
    "backend/app/mocks",
    "backend/app/db",
    "backend/app/utils",
    "backend/alembic/versions",
    "backend/tests"
)
foreach ($dir in $backendDirs) { New-Item -ItemType Directory -Force -Path $dir }

$backendFiles = @(
    "backend/app/main.py",
    "backend/app/core/config.py", "backend/app/core/security.py", "backend/app/core/constants.py",
    "backend/app/api/deps.py", "backend/app/api/__init__.py",
    "backend/app/db/session.py", "backend/app/db/init_db.py",
    "backend/app/utils/hashing.py",
    "backend/requirements.txt",
    "backend/alembic/env.py", "backend/alembic/script.py.mako",
    "backend/app/api/routes/auth.py", "backend/app/api/routes/students.py",
    "backend/app/api/routes/professors.py", "backend/app/api/routes/match.py",
    "backend/app/api/routes/companies/projects.py"
)
foreach ($file in $backendFiles) { New-Item -ItemType File -Force -Path $file }

$models = @("base", "user", "student", "professor", "company", "project", "tag", "ai_analysis", "match")
foreach ($m in $models) { New-Item -ItemType File -Force -Path "backend/app/models/$m.py" }

$schemas = @("auth", "student", "project", "match", "ai")
foreach ($s in $schemas) { New-Item -ItemType File -Force -Path "backend/app/schemas/$s.py" }

$prompts = @("cv_analysis", "github_analysis", "professor_match", "student_match", "project_match")
foreach ($p in $prompts) { New-Item -ItemType File -Force -Path "backend/app/prompts/$p.prompt.txt" }

$mocks = @("auth_mock", "cv_mock", "github_mock", "match_mock")
foreach ($mock in $mocks) { New-Item -ItemType File -Force -Path "backend/app/mocks/$mock.py" }

$frontendDirs = @("frontend/src/api", "frontend/src/pages", "frontend/src/components", "frontend/src/hooks", "frontend/src/types", "frontend/src/mocks", "frontend/public")
foreach ($dir in $frontendDirs) { New-Item -ItemType Directory -Force -Path $dir }
New-Item -ItemType File -Force -Path "frontend/package.json"
New-Item -ItemType File -Force -Path "frontend/tsconfig.json"

$miscDirs = @("shared/contracts", "shared/types", "shared/constants", "docs", "scripts")
foreach ($dir in $miscDirs) { New-Item -ItemType Directory -Force -Path $dir }
$miscFiles = @("docs/architecture.md", "docs/erd.md", "docs/ai-design.md", "scripts/setup.ps1", ".env.example", "docker-compose.yml", "README.md", "Makefile")
foreach ($file in $miscFiles) { New-Item -ItemType File -Force -Path $file }

Write-Host "🚀 Vertex Platform structure created successfully!" -ForegroundColor Green
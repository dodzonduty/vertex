"""
Vertex FastAPI Application
Main entry point for the backend API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import auth, students


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Vertex - Student Opportunity Matching Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router)
app.include_router(students.router)

# Mocks
from app.mocks import opportunity_mock, tags_mock, trending_mock, perfect_match_mock
app.include_router(opportunity_mock.router)
app.include_router(tags_mock.router)
app.include_router(trending_mock.router)
app.include_router(perfect_match_mock.router)
from app.mocks import vertex_connect_mock, opportunity_list_mock
app.include_router(vertex_connect_mock.router)
app.include_router(opportunity_list_mock.router)


@app.get("/")
def root():
    """Root endpoint - API health check"""
    return {
        "message": "Vertex API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

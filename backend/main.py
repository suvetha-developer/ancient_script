from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from backend.config import UPLOAD_DIR, PROCESSED_DIR, DATASET_DIR
from backend.routes.auth import router as auth_router
from backend.routes.analysis import router as analysis_router

app = FastAPI(
    title="Ancient Tamil Inscription AI API",
    description="Full-Stack AI Application for Ancient Tamil Inscription Recognition, Translation, and Meaning Extraction",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static file directories for original, enhanced images and benchmark dataset
app.mount("/static/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/static/processed", StaticFiles(directory=str(PROCESSED_DIR)), name="processed")
if (DATASET_DIR / "Original Images").exists():
    app.mount("/static/benchmarks", StaticFiles(directory=str(DATASET_DIR / "Original Images")), name="benchmarks")

# Include Routers
app.include_router(auth_router)
app.include_router(analysis_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Ancient Tamil Inscription AI",
        "docs": "/docs",
        "endpoints": [
            "/api/analyze",
            "/api/preprocess",
            "/api/recognize",
            "/api/translate",
            "/api/retrieve",
            "/api/meaning",
            "/api/history",
            "/api/dataset/stats",
            "/api/auth/login",
            "/api/auth/signup"
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

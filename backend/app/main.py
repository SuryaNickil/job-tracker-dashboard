from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import os

# Database setup
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(title="Job Tracker API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    position = Column(String)
    status = Column(String, default="Applied")  # Applied, Interviewing, Offered, Rejected, Ghosted
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    location = Column(String)
    applied_date = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class JobApplicationCreate(BaseModel):
    company: str
    position: str
    status: str = "Applied"
    salary_min: int = None
    salary_max: int = None
    location: str
    notes: str = None

class JobApplicationUpdate(BaseModel):
    company: str = None
    position: str = None
    status: str = None
    salary_min: int = None
    salary_max: int = None
    location: str = None
    notes: str = None

class JobApplicationResponse(BaseModel):
    id: int
    company: str
    position: str
    status: str
    salary_min: int = None
    salary_max: int = None
    location: str
    applied_date: datetime
    last_updated: datetime
    notes: str = None
    
    class Config:
        from_attributes = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.get("/")
async def root():
    return {"message": "Job Tracker API", "version": "1.0.0"}

@app.get("/api/applications", response_model=list[JobApplicationResponse])
async def get_applications(status: str = None, db: Session = Depends(get_db)):
    query = db.query(JobApplication)
    if status:
        query = query.filter(JobApplication.status == status)
    return query.all()

@app.post("/api/applications", response_model=JobApplicationResponse)
async def create_application(app: JobApplicationCreate, db: Session = Depends(get_db)):
    db_app = JobApplication(**app.dict())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@app.put("/api/applications/{app_id}", response_model=JobApplicationResponse)
async def update_application(app_id: int, app: JobApplicationUpdate, db: Session = Depends(get_db)):
    db_app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    update_data = app.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_app, key, value)
    
    db_app.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(db_app)
    return db_app

@app.delete("/api/applications/{app_id}")
async def delete_application(app_id: int, db: Session = Depends(get_db)):
    db_app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db.delete(db_app)
    db.commit()
    return {"detail": "Application deleted"}

@app.get("/api/analytics/summary")
async def get_summary(db: Session = Depends(get_db)):
    total = db.query(func.count(JobApplication.id)).scalar()
    applied = db.query(func.count(JobApplication.id)).filter(JobApplication.status == "Applied").scalar()
    interviewing = db.query(func.count(JobApplication.id)).filter(JobApplication.status == "Interviewing").scalar()
    offered = db.query(func.count(JobApplication.id)).filter(JobApplication.status == "Offered").scalar()
    rejected = db.query(func.count(JobApplication.id)).filter(JobApplication.status == "Rejected").scalar()
    
    return {
        "total": total,
        "applied": applied,
        "interviewing": interviewing,
        "offered": offered,
        "rejected": rejected
    }

@app.get("/api/analytics/status-breakdown")
async def get_status_breakdown(db: Session = Depends(get_db)):
    statuses = ["Applied", "Interviewing", "Offered", "Rejected", "Ghosted"]
    breakdown = []
    
    for status in statuses:
        count = db.query(func.count(JobApplication.id)).filter(JobApplication.status == status).scalar()
        breakdown.append({"name": status, "value": count})
    
    return breakdown

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

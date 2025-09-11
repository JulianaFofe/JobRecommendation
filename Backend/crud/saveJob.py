from sqlalchemy.orm import Session
from models.savedJob import SavedJob
from fastapi import HTTPException

def save_job(db: Session, employee_id: int, job_id: int):
    existing = db.query(SavedJob).filter_by(employee_id=employee_id, job_id=job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
    
    saved = SavedJob(employee_id=employee_id, job_id=job_id)
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved

def get_saved_jobs(db: Session, employee_id: int):
    return db.query(SavedJob).filter(SavedJob.employee_id == employee_id).all()


def remove_saved_job(db: Session, employee_id: int, job_id: int):
    saved = db.query(SavedJob).filter_by(employee_id=employee_id, job_id=job_id).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved job not found")
    db.delete(saved)
    db.commit()
    return saved

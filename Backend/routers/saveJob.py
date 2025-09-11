from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.users import User
from routers.auth import getCurrentUser
from schema.saveJob import SavedJobRead
from crud.saveJob import save_job, get_saved_jobs, remove_saved_job

router = APIRouter(prefix="/saved-jobs", tags=["Saved Jobs"])

@router.post("/{job_id}")
def save_job_endpoint(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can save jobs")
    return save_job(db, current_user.id, job_id)

@router.get("/", response_model=list[SavedJobRead])
def list_saved_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view saved jobs")
    return get_saved_jobs(db, current_user.id)

@router.delete("/{job_id}")
def remove_saved_job_endpoint(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can remove saved jobs")
    return remove_saved_job(db, current_user.id, job_id)

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
from models import Job
import models
from models.users import User, UserRole
from routers.auth import getCurrentUser
from database import get_db
from schema import job as schema
from crud import job_crud as crud
from routers.auth import getCurrentUser

#from ..dependencies import get_current_user

router=APIRouter(prefix="/jobs", tags=["Jobs"]) #all routes here will start with ""


@router.post("/create", response_model=schema.Job)#endpoint to post a job
def create_job(
    job:schema.JobCreate,
    db:Session=Depends(get_db),

    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != UserRole.EMPLOYER:

       current_user=Depends(getCurrentUser)

    if current_user.role != "employer":

        raise HTTPException(status_code=403, detail="only employers can post jobs")
    return crud.create_job(db=db,job=job, employer_id=current_user.id)

@router.get("/read", response_model=List[schema.Job])
def list_jobs( skip:int=0, limit:int=100, db:Session=Depends(get_db), current_user=Depends(getCurrentUser)):
    if current_user.id != "employer":
        raise HTTPException(status_code=403, detail="Only employers can view their jobs")

    jobs = db.query(models.Job)\
             .filter(models.Job.employer_id == current_user.id)\
             .offset(skip)\
             .limit(limit)\
             .all()
    return jobs 

@router.put("/update/{job_id}", response_model=schema.Job)
def update_job_endpoint(
    job_id: int,
    job_data: schema.JobUpdate,
    db: Session = Depends(get_db),
    current_user= Depends(getCurrentUser)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail ="Job not found")
    
    # Only the employer who posted the job can update it
    if job.employer_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    updated_job = crud.update_job(db, job_id, job_data)
    return updated_job


# ------------------ DELETE JOB ------------------
@router.delete("/delete/{job_id}", response_model=schema.Job)
def delete_job_endpoint(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(getCurrentUser)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Only the employer who posted the job can delete it
    if job.employer_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    deleted_job = crud.delete_job(db, job_id)
    return deleted_job

@router.get("/getjob/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
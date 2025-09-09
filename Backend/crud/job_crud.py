from datetime import datetime, timezone
from sqlalchemy import DateTime
from sqlalchemy.orm import Session
from models import job as models
from schema import job as schema
from utility.dummy_applications import seekers
from models import Job


def create_job(db:Session, job:schema.JobCreate, employer_id:int):
    job_data = job.model_dump()#converts pydantic model to a dictionary
    job_data["posted_at"]= datetime.now(timezone.utc)
    job_data["status"] = getattr(job,"status","available")
    db_job=models.Job(**job_data, employer_id=employer_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_job(db:Session, skip:int=0, limit:int=100):
    return db.query(models.Job).offset(skip).limit(limit).all()#return the first 100 job objects 

def update_job(db:Session, job_id:int, job_data:schema.JobUpdate):
    job=db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        return None
    update_data = job_data.model_dump(exclude_unset=True)#converts pydantic to dictionar including only updated fields
    if "status" not in update_data:
        update_data["status"] = job.status
    for key,value in update_data.items():
        setattr(job,key,value)
    job.posted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(job)
    return job

def delete_job(db:Session, job_id:int):
    job=db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        return None
    db.delete(job)
    db.commit()
    return job

# crud/jobs_crud.py

def get_all_jobs(db:Session):
    """
    Fetch all jobs from the database (real data from your backend).
    Returns a list of dicts.
    """
    jobs = db.query(Job).all()
    return [
        {
            "id":job.id,
            "title":job.title,
            "description":job.description,
            "requirements":job.requirements
            
        }
        for job in jobs
    ]
    

def get_job_by_id(db: Session, job_id: int):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job:
        return {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements
        }
    return None

#

# crud/employees_crud.py


def get_all_employees():
    """
    Fetch all employees (job seekers) for now using dummy data.
    Later replace with actual DB query.
    """
    return seekers

def get_employee_by_id(employee_id: int):
    return next((e for e in seekers if e["id"] == employee_id), None)

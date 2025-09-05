from sqlalchemy.orm import Session
from models import job as models
from schema import job as schema


def create_job(db:Session, job:schema.JobCreate, employer_id:int):
    db_job=models.Job(**job.model_dump(), employer_id=employer_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_job(db:Session, skip:int=0, limit:int=100):
    return db.query(models.Job).offset(skip).limit(limit).all()#return the first 100 job objects 
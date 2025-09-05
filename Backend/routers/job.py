from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schema import job as schema
from crud import job_crud as crud

router=APIRouter(prefix="/jobs", tags=["Jobs"]) #all routes here will start with ""

def get_dummy_user():
  class DummyUser:#will get the "get_currennt_user" function from juliana
    id=1
    role="employer"
  return DummyUser()


@router.post("/", response_model=schema.Job)
def create_job(
    job:schema.JobCreate,
    db:Session=Depends(get_db),
    current_user=Depends(get_dummy_user)
):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="only employers can post jobs")
    return crud.create_job(db=db,job=job, employer_id=current_user.id)

@router.get("/", response_model=List[schema.Job])
def list_jobs(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    return crud.get_job(db=db, skip=skip, limit=limit)
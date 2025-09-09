from fastapi import APIRouter, Depends, HTTPException
from crud.job_crud import get_all_jobs, get_job_by_id
from crud.job_crud import get_all_employees, get_employee_by_id
from utility.ai import recommend_candidates_for_jobs, recommend_jobs_for_employees
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/recommendations", tags=["recomendations"])

@router.get("/employees/{employee_id}")
def recommend_jobs(employee_id:int, top_n:int=5, db: Session=Depends(get_db)):
    employee = get_employee_by_id(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    jobs=get_all_jobs(db)
    recommendations = recommend_jobs_for_employees(employee, jobs, top_n)
    return {"employee":employee["name"],"recommendation":recommendations}

@router.get("/job/{job_id}")
def recommend_candidates(job_id:int, top_n:int, db:Session=Depends(get_db)):
    job = get_job_by_id(db,job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    employees = get_all_employees()
    matches = recommend_candidates_for_jobs(job, employees, top_n)
    return {"job":job["title"], "candidate":matches}
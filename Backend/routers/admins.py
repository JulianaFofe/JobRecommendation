from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Job, Application, User
from routers.auth import getCurrentUser
from schema.job import JobResponse
from schema.users import UserRead
from crud.user_crud import delete_user
import math
from schema.application import ApplicationResponse
from schema.job import Job as JobSchema
from schema.users import UserRead



router = APIRouter(prefix="/admin", tags=["Admin"])

def check_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this resource")


def check_admin_or_superadmin(user: User):
    if user.role != "admin" and user.email != "superadmin@example.com":
        raise HTTPException(status_code=403, detail="Only admins can access")


def check_superadmin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this resource")

@router.get("/users", response_model=List[UserRead])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0)
):
    check_admin(current_user)
    return db.query(User).offset(offset).limit(limit).all()


# Get all jobs
@router.get("/jobs", response_model=List[JobSchema])
def get_all_jobs(db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    check_admin(current_user)
    return db.query(Job).all()

    
    


@router.get("/applications", response_model=List[ApplicationResponse])
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0)
):
    check_admin(current_user)
    applications = db.query(Application).join(Application.applicant).offset(offset).limit(limit).all()

    response = [
        ApplicationResponse(
            id=app.id,
            job_id=app.job_id,
            applicant_id=app.applicant_id,
            applicant_name=app.applicant.username,
            status=app.status,
            applied_at=app.applied_at
        )
        for app in applications
    ]

    return response




@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db)
):
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    total_users = db.query(User).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_applications": total_applications
    }


@router.delete("/users/{user_id}")
def delete_users(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    check_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return

@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)  
):
    check_admin(current_user)

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()

    return {"detail": f"Job with id {job_id} has been deleted"}

    

    

@router.get("/stats/daily")
def get_daily_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    check_admin(current_user)

    today = datetime.now(timezone.utc).date()
    start_date = today - timedelta(days=7) 

    jobs_per_day = (
        db.query(func.date(Job.posted_at).label("day"), func.count(Job.id))
        .filter(Job.posted_at >= start_date)
        .group_by("day")
        .order_by("day")
        .all()
    )

    apps_per_day = (
        db.query(func.date(Application.applied_at).label("day"), func.count(Application.id))
        .filter(Application.applied_at >= start_date)
        .group_by("day")
        .order_by("day")
        .all()
    )

    stats = []
    for i in range(7): 
        day = start_date + timedelta(days=i)
        job_count = next((j[1] for j in jobs_per_day if j[0] == day), 0)
        app_count = next((a[1] for a in apps_per_day if a[0] == day), 0)
        stats.append({
            "day": day.strftime("%A"), 
            "jobPosting": job_count,
            "applications": app_count
        })

    return stats

@router.get("/stats/job-categories")
def get_job_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    check_admin(current_user)

    categories = (
        db.query(Job.job_type, func.count(Job.id).label("count"))
        .group_by(Job.job_type)
        .all()
    )

    total = sum([c[1] for c in categories])

    data = [
        {
            "name": c[0], 
            "value": round((c[1] / total) * 100, 2) if total > 0 else 0 
        }
        for c in categories
    ]

    return data

    
   
   

# Get pending jobs
@router.get("/jobs/pending", response_model=List[JobSchema])
def get_pending_jobs(db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    check_admin(current_user)
    return db.query(Job).filter(Job.is_approved==False).all()


@router.put("/jobs/approve/{job_id}", response_model=JobSchema)
def approve_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    check_admin(current_user)
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.is_approved = True
    db.commit()
    db.refresh(job)
    return job

@router.get("/read")
def read_jobs_for_employer(employer_id: int, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.employer_id == employer_id).all()
    return jobs




@router.get("/users/pending", response_model=List[UserRead])
def get_pending_users(db: Session = Depends(get_db), current_user=Depends(getCurrentUser)):
    check_superadmin(current_user)
    return db.query(User).filter(User.is_approved == False).all()


@router.put("/users/approve/{user_id}", response_model=UserRead)
def approve_user(user_id: int, db: Session = Depends(get_db), current_user=Depends(getCurrentUser)):
    check_superadmin(current_user)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = True
    db.commit()
    db.refresh(user)
    return user

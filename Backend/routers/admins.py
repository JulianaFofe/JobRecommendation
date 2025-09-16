from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from models import Job, Application, User
from routers.auth import getCurrentUser
from schema.job import JobResponse
from schema.users import UserRead
from crud.user_crud import delete_user
import math

router = APIRouter(prefix="/admin", tags=["Admin"])

def check_admin(user: User):
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
    users = db.query(User).offset(offset).limit(limit).all()
    return users

@router.get("/jobs", response_model=List[JobResponse])
def get_all_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0)
):
    check_admin(current_user)
    return db.query(Job).offset(offset).limit(limit).all()

@router.get("/applications")
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0)
):
    check_admin(current_user)
    applications = db.query(Application).join(Application.applicant).offset(offset).limit(limit).all()

    response = [
        {
            "jobTitle": app.job.title,
            "applicant_name": app.applicant.username,
            "status": app.status,
            "applied_at": app.applied_at
        }
        for app in applications
    ]
    return response

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access stats")

    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    total_users = db.query(User).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_applications": total_applications
    }


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_user_route(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser) 
):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can delete users")

    user_to_delete = db.query(User).filter(User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user_to_delete.role not in ["employee", "employer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete employees or employers"
        )

    return delete_user(db, user_to_delete)

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

    
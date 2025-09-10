from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Job, Application, User
from routers.auth import getCurrentUser
from schema.application import ApplicationResponse
from schema.job import Job as JobSchema
from schema.users import UserRead

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
    return db.query(User).offset(offset).limit(limit).all()


@router.get("/jobs", response_model=List[JobSchema])
def get_all_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0)
):
    check_admin(current_user)
    return db.query(Job).offset(offset).limit(limit).all()


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
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    check_admin(current_user)

    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    total_users = db.query(User).count()

    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "total_applications": total_applications
    }
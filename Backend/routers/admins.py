from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import get_db
from models import Job, Application, User
from routers.auth import getCurrentUser
from schema.application import ApplicationResponse
from schema.job import JobResponse
from schema.users import UserRead
from crud.user_crud import delete_user

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

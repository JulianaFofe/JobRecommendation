from datetime import timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from routers.auth import createAccessToken, getCurrentUser
from database import get_db
import schema.users as schema
from models.users import User
from models.job import Job 
from sqlalchemy.orm import Session
from schema.application import ApplicationResponse
from crud import user_crud
from models import User
from schema.job import JobResponse
import schema.users as schema

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/signup")
def signup(user: schema.UserCreate, db: Session = Depends(get_db)):
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    

    if user.role == "superadmin":
        raise HTTPException(status_code=403, detail="Cannot create superadmin account")
    
    new_user = user_crud.signup(db, user)

    # Return success message and user info
    return {
        "message": "Signup successful! Awaiting admin approval.",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role,
            "is_approved":new_user.is_approved
        }
    }

@router.post("/login")
def login(user: schema.LoginRequest, db: Session = Depends(get_db)):
    db_user = user_crud.loginUser(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials"
        )
    
    # ✅ Check approval on the DB user, not input
    if not db_user.is_approved:
       raise HTTPException(
          status_code=status.HTTP_403_FORBIDDEN,
          detail="Account not approved by admin yet"
        )
    

    if db_user.email != "superadmin@example.com" and not db_user.is_approved:
      raise HTTPException(status_code=403, detail="Account not approved by admin yet")

    accessToken = createAccessToken({
        "sub": str(db_user.id),
        "role": db_user.role,
        "name": db_user.username
    }, expires_delta=timedelta(days=1))

    return {
        "message": "Login successful!",
        "access_token": accessToken,
        "token_type": "bearer",
        "role": db_user.role,
        "name": db_user.username
    }


@router.get("/search", response_model=List[JobResponse])
def search_jobs_endpoint(
    title: Optional[str] = Query(None, description="Job title to search"),
    location: Optional[str] = Query(None, description="Job location"),
    job_type: Optional[str] = Query(None, description="Type of job"),
    salary_min: Optional[float] = Query(None, description="Minimum salary"),
    limit: int = Query(50, ge=1, description="Number of results to return"),
    skip: int = Query(0, ge=0, description="Number of results to skip"),
    db: Session = Depends(get_db),
):
    query = db.query(Job)
    if title:
        query = query.filter(Job.title.ilike(f"%{title}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if salary_min:
        query = query.filter(Job.salary >= salary_min)

    jobs = query.offset(skip).limit(limit).all()
    return jobs
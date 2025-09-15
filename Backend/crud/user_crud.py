from sqlalchemy.orm import Session
from routers.auth import hashPassword, verifyPassword
from schema import users as schema
from models import User, Application, Job
from fastapi import HTTPException, status
from schema.application import ApplicationResponse

def signup(db: Session, user: schema.UserCreate):
    userExists = db.query(User).filter(User.email == user.email).first()
    if userExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashedPassword = hashPassword(user.password)

    newUser = User(
        username = user.username,
        email = user.email,
        hashed_password = hashedPassword,
        role = user.role
    )
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return newUser


def authenticateUser(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verifyPassword(password, user.hashed_password):
        return None
    return user


def loginUser(db: Session, email: str, password: str):
    user = authenticateUser(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    return user


def get_user_applications(db: Session, user: User):
    if user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view their applications")

    applications = db.query(Application).filter(Application.applicant_id == user.id).all()

    response = [
        ApplicationResponse(
            id=app.id,
            job_id=app.job_id,
            applicant_id=app.applicant_id,
            applicant_name=user.username,  
            status=app.status,
            applied_at=app.applied_at
        )
        for app in applications
    ]

    return response


def search_jobs(db: Session, title=None, location=None, job_type=None, salary_min=None, limit=50, skip=0):
    query = db.query(Job)
    if title:
        query = query.filter(Job.title == title)
    if location:
        query = query.filter(Job.location == location)
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if salary_min:
        query = query.filter(Job.salary >= salary_min)
    return query.offset(skip).limit(limit).all()

def delete_user(db: Session, user: User):
    if not user:
        return {"detail": "User not found"}

    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}
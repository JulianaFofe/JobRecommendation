from typing import List
from fastapi import APIRouter, Depends, HTTPException
import models
from schema.application import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate, ApplicationSubmitResponse
from sqlalchemy.orm import Session
from database import get_db
from models.users import User
from models.job import Job
from crud import user_crud
from routers.auth import getCurrentUser
from models.notification import Notification
from crud.application_crud import create_application, get_applications_by_Jobs, update_application_status
from utility.email import send_email

router=APIRouter(prefix="/applications", tags=["Applications"]) 

@router.post("/", response_model=ApplicationSubmitResponse)
def applyForJob(
    appData: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can apply for jobs")
    
    application = create_application(
        db, job_id=appData.job_id, applicant_id=current_user.id
    )

    job = db.query(Job).filter(Job.id == appData.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    response_data = ApplicationResponse(
        id=application.id,
        job_id=application.job_id,
        jobTitle=job.title, 
        applicant_id=application.applicant_id,
        applicant_name=current_user.username,
        status=application.status,
        applied_at=application.applied_at
    )

    notification = Notification(
    user_id=job.employer_id,  # employer of that job
    type="application",
    message=f"{current_user.username} applied for {job.title}"
    )
    db.add(notification)
    db.commit()
    send_email(
    to=job.employer.email,
    subject="New Job Application",
    body=f"{current_user.username} applied to your job: {job.title}"
)


    return ApplicationSubmitResponse(
        message="Application submitted",
        application=response_data
    )



@router.get("/job/{job_id}", response_model = List[ApplicationResponse])
def list_applications_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)  
):
    if not hasattr(current_user, "role") or current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Only employers can view applications")

    applications = get_applications_by_Jobs(db, job_id, current_user.id)
    return applications


@router.put("/{application_id}/status")
def change_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)  
):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Only employers can update application status")

    updated_application = update_application_status(
        db=db,
        application_id=application_id,
        new_status=status_update.status,
        employer_id=current_user.id
    )
    return {"message": f"Application status updated to {status_update.status.value}", "application": updated_application}


@router.get("/me", response_model=List[ApplicationResponse])
def list_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    return user_crud.get_user_applications(db, current_user)


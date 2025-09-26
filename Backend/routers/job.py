from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
from models import job
from utility.email import send_email
from models import Job
import models
from models.users import User, UserRole
from routers.auth import getCurrentUser
from database import get_db
from schema import job as schema
from crud import job_crud as crud
from routers.auth import getCurrentUser
from models.notification import Notification

#from ..dependencies import get_current_user

router=APIRouter(prefix="/jobs", tags=["Jobs"]) #all routes here will start with ""


@router.post("/create", response_model=schema.Job)#endpoint to post a job
def create_job(
    job:schema.JobCreate,
    db:Session=Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != UserRole.EMPLOYER:
     raise HTTPException(status_code=403, detail="Only employers can post jobs")

    return crud.create_job(db=db,job=job, employer_id=current_user.id)

@router.get("/read/pending", response_model=List[schema.Job])
def list_pending_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can view their pending jobs")

    jobs = db.query(models.Job)\
             .filter(models.Job.employer_id == current_user.id)\
             .filter(models.Job.is_approved == False)\
             .offset(skip)\
             .limit(limit)\
             .all()
    
    return jobs


@router.put("/update/{job_id}", response_model=schema.Job)
def update_job_endpoint(
    job_id: int,
    job_data: schema.JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
    

):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail ="Job not found")
    
    # Only the employer who posted the job can update it
    if job.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    updated_job = crud.update_job(db, job_id, job_data)
    return updated_job


# ------------------ DELETE JOB ------------------
@router.delete("/delete/{job_id}", response_model=schema.Job)
def delete_job_endpoint(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(getCurrentUser)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Only the employer who posted the job can delete it
    if job.employer_id != current_user.id:

        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    deleted_job = crud.delete_job(db, job_id)
    return deleted_job

@router.get("/public", response_model=List[schema.Job])
def get_public_jobs(db: Session = Depends(get_db)):    
    jobs = db.query(Job).filter(Job.is_approved == True).all()
    return jobs


@router.get("/{job_id}", response_model=schema.Job) #the end point to get existing jobs
def get_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Optional: check if the current user is allowed to see it
    if job.employer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to view this job")
    
    return job


@router.get("/employer_id")
def get_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employees can view their jobs status")
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/read/all", response_model=List[schema.Job])
def list_all_employer_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != UserRole.EMPLOYER:
        raise HTTPException(status_code=403, detail="Only employers can view their jobs")

    # Return all jobs (pending + approved)
    jobs = db.query(models.Job).filter(models.Job.employer_id == current_user.id).all()
    return jobs

#route to accept/reject the jobs applied for 
@router.put("/{application_id}/{action}")
def handle_application(application_id: int, action: str, db: Session = Depends(get_db), current_user: User = Depends(getCurrentUser)):
    """
    Approve or reject a job application.
    action: "approve" or "reject"
    """
    # 1. Get the application
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # 2. Make sure the current user is the employer for this job
    job = db.query(Job).filter(Job.id == application.job_id).first()
    if job.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # 3. Update application status
    if action == "approve":
        application.status = True
        email_subject = "Application Approved"
        email_body = f"Congratulations! Your application for {job.title} has been approved."
        notification_message = f"Your application for {job.title} was approved!"
    elif action == "reject":
        application.status = False
        email_subject = "Application Rejected"
        email_body = f"Unfortunately, your application for {job.title} was not successful."
        notification_message = f"Your application for {job.title} was rejected."
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'approve' or 'reject'.")

    db.commit()

    # 4. Create notification for applicant
    notification = Notification(
        user_id=application.applicant_id,
        type=action,
        message=notification_message
    )
    db.add(notification)
    db.commit()

    # 5. Send email to applicant
    send_email(
        to=application.applicant.email,
        subject=email_subject,
        body=email_body
    )

    return {"message": f"Application {action}d successfully"}

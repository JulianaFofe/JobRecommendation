from fastapi import HTTPException
from schema.application import ApplicationCreate, ApplicationResponse, ApplicationStatus
from sqlalchemy.orm import Session
from models.users import User
from models.job import Job
from models.application import Application

def create_application(db: Session, job_id: int, applicant_id: int):
    user = db.query(User).filter(User.id == applicant_id).first()
    if not user or user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can apply for jobs")
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    existing_application = db.query(Application).filter(
        Application.job_id == job_id,
        Application.applicant_id == applicant_id
    ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    application = Application(
        job_id = job_id,
        applicant_id = applicant_id
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

def get_applications_by_Jobs(db: Session, job_id: int, employer_id: int):
    job = db.query(Job).filter(Job.id == job_id, Job.employer_id == employer_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not yours")
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    
    response = []
    for app in applications:
        response.append(
            ApplicationResponse(
                id=app.id,
                job_id=app.job_id,
                applicant_id=app.applicant_id,
                applicant_name=app.applicant.username,
                status=app.status,
                applied_at=app.applied_at
            )
        )
    return response

def update_application_status(db: Session, application_id: int, new_status: ApplicationStatus, employer_id: int):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application or application.job.employer_id != employer_id:
        raise HTTPException(status_code=404, detail="Application not found or not authorized")
    
    if application.status != ApplicationStatus.PENDING.value:
        raise HTTPException(status_code=400, detail="Only pending applications can be updated")
    
    application.status = new_status.value
    db.commit()
    db.refresh(application)

    return application
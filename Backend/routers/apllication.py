from typing import List
from fastapi import APIRouter, Depends, HTTPException
from schema.application import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate, ApplicationSubmitResponse
from sqlalchemy.orm import Session
from database import get_db
from models.users import User
from routers.auth import getCurrentUser
from crud.application_crud import create_application, get_applications_by_Jobs, update_application_status

router=APIRouter(prefix="/applications", tags=["Applications"]) 

@router.post("/", response_model = ApplicationSubmitResponse)
def applyForJob (
    appData: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can apply for jobs")
    
    application = create_application(db, job_id=appData.job_id, applicant_id=current_user.id)
    return ApplicationSubmitResponse(
        message="Application submitted",
        application=application 
    )


@router.get("/job/{job_id}", response_model = List[ApplicationResponse])
def list_applications_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)  
):
    if current_user.role != "employer":
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
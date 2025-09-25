from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utility.email import send_email
from enums.enums import ApplicationStatus
from models.application import Application
from database import get_db
import models, schema
from schema import notification as schema
from models.notification import Notification 

router = APIRouter(prefix="/notification", tags=["Notifications"])

@router.get("/notify", response_model=list[schema.NotificationOut])#get notification for user
def get_notify(user_id:int, db: Session=Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

@router.post("/mark-read/{notification_id}")
def mark_read(notification_id:int, db:Session=Depends(get_db)):
    notify=db.query(Notification).filter(Notification.id == notification_id).first()
    if not notify:
        raise HTTPException(status_code=404, detail="notification not found")
    notify.read = True
    db.commit()
    return {"success": True}

#endpoit to send notification to job seekers if their application is approved
@router.put("/{application_id}/{action}")
def handle_application(application_id: int, action: str, db: Session = Depends(get_db)):
    """
    Approve or reject a job application.
    action: "approve" or "reject"
    """
    # Get the application
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if action.lower() not in ["approve", "reject"]:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'approve' or 'reject'.")

    # Set status based on action
    if action.lower() == "approve":
        application.status = ApplicationStatus.APPROVED
        message_text = f"Congratulations! Your application for '{application.job.title}' has been approved.Reply with a yes to get a scheduled date for an interview"
        notification_type = "approval"
        email_subject = f"Application Approved: {application.job.title}"
    else:
        application.status = ApplicationStatus.REJECTED
        message_text = f"Sorry, your application for '{application.job.title}' has been rejected."
        notification_type = "rejection"
        email_subject = f"Application Rejected: {application.job.title}"

    # Commit application status
    db.commit()
    db.refresh(application)

    # Save notification in DB
    notification = Notification(
        user_id=application.applicant_id,
        type=notification_type,
        message=message_text
    )
    db.add(notification)
    db.commit()

    # Send email
    send_email(
        to=application.applicant.email,
        subject=email_subject,
        body=message_text
    )

    return {"message": f"Application {action.lower()}ed and email sent to {application.applicant.email}"}
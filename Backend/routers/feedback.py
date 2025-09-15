from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud.feedback as crud
import schema.feedback as schemas

router = APIRouter(prefix="/api", tags=["Feedback"])

@router.post("/feedback", response_model=schemas.FeedbackResponse)
def submit_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_feedback(db=db, feedback=feedback)

@router.get("/feedback", response_model=list[schemas.FeedbackResponse])
def get_all_feedbacks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_feedbacks(db=db, skip=skip, limit=limit)

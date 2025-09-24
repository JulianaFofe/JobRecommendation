from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import crud.review as crud
import schema.review as schemas

router = APIRouter(prefix="/api", tags=["Review"])

@router.post("/review", response_model=schemas.ReviewResponse)
def submit_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db=db, review=review)

@router.get("/review", response_model=list[schemas.ReviewResponse])
def get_all_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reviews(db=db, skip=skip, limit=limit)

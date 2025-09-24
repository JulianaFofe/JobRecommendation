from sqlalchemy.orm import Session
from models import Review
from schema.review import ReviewCreate

def create_review(db: Session, review: ReviewCreate):
    db_review = Review(
        applicant_name=review.applicant_name,
        job_position=review.job_position,
        rating=review.rating,
        message=review.message,
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Review).offset(skip).limit(limit).all()

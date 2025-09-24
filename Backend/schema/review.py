from pydantic import BaseModel

class ReviewCreate(BaseModel):
    applicant_name: str
    job_position: str
    rating: int   # 1–5 stars
    message: str

class ReviewResponse(ReviewCreate):
    id: int

    class Config:
        from_attributes = True   # Pydantic v2 replacement for orm_mode

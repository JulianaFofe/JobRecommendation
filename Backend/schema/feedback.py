from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class FeedbackBase(BaseModel):
    name: str
    email: EmailStr
    rating: int
    message: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

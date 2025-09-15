from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)       
    email = Column(String(150), nullable=False)      
    rating = Column(Integer, nullable=False)
    message = Column(String(500), nullable=False)   
    created_at = Column(DateTime(timezone=True), server_default=func.now())

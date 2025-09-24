from sqlalchemy import Column, Integer, String
from database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    applicant_name = Column(String(255), nullable=False)
    job_position = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    message = Column(String(1000), nullable=False)

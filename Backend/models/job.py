from sqlalchemy import Float, ForeignKey, String, Column, Integer, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Job(Base):
    __tablename__ = "jobs"
    id=Column(Integer, primary_key=True, index=True)
    title=Column(String(255), nullable=False)
    description=Column(Text, nullable=False)
    requirements=Column(Text, nullable=False)
    salary=Column(Float, nullable=True)
    location=Column(String(255), nullable=False)
    job_type=Column(String(255), nullable=False)
    posted_at=Column(datetime, default=datetime.utcnow)

    employer_id=Column(Integer, ForeignKey("users.id"))
    employer=relationship("User", back_populates="jobs")
    applications=relationship("Application", back_populates="job")
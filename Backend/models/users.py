from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id=Column(Integer, primary_key=True, index=True)
    username=Column(String(50), unique=True, nullable=False)
    email=Column(String(100), unique=True, nullable=False)
    hashed_password=Column(String(255),nullable=False)
    role=Column(String(20), nullable=False, default="employee")

    jobs=relationship("Job", back_populates="employer")
    applications= relationship("Application",back_populates="applicant")
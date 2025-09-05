from sqlalchemy import Integer, String, Column
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Application(Base):
    __tablename__="applications"
    id=Column(Integer, primary_key=True, index=True)
    job_id=Column(Integer, ForeignKey="jobs.id")
    applicant_id=Column(Integer, ForeignKey="users.id")
    status=Column(String(255), default="submitted")
    applied_at=Column(datetime, default=datetime.utcnow)

    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
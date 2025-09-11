from time import timezone
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    saved_at = Column(DateTime(timezone=True), default=lambda:datetime.now(timezone.utc))


    employee = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_jobs")

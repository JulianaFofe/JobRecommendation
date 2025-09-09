from sqlalchemy import DateTime, ForeignKey, Integer, String, Column
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class Application(Base):
    __tablename__="applications"
    id=Column(Integer, primary_key=True, index=True)
    job_id=Column(Integer, ForeignKey("jobs.id"))
    applicant_id=Column(Integer, ForeignKey("users.id"))
    status=Column(String(255), default="submitted")
    applied_at=Column(DateTime(timezone=True), default=lambda:datetime.now(timezone.utc))

    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications")
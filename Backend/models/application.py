from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Column
from sqlalchemy.orm import relationship
from database import Base
from enums.enums import ApplicationStatus
from datetime import datetime, timezone

class Application(Base):
    __tablename__="applications"
    id=Column(Integer, primary_key=True, index=True)
    job_id=Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    applicant_id=Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    status=Column(Enum(ApplicationStatus), nullable=False, default=ApplicationStatus.PENDING)
    applied_at=Column(DateTime(timezone=True), default=lambda:datetime.now(timezone.utc))
    resume = Column(String(255), nullable=True)
   

    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications", passive_deletes=True)
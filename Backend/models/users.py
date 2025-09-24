from sqlalchemy import Column, DateTime, Enum, Integer, String,Boolean
from sqlalchemy.orm import relationship
from enums.enums import UserRole
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "users"
    id=Column(Integer, primary_key=True, index=True)
    username=Column(String(50), unique=True, nullable=False)
    email=Column(String(100), unique=True, nullable=False)
    hashed_password=Column(String(255),nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.EMPLOYEE)
    dateCreated = Column("created_at", DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    dateUpdated = Column("updated_at", DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    jobs=relationship("Job", back_populates="employer")
    applications= relationship("Application",back_populates="applicant", cascade="all, delete-orphan")
    profile = relationship("Profile", back_populates="user", uselist=False)
    saved_jobs = relationship("SavedJob", back_populates="employee")
    is_approved = Column(Boolean, default=False)
    search_history = relationship("SearchHistory", back_populates="user", cascade="all, delete-orphan")

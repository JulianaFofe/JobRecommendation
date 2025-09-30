from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel): #input and output model
    title:str
    description:str
    requirements:str
    salary:Optional[float]=None
    location:str
    status: Optional[str] = "Available"
    job_type:str #part-time or full-time etc
  

class JobUpdate(BaseModel):
    title: Optional[str] = None 
    description: Optional[str] = None
    requirements: Optional[str] = None
    salary: Optional[float] = None 
    location: Optional[str] = None 
    job_type: Optional[str] = None
    status: Optional[str] = None

class JobCreate(JobBase):#input model(when creating a job to post)
    """Used when employer creates a job.
    Employer cannot set is_approved here."""
    pass 

class Job(JobBase):#output model(how the job reaches the job seeker)
    id:int
    employer_id: Optional[int]
    posted_at:datetime
    is_approved: bool

    class Config:#helps to convert sqlalchemy models into json(readable forat)
        orm_mode = True  

class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    requirements: str
    salary: Optional[float] = None
    location: str
    job_type: str
    status: str
    posted_at: datetime

    class Config:
        orm_mode = True
        

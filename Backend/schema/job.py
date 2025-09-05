from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel): #input and output model
    title:str
    description:str
    requirements:str
    salary:Optional[float]=None
    location:str
    job_type:str #part-time or full-time etc

class JobCreate(JobBase):#input model(when creating a job to post)
    pass 

class Job(JobBase):#output model(how the job reaches the job seeker)
    id:int
    employer_id:int
    posted_at:datetime

    class Config:#helps to convert sqlalchemy models into json(readable forat)
        from_attribute=True
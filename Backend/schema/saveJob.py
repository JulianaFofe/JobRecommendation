from pydantic import BaseModel
from datetime import datetime
from schema.job import Job 

class SavedJobRead(BaseModel):
    id: int
    saved_at: datetime
    job: Job

    class Config:
        from_attributes = True

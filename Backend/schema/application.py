from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class ApplicationStatus(str, Enum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"

class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    applicant_id: int
    applicant_name: str 
    status: ApplicationStatus
    applied_at: datetime

    model_config = {
        "from_attributes": True,  
        "use_enum_values": True
    }


class ApplicationSubmitResponse(BaseModel):
    message: str
    application: ApplicationResponse

    model_config = {
        "from_attributes": True 
    }
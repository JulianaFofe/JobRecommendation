from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr

class UserRole(str, Enum):
    employee = "employee"
    employer = "employer"
    admin = "admin"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Optional[UserRole] = UserRole.employee 

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserBase):
    password: str  

class UserRead(UserBase):
    id: int
    dateCreated: datetime
    dateUpdated: datetime

    class Config:
        orm_mode = True
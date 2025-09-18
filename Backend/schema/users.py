from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class UserRole(str, Enum):
    employee = "employee"
    employer = "employer"
    admin = "admin"

class UserBase(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: Optional[UserRole] = UserRole.employee 

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserBase):
    password: str  

class UserRead(UserBase):
    dateCreated: datetime
    is_approved: bool

    class Config:
        orm_mode = True
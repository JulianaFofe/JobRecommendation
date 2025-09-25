from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    resume_url: Optional[str] = None

    # ✅ Added new fields
    name: Optional[str] = None             # NEW field
    contact_email: Optional[str] = None    # NEW field


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    username: str   # from User model
    email: str      # from User model

    class Config:
        orm_mode = True

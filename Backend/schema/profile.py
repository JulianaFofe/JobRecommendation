from pydantic import BaseModel

class ProfileBase(BaseModel):
    skills: str
    education: str
    experience: str

class ProfileCreate(ProfileBase):
    pass

class ProfileRead(ProfileBase):
    id: int
    user_id: int
    resume_url: str | None = None  

    model_config = {"from_attributes": True}

from pydantic import BaseModel
from datetime import datetime

class NotificationBase(BaseModel):
    user_id:int 
    type:str
    message:str
class NotificationCreate(NotificationBase):
    pass 
class NotificationOut(NotificationBase):
    id:int
    read:bool
    created_at:datetime
    class Config:
        orm_mode = True
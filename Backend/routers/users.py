from datetime import timedelta
from fastapi import APIRouter, Depends
from routers.auth import createAccessToken
from database import get_db
import schema.users as schema
from sqlalchemy.orm import Session
from crud import user_crud

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/signup", response_model=schema.UserRead)
def signup(user: schema.UserCreate, db: Session = Depends(get_db)):
    return user_crud.signup(db, user)

@router.post("/login")
def login(user: schema.LoginRequest, db: Session = Depends(get_db)):
    user = user_crud.loginUser(db, user.email, user.password)
    if not user:
        return('Invalid credentials')
    accessToken = createAccessToken({
        "sub" : str(user.id),
        "role": user.role
    }, expires_delta = timedelta(days = 1))

    return {
        "access_token": accessToken,
        "token_type": "bearer",
        "role": user.role
    }
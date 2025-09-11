from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from routers.auth import createAccessToken
from database import get_db
from sqlalchemy.orm import Session
from crud import user_crud
from models import User
import schema.users as schema

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/signup")
def signup(user: schema.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = user_crud.signup(db, user)

    # Return success message and user info
    return {
        "message": "Signup successful!",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }

@router.post("/login")
def login(user: schema.LoginRequest, db: Session = Depends(get_db)):
    db_user = user_crud.loginUser(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials"
        )

    accessToken = createAccessToken({
        "sub": str(db_user.id),
        "role": db_user.role,
        "name": db_user.username
    }, expires_delta=timedelta(days=1))

    return {
        "message": "Login successful!",
        "access_token": accessToken,
        "token_type": "bearer",
        "role": db_user.role,
        "name": db_user.username
    }

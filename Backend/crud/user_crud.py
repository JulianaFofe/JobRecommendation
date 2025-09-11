from sqlalchemy.orm import Session
from routers.auth import hashPassword, verifyPassword
from schema import users as schema
import models.users as models
from fastapi import HTTPException, status

def signup(db: Session, user: schema.UserCreate):
    userExists = db.query(models.User).filter(models.User.email == user.email).first()
    if userExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashedPassword = hashPassword(user.password)

    newUser = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashedPassword,
        role=user.role
    )
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return newUser


def authenticateUser(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None
    if not verifyPassword(password, user.hashed_password):
        return None
    return user


def loginUser(db: Session, email: str, password: str):
    user = authenticateUser(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    return user

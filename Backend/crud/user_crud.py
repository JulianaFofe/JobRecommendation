from datetime import timedelta
from sqlalchemy.orm import Session
from routers.auth import createAccessToken, hashPassword, verifyPassword
from schema import users as schema
import models.users as models


def signup(db:Session, user: schema.UserCreate):
    userExists = db.query(models.User).filter(models.User.email == user.email).first()
    if userExists:
        return('Email already registered')
    
    hashedPassword = hashPassword(user.password)

    newUser = models.User(
        username = user.username,
        email = user.email,
        hashed_password = hashedPassword,
        role = user.role
    )
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return newUser


def authenticateUser(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return ('User not found')
    if not verifyPassword(password, user.hashed_password):
        return ('Invalid password')
    return user


def loginUser(db: Session, email: str, password: str):
    user = authenticateUser(db, email, password)
    if not user:
        return ('Invalid credentials')
    return user

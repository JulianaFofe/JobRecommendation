from datetime import datetime, timedelta, timezone
import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
import jwt
from passlib.context import CryptContext
import re
from models.users import User
from database import get_db

<<<<<<< HEAD

secretKey = os.getenv("JWT_SECRET")
expiresIn = os.getenv("JWT_EXPIRES_IN")
algorithm = os.getenv("ALGORITHM")
=======
# JWT settings
secretKey = os.getenv("JWT_SECRET", "mysupersecretkey")
expiresIn = int(os.getenv("JWT_EXPIRES_IN", 30))  # days
algorithm = os.getenv("ALGORITHM", "HS256")
>>>>>>> 14e145b4 (admin endpoint for delete)

pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

print("JWT_SECRET:", secretKey, type(secretKey))
print("ALGORITHM:", algorithm, type(algorithm))
print("JWT_EXPIRES_IN:", expiresIn, type(expiresIn))


router = APIRouter()

<<<<<<< HEAD
def validate_password(password: str):
    """
    Enforces password constraints:
    - Minimum 8 characters
    - Maximum 16 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 8 or len(password) > 16:
        raise HTTPException(status_code=400, detail="Password must be 8-16 characters long")
    
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one uppercase letter")
    
    if not re.search(r"[a-z]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one lowercase letter")
    
    if not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="Password must include at least one number")
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(status_code=400, detail="Password must include at least one special character")
    
    return True

=======
# Password hashing
>>>>>>> 14e145b4 (admin endpoint for delete)
def hashPassword(password: str):
    validate_password(password)
    return pwdContext.hash(password)

def verifyPassword(plainPassword: str, hashedPassword: str):
    return pwdContext.verify(plainPassword, hashedPassword)

# JWT token functions
def createAccessToken(data: dict, expires_delta: Optional[timedelta] = None):
    toEncode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=expiresIn))
    toEncode.update({"exp": expire})
    encodedJwt = jwt.encode(toEncode, secretKey, algorithm=algorithm)
    return encodedJwt

def verifyAccessToken(token: str):
    try:
        payload = jwt.decode(token, secretKey, algorithms=[algorithm])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            return None
        return {"id": int(user_id), "role": role}
    except JWTError:
        return None

def getCurrentUser(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# -------------------------
# Dummy data helper
# -------------------------
def create_dummy_users(db: Session):
    """Create dummy users if they don't exist."""
    dummy_users = [
        {"username": "alice", "email": "alice@example.com", "password": "password123", "role": "employee"},
        {"username": "bob", "email": "bob@example.com", "password": "password123", "role": "employer"},
        {"username": "charlie", "email": "charlie@example.com", "password": "password123", "role": "employee"},
    ]
    
    for user_data in dummy_users:
        user = db.query(User).filter(User.email == user_data["email"]).first()
        if not user:
            new_user = User(
                username=user_data["username"],
                email=user_data["email"],
                password=hashPassword(user_data["password"]),
                role=user_data["role"]
            )
            db.add(new_user)
    db.commit()
    print("Dummy users created!")

# Example: Call this on app startup
# from fastapi import FastAPI
# app = FastAPI()
# @app.on_event("startup")
# def startup_event():
#     db = next(get_db())
#     create_dummy_users(db)
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Security, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
import re
from models.users import User
from database import get_db

load_dotenv()


secretKey = os.getenv("JWT_SECRET")
expiresIn = int(os.getenv("JWT_EXPIRES_IN", 1)) 
algorithm = os.getenv("ALGORITHM")

pwdContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

print("JWT_SECRET:", secretKey, type(secretKey))
print("ALGORITHM:", algorithm, type(algorithm))
print("JWT_EXPIRES_IN:", expiresIn, type(expiresIn))


router = APIRouter()

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

def hashPassword(password: str):
    validate_password(password)
    return pwdContext.hash(password)

def verifyPassword(plainPassword : str, hashedPassword: str):
    return pwdContext.verify(plainPassword, hashedPassword)

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

def getCurrentUser(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme), db: Session = Depends(get_db)):
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    token_data = verifyAccessToken(token)
    if token_data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == token_data["id"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

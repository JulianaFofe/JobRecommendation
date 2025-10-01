# scripts/seed.py
import os
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
from models import User
from enums.enums import UserRole
from passlib.context import CryptContext

# Optional: hash passwords using passlib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_users(db: Session):
    # Example users
    users = [
        User(
            username="alice",
            email="alice@example.com",
            hashed_password=get_password_hash("alice123"),
            role=UserRole.EMPLOYEE,
            is_approved=True
        ),
        User(
            username="bob",
            email="bob@example.com",
            hashed_password=get_password_hash("bob123"),
            role=UserRole.EMPLOYEE,
            is_approved=True
        ),
        User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_approved=True
        ),
    ]

    db.add_all(users)
    db.commit()
    print("Seeded users successfully!")

def main():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_users(db)
    finally:
        db.close()

if __name__ == "_main_":
    main()
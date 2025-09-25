
from fastapi import FastAPI
from routers import feedback
from database import engine, Base
import models.users as userModel
from routers import apllication
from routers import admins
from routers import profile
from routers import saveJob
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import literal
from dotenv import load_dotenv
load_dotenv()  # MUST be first
from models import User
from database import SessionLocal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, recommendations, job
import models.users as userModel
from sqlalchemy.orm import Session
from security import hash_password, verify_password
from datetime import datetime
from routers import review
from routers import profile


# Create tables
userModel.Base.metadata.create_all(bind=engine)

app = FastAPI()




# CORS setup
allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from sqlalchemy import literal
from database import SessionLocal
from models import User
from security import hash_password
from datetime import datetime


@app.on_event("startup")
def create_super_admin():
    db = SessionLocal()
    try:
        super_email = "superadmin@example.com"
        existing = db.query(User).filter(User.email == super_email).limit(literal(1)).all()

        if not existing:
            super_admin = User(
                username="superadmin",
                email=super_email,
                hashed_password=hash_password("SuperSecurePassword123"),
                role="admin",
                is_approved=True,
                dateCreated=datetime.utcnow()
            )
            db.add(super_admin)
            db.commit()
            print("Super admin created!")
        else:
            print("Super admin already exists")
    finally:
        db.close()


@app.get("/")
def root():
    return{"message":"Backend is running"}

app.include_router(users.router)
app.include_router(apllication.router)
app.include_router(admins.router)
app.include_router(profile.router)
app.include_router(saveJob.router)
app.include_router(job.router)
app.include_router(recommendations.router)
app.include_router(feedback.router)
app.include_router(review.router)
app.include_router(profile.router, prefix="/profiles")
app.include_router(profile.router)



@app.get("/")
def root():
    return {"message": "Backend is running"}


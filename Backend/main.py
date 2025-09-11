
from fastapi import FastAPI
from database import engine, Base
from routers import users
import models.users as userModel
from routers import recommendations
from routers import job
from routers import apllication
from routers import admins
from routers import profile
from routers import saveJob
from database import engine
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()  # MUST be first


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, recommendations, job
import models.users as userModel

# Create tables
userModel.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup
# origins = [
#     "http://localhost:5173",  
#     "http://127.0.0.1:5173",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

# Routers
app.include_router(users.router)
app.include_router(job.router)
app.include_router(recommendations.router)

@app.get("/")
def root():
    return {"message": "Backend is running"}


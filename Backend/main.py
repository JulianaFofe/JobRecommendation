from fastapi import FastAPI
from database import engine, Base
from routers import users
import models.users as userModel
from routers import recommendations
from routers import job
from routers import apllication
from routers import admins
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

userModel.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     
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
app.include_router(job.router)
app.include_router(recommendations.router)

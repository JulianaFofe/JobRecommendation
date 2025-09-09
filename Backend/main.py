from fastapi import FastAPI
from database import engine, Base
from routers import users
import models.users as userModel
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

app.include_router(users.router)

@app.get("/")
def root():
    return{"message":"Backend is running"}
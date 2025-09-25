import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from schema.profile import ProfileCreate, ProfileResponse
from crud.profile import create_or_update_profile, get_profile
from routers.auth import getCurrentUser
from models.users import User
from models.profile import Profile


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

def build_profile_response(db_profile: Profile, current_user: User) -> ProfileResponse:
    return ProfileResponse(
        id=db_profile.id,
        user_id=db_profile.user_id,
        username=current_user.username,
        email=current_user.email,
        skills=db_profile.skills,
        experience=db_profile.experience,
        education=db_profile.education,
        resume_url=db_profile.resume_url,
    )

# -------------------
# Endpoints
# -------------------

@router.get("/", response_model=ProfileResponse)
def read_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
):
    db_profile = get_profile(db, current_user.id)
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return build_profile_response(db_profile, current_user)

@router.post("/", response_model=ProfileResponse)
def create_update_profile_endpoint(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
):
    db_profile = create_or_update_profile(db, current_user.id, profile_data=profile)
    return build_profile_response(db_profile, current_user)

@router.post("/upload-resume", response_model=ProfileResponse)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
):
    upload_dir = "uploads/resumes"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, f"user_{current_user.id}_{file.filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_profile = create_or_update_profile(db, current_user.id, resume_url=file_path)
    return build_profile_response(db_profile, current_user)

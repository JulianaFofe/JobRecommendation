import os
import shutil
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from schema.profile import ProfileCreate, ProfileRead
from crud.profile import create_or_update_profile, get_profile
from models.users import User
from routers.auth import getCurrentUser

router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.post("/", response_model=ProfileRead)
def create_update_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can create or update profiles")
    return create_or_update_profile(db, current_user.id, profile)


@router.get("/", response_model=ProfileRead)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    result = get_profile(db, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile, username = result
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "skills": profile.skills,
        "education": profile.education,
        "experience": profile.experience,
        "resume_url": profile.resume_url,
        "username": username
    }


@router.post("/resume", response_model=ProfileRead)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    upload_dir = "uploads/resumes"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, f"user_{current_user.id}_{file.filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    profile = get_profile(db, current_user.id)
    if profile:
        profile_obj, username = profile
        profile_obj.resume_url = file_path
        db.commit()
        db.refresh(profile_obj)
        return {
            "id": profile_obj.id,
            "user_id": profile_obj.user_id,
            "skills": profile_obj.skills,
            "education": profile_obj.education,
            "experience": profile_obj.experience,
            "resume_url": profile_obj.resume_url,
            "username": username
        }
    else:
        profile = create_or_update_profile(
            db=db,
            user_id=current_user.id,
            profile=ProfileCreate(skills="", education="", experience=""),
            resume_url=file_path
        )
        return {
            "id": profile.id,
            "user_id": profile.user_id,
            "skills": profile.skills,
            "education": profile.education,
            "experience": profile.experience,
            "resume_url": profile.resume_url,
            "username": current_user.username
        }

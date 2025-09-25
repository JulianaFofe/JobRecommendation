from sqlalchemy.orm import Session
from models.profile import Profile
from schema.profile import ProfileCreate

def get_profile(db: Session, user_id: int):
    return db.query(Profile).filter(Profile.user_id == user_id).first()

def create_or_update_profile(
    db: Session,
    user_id: int,
    profile_data: ProfileCreate = None,
    resume_url: str = None
) -> Profile:
    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if db_profile:
        # Update existing
        if profile_data:
            db_profile.skills = profile_data.skills
            db_profile.experience = profile_data.experience
            db_profile.education = profile_data.education
        if resume_url:
            db_profile.resume_url = resume_url
    else:
        # Create new
        db_profile = Profile(
            user_id=user_id,
            skills=profile_data.skills if profile_data else None,
            experience=profile_data.experience if profile_data else None,
            education=profile_data.education if profile_data else None,
            resume_url=resume_url
        )
        db.add(db_profile)

    db.commit()
    db.refresh(db_profile)
    return db_profile

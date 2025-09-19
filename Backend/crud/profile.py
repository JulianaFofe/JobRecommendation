from sqlalchemy.orm import Session
from models.profile import Profile
from models.users import User
from schema.profile import ProfileCreate

def create_or_update_profile(db: Session, user_id: int, profile: ProfileCreate, resume_url: str | None = None):
    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if db_profile:
        db_profile.skills = profile.skills
        db_profile.education = profile.education
        db_profile.experience = profile.experience
        if resume_url:
            db_profile.resume_url = resume_url
    else:
        db_profile = Profile(
            user_id=user_id,
            **profile.model_dump(),
            resume_url=resume_url
        )
        db.add(db_profile)

    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_profile(db: Session, user_id: int):
    return (
        db.query(Profile, User.username)
        .join(User, User.id == Profile.user_id)
        .filter(Profile.user_id == user_id)
        .first()
    )

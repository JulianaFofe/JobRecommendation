from sqlalchemy.orm import Session, joinedload
from models.profile import Profile

def get_profile(db: Session, user_id: int):
    return (
        db.query(Profile)
        .options(joinedload(Profile.user))  # make sure User is available
        .filter(Profile.user_id == user_id)
        .first()
    )

def create_or_update_profile(db: Session, user_id: int, profile_data, resume_url: str | None = None):
    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if db_profile:
        db_profile.skills = profile_data.skills
        db_profile.experience = profile_data.experience
        db_profile.education = profile_data.education
        if resume_url:
            db_profile.resume_url = resume_url
    else:
        db_profile = Profile(
            user_id=user_id,
            skills=profile_data.skills,
            experience=profile_data.experience,
            education=profile_data.education,
            resume_url=resume_url,
        )
        db.add(db_profile)

    db.commit()
    db.refresh(db_profile)
    return db_profile

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from crud.job_crud import get_all_jobs, get_job_by_id, get_all_employees
from utility.ai import get_personalized_recommendations, get_recommendation_strategy, get_recommendations_from_applications, recommend_candidates_for_jobs, recommend_jobs_for_employees, user_to_dict
from database import get_db
from sqlalchemy.orm import Session
from routers.auth import getCurrentUser
from models import User, Application

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

# Recommending candidates 
def calculate_candidate_match_score(job: Any, candidate: dict) -> float:
    """
    Weighted match between job and candidate.
    Higher score if candidate's skills match job requirements/title/description.
    """
    job_title = job.get("title", "") if isinstance(job, dict) else getattr(job, "title", "")
    job_description = job.get("description", "") if isinstance(job, dict) else getattr(job, "description", "")
    job_requirements = job.get("requirements", "") if isinstance(job, dict) else getattr(job, "requirements", "")

    candidate_skills = candidate.get("skills", [])

    if not candidate_skills:
        return 0.0

    score = 0.0
    for skill in candidate_skills:
        skill_lower = skill.lower()
        if skill_lower in job_title.lower():
            score += 3.0  # match in title
        if skill_lower in job_requirements.lower():
            score += 2.0  # match in requirements
        if skill_lower in job_description.lower():
            score += 1.0  # match in description

    return score


def recommend_candidates_for_job(job: Any, employees: List[dict], top_n: int = 5) -> List[dict]:
    """
    Recommend matching candidates for a job.
    Returns list of dicts with candidate and score.
    """
    scored_candidates = []
    for candidate in employees:
        score = calculate_candidate_match_score(job, candidate)
        scored_candidates.append({
            "candidate": candidate,
            "score": score
        })

    # Sort candidates by score descending
    scored_candidates.sort(key=lambda x: x["score"], reverse=True)
    return scored_candidates[:top_n]

# -----------------------------
# Routes
# -----------------------------
@router.get("/employees_recommendations")
def recommend_jobs(
    top_n: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can access this resource")

    # All jobs in DB
    jobs = get_all_jobs(db)
    if not jobs:
        return {
            "requested_by": current_user.username,
            "employee": current_user.username,
            "search_count": 0,
            "recommendation_strategy": "No jobs available",
            "recommendations": []
        }

    # Employee profile and skills
    employee_dict = user_to_dict(current_user, db)
    profile_skills = employee_dict.get("skills", [])

    # Past applications
    previous_applications = (
        db.query(Application)
        .filter(Application.applicant_id == current_user.id)
        .all()
    )
    applied_jobs = [app.job for app in previous_applications if app.job is not None]

    # Recommendations
    profile_recs = get_personalized_recommendations(employee_dict, jobs, top_n * 2)  # skills + search history
    application_recs = get_recommendations_from_applications(applied_jobs, jobs, top_n * 2)  # past apps

    # Score jobs
    scored: dict[int, dict] = {}

    def add_score(job, weight):
        if not job:
            return
        job_id = job.id if hasattr(job, "id") else job.get("id", None)
        if job_id is None:
            return
        if job_id not in scored:
            scored[job_id] = {"job": job, "score": 0}
        scored[job_id]["score"] += weight

    # 🔹 Highest priority → Exact skill matches from profile
    for job in jobs:
        job_title = job.title if hasattr(job, "title") else job.get("title", "")
        job_desc = job.description if hasattr(job, "description") else job.get("description", "")
        job_reqs = getattr(job, "requirements", None) if hasattr(job, "__dict__") else job.get("requirements", "")

        # Calculate skill match score
        skill_score = 0.0
        for skill in profile_skills:
            skill_lower = skill.lower()
            if skill_lower in job_title.lower():
                skill_score += 5.0  # title match = strong
            elif skill_lower in job_reqs.lower():
                skill_score += 3.0  # requirements match = medium
            elif skill_lower in job_desc.lower():
                skill_score += 1.5  # description match = small
        if skill_score > 0:
            add_score(job, skill_score)

    # 🔹 Medium priority → Past applications
    for job in application_recs:
        add_score(job, 3.0)

    # 🔹 Low priority → profile/search history recommendations
    for job in profile_recs:
        add_score(job, 2.0)

    # 🔹 Fallback → other jobs not scored yet
    for job in jobs:
        job_id = job.id if hasattr(job, "id") else job.get("id", None)
        if job_id is None or job_id in scored:
            continue
        add_score(job, 0.5)

    # Sort by score descending
    ranked_jobs = sorted(scored.values(), key=lambda x: x["score"], reverse=True)

    # Remove duplicates & normalize for JSON
    seen = set()
    final_jobs = []
    for entry in ranked_jobs:
        job = entry["job"]
        job_id = job.id if hasattr(job, "id") else job.get("id", None)
        if job_id in seen or job_id is None:
            continue
        seen.add(job_id)

        job_dict = {
            "id": job.id if hasattr(job, "id") else job.get("id"),
            "title": job.title if hasattr(job, "title") else job.get("title"),
            "description": job.description if hasattr(job, "description") else job.get("description"),
            "requirements": getattr(job, "requirements", None) if hasattr(job, "__dict__") else job.get("requirements"),
        }
        final_jobs.append(job_dict)

    return {
        "requested_by": current_user.username,
        "employee": current_user.username,
        "search_count": employee_dict.get("search_count", 0),
        "recommendation_strategy": get_recommendation_strategy(employee_dict.get("search_count", 0)),
        "recommendations": final_jobs[:top_n]
    }

@router.get("/job/{job_id}/candidates")
def recommend_candidates(
    job_id: int,
    top_n: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser),
):
    # ✅ Check if job exists
    job = get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # ✅ Get applications for this job
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    if not applications:
        return {
            "requested_by": current_user.username,
            "job": job.title if hasattr(job, "title") else job.get("title"),
            "candidates": [],  # No recommendations if no applications
            "message": "No applications found for this job."
        }

    # ✅ Build candidate pool only from applicants
    applicants_dict = []
    for app in applications:
        emp = app.applicant  
        if not emp:
            continue

        skills = []
        if emp.profile and emp.profile.skills:
            if isinstance(emp.profile.skills, str):
                skills = [s.strip() for s in emp.profile.skills.split(",")]
            elif isinstance(emp.profile.skills, list):
                skills = emp.profile.skills

        applicants_dict.append({
            "id": emp.id,
            "name": emp.username,
            "skills": skills,
            "applied_jobs": [a.job_id for a in emp.applications],
        })

    # ✅ Match only these applicants against the job
    matches = recommend_candidates_for_job(job, applicants_dict, top_n)

    return {
        "requested_by": current_user.username,
        "job": job.title if hasattr(job, "title") else job.get("title"),
        "candidates": matches,
    }





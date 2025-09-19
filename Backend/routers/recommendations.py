from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from crud.job_crud import get_all_jobs, get_job_by_id, get_all_employees
from utility.ai import get_personalized_recommendations, get_recommendation_strategy, recommend_candidates_for_jobs, recommend_jobs_for_employees, user_to_dict
from database import get_db
from sqlalchemy.orm import Session
from routers.auth import getCurrentUser
from models import User, SearchHistory
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
@router.get("/employees/{employee_id}")
def recommend_jobs(
    top_n: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    jobs = get_all_jobs(db)
    employee_dict = user_to_dict(current_user, db)
    recommendations = get_personalized_recommendations(employee_dict, jobs, top_n)

    return {
        "requested_by": current_user.username,
        "employee": current_user.username,
        "search_count": employee_dict["search_count"],
        "recommendation_strategy": get_recommendation_strategy(employee_dict["search_count"]),
        "recommendations": recommendations
    }

@router.get("/job/{job_id}/candidates")
def recommend_candidates(
    job_id: int,
    top_n: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(getCurrentUser)
):
    job = get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # ✅ Get all employees
    employees = get_all_employees(db)

    employees_dict = []
    for emp in employees:
        skills = []
        if emp.profile and emp.profile.skills:
            if isinstance(emp.profile.skills, str):
                skills = [s.strip() for s in emp.profile.skills.split(",")]
            elif isinstance(emp.profile.skills, list):
                skills = emp.profile.skills

        employees_dict.append({
            "id": emp.id,
            "name": emp.username,
            "skills": skills,
            "applied_jobs": [app.job_id for app in emp.applications]
        })

    # ✅ Match candidates
    matches = recommend_candidates_for_job(job, employees_dict, top_n)
    
    return {
        "requested_by": current_user.username,
        "job": job.title if hasattr(job, "title") else job.get("title"),
        "candidates": matches
    }


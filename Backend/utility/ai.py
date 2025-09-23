from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np 
from models import User, SearchHistory
from sqlalchemy.orm import Session
from typing import Any, List

def preprocess_skills(skills) -> str:
    # If skills is a string, just lower it
    if isinstance(skills, str):
        return skills.lower()
    # If skills is a list
    elif isinstance(skills, list):
        return " ".join(skills).lower()
    return ""

def recommend_jobs_for_employees(employee: Dict, jobs: List[Dict], top_n: int = 5) -> List[Dict]:
    # Normalize skills
    skills = employee.get("skills", [])
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",")]

    searches = employee.get("search_history", [])[:3]
    employee_text = skills if skills else searches

    if not employee_text:
        return []

    employee_text = preprocess_skills(employee_text)
    job_texts = [preprocess_skills(job.get("requirements", "")) for job in jobs]

    vectorizer = TfidfVectorizer()
    tfid_matrix = vectorizer.fit_transform([employee_text] + job_texts)

    similarities = cosine_similarity(tfid_matrix[0:1], tfid_matrix[1:]).flatten()
    ranked_indices = np.argsort(similarities)[::-1]

    recommendations = []
    for idx in ranked_indices:
        if jobs[idx]["id"] not in employee.get("applied_jobs", []):
            recommendations.append({
                "job": jobs[idx],
                "score": float(similarities[idx])
            })
        if len(recommendations) >= top_n:
            break

    return recommendations

def recommend_candidates_for_jobs(job:Dict, employees:List[Dict], top_n:int = 5)->List[Dict]:
    job_text=preprocess_skills(job.get("requirements", "").split())
    employee_text = [preprocess_skills(e.get("skills", [] ))for e in employees]

    vectoriser = TfidfVectorizer()
    tfid_matrix = vectoriser.fit_transform([job_text] + employee_text)

    similarities = cosine_similarity(tfid_matrix[0:1], tfid_matrix[1:]).flatten()
    ranked_similarities = np.argsort(similarities)[::1]

    matches = []

    for idx in ranked_similarities[:top_n]:
        matches.append({
            "candidate":employees[idx],
            "score":float(similarities[idx])
        })
    return matches

def user_to_dict(user: User, db: Session) -> dict:
    searches = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == user.id)
        .order_by(SearchHistory.created_at.desc())
        .limit(3)
        .all()
    )
    search_history = [s.query for s in searches]

    # Ensure skills is always a list
    skills = []
    if user.profile and user.profile.skills:
        if isinstance(user.profile.skills, str):
            skills = [s.strip() for s in user.profile.skills.split(",")]
        elif isinstance(user.profile.skills, list):
            skills = user.profile.skills

    return {
        "id": user.id,
        "name": user.username,
        "skills": skills,
        "search_history": search_history,
        "applied_jobs": [app.job_id for app in user.applications],
        "search_count": len(search_history)
    }

def get_job_skills(job: Any) -> List[str]:
    """Extract job requirements as list of tokens"""
    if isinstance(job, dict):
        text = job.get("requirements", "") or ""
    else:
        text = getattr(job, "requirements", "") or ""
    return text.lower().split()

def calculate_skill_match_score(user_skills: List[str], job: Any) -> float:
    """Weighted skill match: title > requirements > description"""
    if not user_skills:
        return 0.0

    # Normalize skills
    skills = [s.lower() for s in user_skills]

    # Extract job fields
    job_title = job.get("title", "") if isinstance(job, dict) else getattr(job, "title", "")
    job_description = job.get("description", "") if isinstance(job, dict) else getattr(job, "description", "")
    job_requirements = job.get("requirements", "") if isinstance(job, dict) else getattr(job, "requirements", "")
    score = 0.0

    for skill in skills:
        if skill in job_title.lower():
            score += 3.0   # strong weight for title matches
        if skill in job_requirements.lower():
            score += 2.0   # medium weight for requirements
        if skill in job_description.lower():
            score += 1.0   # small weight for description

    return score

def calculate_search_match_score(search_history: List[str], job_title: str, job_description: str) -> float:
    """Simple keyword overlap between search history and job content"""
    if not search_history:
        return 0.0

    job_content = f"{job_title} {job_description}".lower()
    match_score = 0.0

    for search_term in search_history:
        if search_term.lower() in job_content:
            match_score += 1.0

    return match_score / len(search_history)

# -----------------------------
# Recommendation strategies
# -----------------------------
def recommend_jobs_by_skills_only(user_data: dict, jobs: List[Any], top_n: int) -> List[Any]:
    skills = user_data.get("skills", [])
    if not skills:
        return jobs[:top_n]

    scored_jobs = []
    for job in jobs:
        score = calculate_skill_match_score(skills, job)
        scored_jobs.append({"job": job, "score": score})

    # Sort so jobs with highest skill relevance come first
    scored_jobs.sort(key=lambda x: x["score"], reverse=True)
    return [item["job"] for item in scored_jobs[:top_n]]

def recommend_jobs_with_limited_history(user_data: dict[str, Any], jobs: List[Any], top_n: int) -> List[Any]:
    """Recommend jobs combining skills (70%) and limited search history (30%)"""
    skills = user_data.get("skills", [])
    search_history = user_data.get("search_history", [])

    scored_jobs = []
    for job in jobs:
        job_skills = get_job_skills(job)
        job_title = job.get("title", "") if isinstance(job, dict) else getattr(job, 'title', "")
        job_description = job.get("description", "") if isinstance(job, dict) else getattr(job, 'description', "")

        skill_score = calculate_skill_match_score(skills, job_skills) * 0.7
        search_score = calculate_search_match_score(search_history, job_title, job_description) * 0.3
        total_score = skill_score + search_score

        scored_jobs.append({
            "job": job,
            "score": total_score,
            "match_reason": "Skills + limited search history match"
        })

    scored_jobs.sort(key=lambda x: x["score"], reverse=True)
    return [item["job"] for item in scored_jobs[:top_n]]

def get_personalized_recommendations(user_data: dict[str, Any], jobs: List[Any], top_n: int = 5) -> List[Any]:
    """
    Strategy based on search history count:
    - 3+ searches: use AI.py full recommender
    - 1-2 searches: weighted skills + searches
    - 0 searches: skills only
    """
    search_count = user_data.get("search_count", 0)

    if search_count == 0:
        return recommend_jobs_by_skills_only(user_data, jobs, top_n)
    elif search_count <= 2:
        return recommend_jobs_with_limited_history(user_data, jobs, top_n)
    else:
        return recommend_jobs_for_employees(user_data, jobs, top_n)

def get_recommendation_strategy(search_count: int) -> str:
    if search_count == 0:
        return "Skills-only recommendations (no search history)"
    elif search_count <= 2:
        return f"Combined skills + limited search history ({search_count} searches)"
    else:
        return f"Full recommendation using skills + search history ({search_count} searches)"

def get_recommendations_from_applications(applied_jobs: List[Any], all_jobs: List[Any], top_n: int = 5) -> List[Any]:
    """
    Recommend jobs similar to previously applied jobs using TF-IDF + cosine similarity
    """
    if not applied_jobs:
        return []

    # Prepare job texts
    applied_texts = []
    for job in applied_jobs:
        desc = job.get("description", "") if isinstance(job, dict) else getattr(job, "description", "")
        reqs = job.get("requirements", "") if isinstance(job, dict) else getattr(job, "requirements", "")
        applied_texts.append(f"{desc} {reqs}")

    all_job_texts = []
    for job in all_jobs:
        desc = job.get("description", "") if isinstance(job, dict) else getattr(job, "description", "")
        reqs = job.get("requirements", "") if isinstance(job, dict) else getattr(job, "requirements", "")
        all_job_texts.append(f"{desc} {reqs}")

    # TF-IDF + cosine similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(applied_texts + all_job_texts)
    
    similarities = cosine_similarity(tfidf_matrix[0:len(applied_texts)], tfidf_matrix[len(applied_texts):])
    avg_similarity = similarities.mean(axis=0)

    # Rank jobs by similarity
    ranked_indices = avg_similarity.argsort()[::-1]

    recommendations = []
    applied_job_ids = {job.get("id") if isinstance(job, dict) else getattr(job, "id") for job in applied_jobs}

    for idx in ranked_indices:
        job = all_jobs[idx]
        job_id = job.get("id") if isinstance(job, dict) else getattr(job, "id")
        if job_id not in applied_job_ids:
            recommendations.append(job)
        if len(recommendations) >= top_n:
            break

    return recommendations
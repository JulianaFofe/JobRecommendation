from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np 

def preprocess_skills(skills: List[str])->str:
    return "".join(skills).lower()#converts a list of skills into a lowercase string for tf-idf

def recommend_jobs_for_employees(employee:Dict, jobs:List[Dict], top_n:int=5)->List[Dict]:
    employer_text=preprocess_skills(employee["skills"])
    job_text = [preprocess_skills(job.get("requirements", "").split()) for job in jobs]

    vectoriser = TfidfVectorizer()
    tfid_matrix = vectoriser.fit_transform([employer_text] + job_text)#converts to numbers for vectorisation

    similarities = cosine_similarity(tfid_matrix[0:1], tfid_matrix[1:]).flatten()
    #tfid_matrix[0:1], selects row 0 only(employee vector) and keeps it as a two dimentional array which is required by the cosine similary
    #tfid_matrix[1:] selects all rows except the first(the jobs psted by the employer) and keeps it as a two dimentional array
    #cosine_similarity(tfid_matrix[0:1], tfid_matrix[1:]).flatten(), this means we compare the employee vector(skills row0) with the job vector(row 1 to n) and returns a 1D array
    ranked_indices = np.argsort(similarities)[::-1]
    #returns the indeces of the job in the reverse ascending order, that is the biggest to smallest

    recommendations = []
    for idx in ranked_indices[:top_n]: #return the first five matches
        if jobs[idx]["id"] not in employee.get("applied_jobs", []):
            recommendations.append({
                "jobs":jobs[idx],
                "score":float(similarities[idx])
            })
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
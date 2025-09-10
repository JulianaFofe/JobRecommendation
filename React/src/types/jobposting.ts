// src/types/job.ts
export interface Job {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  requirements: string;
  salary?: number;
  location: string;
  status?: string; // "Available", "Closed", etc.
  job_type: string; // e.g. "Full-time" | "Part-time"
  posted_at: string; // ISO datetime string
}

export interface JobCreate {
  title: string;
  description: string;
  requirements: string;
  salary?: number;
  location: string;
  job_type: string;
  status?: string;
}

export interface JobUpdate {
  title?: string;
  description?: string;
  requirements?: string;
  salary?: number;
  location?: string;
  job_type?: string;
  status?: string;
}

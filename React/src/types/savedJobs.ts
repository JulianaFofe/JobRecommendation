// frontend/src/types/savedJob.ts

export type Job = {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary: string;
  status: string;
};

export type SavedJob = {
  id: number;          // the ID of the saved job record
  saved_at: string;    // timestamp when it was saved
  job: Job;            // the associated job object
};

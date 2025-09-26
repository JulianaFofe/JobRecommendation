export interface Application {
  id: number;
  name: string;
  email: string;
  contact: string;
  resume?: string; // URL to the uploaded resume
  job_id: number;
  jobTitle: string;
  applied_at: string; 
  status: string; 
  applicant_id: number;
  applicant_name: string;    
        
}

import { useEffect, useState } from "react";
import axios from "axios";

// ------------------------
// Types
// ------------------------
type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  status: string;
};

type SavedJob = {
  id: number;         // saved job record ID
  saved_at: string;   // when job was saved
  job: Job;           // the actual job object
};

// ------------------------
// Component
// ------------------------
export default function SaveJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // match Employee_Form.tsx auth method
  const token = localStorage.getItem("access_token");

  // Fetch saved jobs from backend
  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get<SavedJob[]>(
        "http://127.0.0.1:8000/saved-jobs/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedJobs(res.data);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      setMessage("Failed to fetch saved jobs");
    } finally {
      setLoading(false);
    }
  };

  // Remove a saved job
  const removeJob = async (jobId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/saved-jobs/${jobId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobs((prev) => prev.filter((sj) => sj.job.id !== jobId));
      setMessage("Job removed successfully");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error removing saved job:", err);
      setMessage("Failed to remove job");
    }
  };

  // Placeholder for applying to a job
  const applyToJob = (jobId: number) => {
    alert(`Apply to job ${jobId}`);
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) return <p>Loading saved jobs...</p>;

  return (
    <div className="h-screen flex">
      <div className="bg-white rounded-sm  w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">My Saved Jobs</h2>

        {message && (
          <div className="p-2 mb-4 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}

        {savedJobs.length === 0 ? (
          <p>No saved jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-none">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className=" px-4 py-2 text-left text-white border-none">Title</th>
                  <th className=" px-4 py-2 text-left text-white border-none">Location</th>
                  <th className=" px-4 py-2 text-left text-white border-none">Salary</th>
                  <th className=" px-4 py-2 text-left text-white border-none">Saved At</th>
                  <th className=" px-4 py-2 text-left text-white border-none">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedJobs.map((sj) => (
                  <tr key={sj.id} className="hover:bg-gray-50">
                    <td className="border-none px-4 py-2">{sj.job.title}</td>
                    <td className="border-none px-4 py-2">{sj.job.location}</td>
                    <td className="border-none px-4 py-2">{sj.job.salary} XAF</td>
                    <td className="border-none px-4 py-2">
                      {new Date(sj.saved_at).toLocaleString()}
                    </td>
                    <td className="border-none px-4 py-2 space-x-2 font-semibold">
                      <button
                        onClick={() => applyToJob(sj.job.id)}
                        className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => removeJob(sj.job.id)}
                        className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

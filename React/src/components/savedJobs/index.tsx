import { useEffect, useState } from "react";
import axios from "axios";
import type { Job } from "../../../types/jobposting";

type SavedJob = {
  id: number;         // saved job record ID
  saved_at: string;   // when job was saved
  job: Job;           // the actual job object
};

type FormDataType = {
  name: string;
  email: string;
  contact: string;
  job_id: number | null;
  resume: File | null;
};

export default function SaveJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    contact: "",
    job_id: null,
    resume: null,
  });

  const token = localStorage.getItem("access_token");

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get<SavedJob[]>(
        "http://127.0.0.1:8000/saved-jobs/",
        { headers: { Authorization: `Bearer ${token}` } }
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

  // Handle Apply click
  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setFormData((prev) => ({ ...prev, job_id: job.id }));
    setShowForm(true);
  };

  // Submit application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.job_id) return;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("contact", formData.contact);
    payload.append("job_id", String(formData.job_id));
    if (formData.resume) payload.append("resume", formData.resume);

    try {
      const res = await fetch("http://localhost:8000/applications/", {
        method: "POST",
        body: payload,
      });
      const result = await res.json();
      setShowForm(false);
      setMessage(result.message || "Application submitted!");
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage("Failed to submit application");
      setTimeout(() => setMessage(null), 5000);
    }
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
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Salary</th>
                  <th className="px-4 py-2 text-left">Saved At</th>
                  <th className="px-4 py-2 text-left">Actions</th>
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
                        onClick={() => handleApplyClick(sj.job)}
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

        {/* Apply Form Modal */}
        {showForm && selectedJob && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-8 bg-white rounded-2xl shadow-lg max-w-3xl w-full"
            >
              <h2 className="text-2xl font-bold text-primary mb-2">{selectedJob.title}</h2>

              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-3 rounded-lg w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="border p-3 rounded-lg w-full"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  className="border p-3 rounded-lg w-full"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  required
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: e.target.files?.[0] || null,
                    })
                  }
                  required
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

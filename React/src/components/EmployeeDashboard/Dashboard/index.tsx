import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import type { Job } from "../../../types/jobposting";
import axios from "axios";

type FormDataType = {
  name: string;
  email: string;
  contact: string;
  job_id: number | null;
  resume: File | null;
};

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchResults, setSearchResults] = useState<Job[] | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    contact: "",
    job_id: null,
    resume: null,
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs/public")
      .then((res) => res.json())
      .then((data: Job[]) => setJobs(data))
      .catch((err) => console.error("Error fetching public jobs:", err));
  }, []);

  const handleSearchResults = (results: Job[] | null) => {
    setSearchResults(results);
    setRecommendedJobs(null);
  };

  const handleRecommendedJobs = (jobs: Job[]) => {
    setRecommendedJobs(jobs);
    setSearchResults(null);
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setFormData((prev) => ({ ...prev, job_id: job.id }));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.job_id) {
      setMessage("Please select a job first");
      return;
    }

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

  const saveJob = async (jobId: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/saved-jobs/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Job saved successfully");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Error saving job:", err);
      if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else {
        setMessage("Failed to save job");
      }
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const displayedJobs = recommendedJobs?.length
    ? recommendedJobs
    : searchResults?.length
    ? searchResults
    : jobs;

  const getTitle = () => {
    if (recommendedJobs?.length) return "Recommended Jobs";
    if (searchResults?.length) return "Search Results";
    return "All Job Postings";
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 relative">
      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showForm ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <Navbar
          onSearchResults={handleSearchResults}
          onRecommendedJobs={handleRecommendedJobs}
        />

        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:px-12 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            {(searchResults || recommendedJobs) && (
              <button
                onClick={() => {
                  setSearchResults(null);
                  setRecommendedJobs(null);
                }}
                className="text-sm text-gray-600 hover:text-secondary underline"
              >
                Show All Jobs
              </button>
            )}
          </div>

          {message && (
            <div className="p-3 mb-4 rounded bg-green-100 text-green-800 font-semibold">
              {message}
            </div>
          )}

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {displayedJobs.map((job) => (
              <article
                key={job.id}
                className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{job.title}</h4>
                  <p className="text-sm mb-2">{job.description}</p>
                  <p className="text-sm mb-2">{job.location}</p>
                  <p className="text-sm mb-2">{job.job_type}</p>
                  <p className="font-bold text-green-600">XAF {job.salary}</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => saveJob(job.id)}
                    className="bg-secondary hover:opacity-70 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto"
                  >
                    Save
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Modal overlay */}
      {showForm && selectedJob && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bbg-gray/30 bg-opacity-30 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-8 bg-white rounded-2xl shadow-lg max-w-3xl w-full transition-transform duration-300 ease-in-out "
          >
            <h2 className="text-2xl font-bold text-primary mb-2">
              {selectedJob.title}
            </h2>
            <p className="text-gray-500 mb-4 font-semibold">{selectedJob.description}</p>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="tel"
                placeholder="Contact Number"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
              />
              <div>
                <label
                  htmlFor="resume"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Upload Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  className="border border-gray-300 p-2 rounded-lg w-full cursor-pointer text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: e.target.files?.[0] || null,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-secondary hover:opacity-80 transition text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg active:opacity-100"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

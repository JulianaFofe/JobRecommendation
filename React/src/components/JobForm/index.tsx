import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { Job, JobCreate } from "../../types/jobposting";

interface JobFormProps {
  job?: Job;               // existing job for update
  onClose?: () => void;     // called when form is closed
  onSuccess?: () => void;   // called after successful create/update
}

function JobForm({ job, onClose, onSuccess }: JobFormProps) {
  const [jobData, setJobData] = useState<JobCreate>({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements || "",
    salary: job?.salary,
    location: job?.location || "",
    status: job?.status || "Available",
    job_type: job?.job_type || "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Update state if `job` changes dynamically
  useEffect(() => {
    if (job) {
      setJobData({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        salary: job.salary,
        location: job.location,
        status: job.status,
        job_type: job.job_type,
      });
    }
  }, [job]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: name === "salary" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setToast("You must be logged in.");
        return;
      }

      const method = job ? "PUT" : "POST";
      const url = job
        ? `http://127.0.0.1:8000/jobs/update/${job.id}`
        : `http://127.0.0.1:8000/jobs/create`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (res.ok) {
        setToast(job ? "Job updated successfully!" : "Job posted successfully!");
        onSuccess?.();  // call success callback if provided
      } else {
        const errorData = await res.json();
        setToast(errorData.detail || "Failed to submit job.");
      }
    } catch (err) {
      console.error(err);
      setToast("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start" style={{ backgroundColor: "#F0FFF4" }}>
      <div className="max-w-3xl w-full p-6 mt-10 bg-white shadow rounded-md relative">
        {toast && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md animate-fade-in-out">
            {toast}
          </div>
        )}
        <button className="absolute top-4 right-4 text-gray-600 hover:text-red-500" onClick={onClose}><span>X</span></button>

        <h1 className="text-2xl font-bold mb-6 text-primary">{job ? "Update Job" : "Post Job"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block font-medium mb-1">Requirements</label>
            <textarea
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              required
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block font-medium mb-1">Salary</label>
            <input
              type="number"
              name="salary"
              value={jobData.salary ?? ""}
              onChange={handleChange}
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block font-medium mb-1">Job Type</label>
            <select
              name="job_type"
              value={jobData.job_type}
              onChange={handleChange}
              required
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={jobData.status}
              onChange={handleChange}
              className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Available">Available</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="text-white px-6 py-2 rounded-md hover:bg-green-600 bg-primary"
            >
              {loading ? "Submitting..." : job ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;

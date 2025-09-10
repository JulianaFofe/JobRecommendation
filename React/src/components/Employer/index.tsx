import { useState, useEffect } from "react";
import { Menu, User, AppWindow, Briefcase, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import m from "../../assets/images/img.png?url";
import type { Job } from "../../types/jobposting";
import React from "react";

function Employer() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeLink, setActiveLink] = useState("My Jobs");
  const [employeeName, setEmployeeName] = useState("Loading...");

  // Fetch jobs
  useEffect(() => {
    fetchJobs();
    getEmployeeName();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/jobs/read");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  // Get employee name from JWT
  const getEmployeeName = () => {
    const token = localStorage.getItem("token"); // JWT stored after login
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmployeeName(payload.name || "Employee");
    } catch (err) {
      console.error("Invalid token", err);
      setEmployeeName("Employee");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/jobs/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const goToForm = (jobId?: number) => {
    navigate(jobId ? `/jobform/${jobId}` : "/jobform");
  };

  const primaryColor = "#34A853"; // set your primary color here

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <img
            src={m}
            alt="logo"
            className="w-full object-contain mb-2"
          />
          <h1 className="text-green-500 font-bold text-xl">Employer</h1>
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { name: "Post Job", icon: <Send className="w-5 h-5" /> },
            { name: "My Jobs", icon: <Briefcase className="w-5 h-5" /> },
            { name: "Applications", icon: <AppWindow className="w-5 h-5" /> },
            { name: "Profile", icon: <User className="w-5 h-5" /> },
            { name: "Settings", icon: <Menu className="w-5 h-5" /> },
          ].map((link) => (
            <span
              key={link.name}
              onClick={() => {
                setActiveLink(link.name);
                if (link.name === "Post Job") goToForm();
              }}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                ${activeLink === link.name
                  ? "bg-yellow-100 text-green-700 font-semibold"
                  : "hover:bg-green-50 text-gray-700"
                }`}
            >
              {React.cloneElement(link.icon, { color: primaryColor })}
              {link.name}
            </span>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">
            Welcome, <span className="text-green-500">{employeeName}</span>
          </h1>
        </div>

        {/* Job Listings */}
        <div className="p-6 space-y-4 flex-1 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Job Postings</h2>

          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-md p-3 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-md">{job.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {job.location} • {job.job_type} •{" "}
                    <span
                      className={`font-bold ${
                        job.status === "Available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-700 text-sm line-clamp-2">
                    {job.description}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                    Requirements: {job.requirements}
                  </p>
                  {job.salary && (
                    <p className="text-gray-800 text-sm mt-1">
                      Salary: XAF{job.salary}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-6 ml-4">
                  <button
                    onClick={() => goToForm(job.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Employer;

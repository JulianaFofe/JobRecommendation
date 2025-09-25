/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Menu, User, AppWindow, Briefcase, Send, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import m from "../../assets/images/img.png?url";
import type { Job } from "../../types/jobposting";
import type { Application } from "../../types/application";
import { jwtDecode } from "jwt-decode";
import JobForm from "../JobForm"; // ✅ import modal form

interface JwtPayload {
  sub: string;
  role: string;
  name?: string;
}

function Employer() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeLink, setActiveLink] = useState("My Jobs");
  const [employeeName, setEmployeeName] = useState("John Doe");
  const [recommendedCandidates, setRecommendedCandidates] = useState<Record<number, any[]>>({});
  const [searchText, setSearchText] = useState("");
  const [showJobForm, setShowJobForm] = useState(false); // ✅ modal state
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Decode JWT token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    try {
      const decoded: JwtPayload = jwtDecode(token);
      setEmployeeName(decoded.name ?? "John Doe");
    } catch {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, [navigate]);

  // Reset search + fetch jobs on tab switch
  useEffect(() => {
    setSearchText("");
    fetchJobs();
  }, [activeLink]);

  const fetchJobs = async (title?: string) => {
    try {
      const token = localStorage.getItem("access_token");
      let url = "http://127.0.0.1:8000/jobs/read/all";

      if (title) {
        url += `?title=${encodeURIComponent(title)}`;
      }

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    }
  };

  // Fetch applications when "Applications" tab is active
  useEffect(() => {
    if (activeLink !== "Applications" || jobs.length === 0) return;

    const fetchAllApplications = async () => {
      const token = localStorage.getItem("access_token");
      let allApps: Application[] = [];
      await Promise.all(
        jobs.map(async (job) => {
          try {
            const res = await fetch(`http://127.0.0.1:8000/applications/job/${job.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (Array.isArray(data)) allApps = allApps.concat(data);
          } catch (err) {
            console.error(`Error fetching applications for job ${job.id}:`, err);
          }
        })
      );
      setApplications(allApps);
    };

    fetchAllApplications();
  }, [activeLink, jobs]);

  const handleOpenForm = (job?: Job) => {
    setEditingJob(job ?? null);
    setShowJobForm(true);
  };

  const handleCloseForm = () => {
    setShowJobForm(false);
    setEditingJob(null);
    fetchJobs();
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/jobs/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const handleGetRecommendedCandidates = async (jobId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://127.0.0.1:8000/recommendations/job/${jobId}/candidates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setRecommendedCandidates((prev) => ({ ...prev, [jobId]: data.candidates }));
    } catch (err) {
      console.error("Error fetching recommended candidates:", err);
    }
  };

  // Search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchJobs(searchText.trim());
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col fixed h-full">
        <div className="flex flex-col items-start mb-8">
          <img src={m} alt="logo" className="w-full object-contain mb-4" />
          <h1 className="text-green-500 font-bold text-xl">Employer</h1>
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { name: "Post Job", icon: <Send className="w-5 h-5 text-primary" /> },
            { name: "My Jobs", icon: <Briefcase className="w-5 h-5 text-primary" /> },
            { name: "Applications", icon: <AppWindow className="w-5 h-5 text-primary" /> },
            { name: "Profile", icon: <User className="w-5 h-5 text-primary" /> },
            { name: "Settings", icon: <Menu className="w-5 h-5 text-primary" /> },
          ].map((link) => (
            <span
              key={link.name}
              onClick={() => {
                setActiveLink(link.name);
                if (link.name === "Post Job") handleOpenForm();
              }}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                activeLink === link.name
                  ? "bg-yellow-100 text-primary font-semibold"
                  : "hover:bg-green-50"
              }`}
            >
              {link.icon}
              {link.name}
            </span>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-semibold">
            Welcome, <span className="text-primary">{employeeName}</span>
          </h1>

          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              placeholder="Search jobs by title..."
              className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Bell className="w-6 h-6 text-primary cursor-pointer" />
            <User className="w-6 h-6 text-primary cursor-pointer" />
          </div>
        </div>

        {/* Applications Section */}
        {activeLink === "Applications" && (
          <div className="p-6 flex-1 overflow-auto bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Applications</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs posted yet.</p>
            ) : (
              jobs
                .filter((job) =>
                  job.title.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((job) => {
                  const jobApplications = applications.filter((app) => app.job_id === job.id);
                  const isShowingRecommended =
                    recommendedCandidates[job.id] && recommendedCandidates[job.id].length > 0;

                  return (
                    <div key={job.id} className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">{job.title}</h3>

                      {/* Buttons */}
                      <div className="flex items-center gap-2 mb-3">
                        {!isShowingRecommended && jobApplications.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleGetRecommendedCandidates(job.id)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-500"
                          >
                            Get Recommended Candidates
                          </button>
                        )}
                        {isShowingRecommended && (
                          <button
                            type="button"
                            onClick={() =>
                              setRecommendedCandidates((prev) => ({ ...prev, [job.id]: [] }))
                            }
                            className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded-md hover:bg-gray-400 flex items-center gap-1"
                          >
                            ← Back to Applications
                          </button>
                        )}
                      </div>

                      {/* Recommended Candidates */}
                      {isShowingRecommended && (
                        <div className="mt-2 bg-gray-100 p-3 rounded-md">
                          <h4 className="font-semibold text-sm mb-2">Recommended Candidates</h4>
                          <ul className="space-y-2">
                            {recommendedCandidates[job.id].map((match, idx) => (
                              <li key={idx} className="bg-white shadow rounded-md p-3">
                                <span className="font-semibold">{match.candidate.name}</span>
                                <p className="text-sm text-gray-600">
                                  Skills: {match.candidate.skills.join(", ")}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Job Applications */}
                      {!isShowingRecommended &&
                        (jobApplications.length === 0 ? (
                          <p className="text-gray-500">No applications yet.</p>
                        ) : (
                          <ul className="space-y-2 mt-3">
                            {jobApplications.map((app) => (
                              <li
                                key={app.id}
                                className="bg-white shadow-md rounded-md p-3 flex flex-col gap-1"
                              >
                                <span className="font-semibold">{app.applicant_name}</span>
                                <span className="text-gray-600 text-sm">{app.email}</span>
                                <span className="text-gray-600 text-sm">{app.contact}</span>
                                <span className="text-gray-600 text-sm">
                                  Applied at: {new Date(app.applied_at).toLocaleDateString()}
                                </span>
                                <span className="text-gray-500 text-xs">Job: {app.jobTitle}</span>
                                {app.resume && (
                                  <a
                                    href={app.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline text-sm"
                                  >
                                    View Resume
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        ))}
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Job Listings */}
        {activeLink !== "Applications" && (
          <div className="p-6 flex-1 overflow-auto bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Job Postings</h2>
            <div className="space-y-4">
              {jobs
                .filter((job) =>
                  job.title.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((job) => (
                  <div
                    key={job.id}
                    className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {job.location} • {job.job_type} •{" "}
                        <span
                          className={`font-bold ${
                            job.status === "Available" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {job.status}
                        </span>{" "}
                        |{" "}
                        <span
                          className={`font-bold ${
                            job.is_approved ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {job.is_approved ? "Approved" : "Pending Approval"}
                        </span>
                      </p>
                      <p className="mt-1 text-gray-700 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex flex-col gap-4 ml-4">
                      <button
                        onClick={() => handleOpenForm(job)}
                        className="bg-primary text-white px-4 py-1 rounded-md hover:bg-green-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Blurred background */}
        <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={handleCloseForm}
        />
       <div className="relative bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg">
       <JobForm
        job={editingJob ?? undefined}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
      </div>
      </div>
      )}

    </div>
  );
}

export default Employer;

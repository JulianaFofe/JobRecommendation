/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Menu, User, AppWindow, Briefcase, Send, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import m from "../../assets/images/img.png?url";
import type { Job } from "../../types/jobposting";
import type { Application } from "../../types/application";
import { jwtDecode } from "jwt-decode";
import JobForm from "../JobForm";
import { motion } from "framer-motion";

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

function Employer() {
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeLink, setActiveLink] = useState("My Jobs");
  const [employeeName, setEmployeeName] = useState("John Doe");
  const [recommendedCandidates, setRecommendedCandidates] = useState<Record<number, any[]>>({});
  const [searchText, setSearchText] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  //const [clickedId, setClickedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ id: number; action: "approve" | "reject" } | null>(null);

  

  // Decode JWT to get employee name and id
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");
    try {
      const decode: any = jwtDecode(token);
      setEmployeeName(decode.name ?? "John Doe");
      setUserId(Number(decode.sub));
    } catch {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(`http://127.0.0.1:8000/notification/notify?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [userId]);

  // Close notification dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  // Mark notification as read
  const markAsRead = async (id: number) => {
    const token = localStorage.getItem("access_token");
    try {
      await fetch(`http://127.0.0.1:8000/notification/mark-read/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchJobs = async (title?: string) => {
    try {
      const token = localStorage.getItem("access_token");
      let url = "http://127.0.0.1:8000/jobs/read/all";
      if (title) url += `?title=${encodeURIComponent(title)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    }
  };

  useEffect(() => {
    setSearchText("");
    fetchJobs();
  }, [activeLink]);

  // Fetch applications
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

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchJobs(searchText.trim());
    }
  };

  // Approve / Reject handlers
  const handleApplicationAction = async (applicationId: number, action: "approve" | "reject") => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/notification/${applicationId}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to ${action} application`);//http://127.0.0.1:8000/notification/${applicationId}/${action}
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: action === "approve" ? "approved" : "rejected" }
            : app
        )
      );
      setFeedback({ id: applicationId, action });
      setTimeout(() => setFeedback(null), 1000); // remove after 1s
    } catch (err) {
      console.error(err);
    }
  };

  // Intersection Observer for cards animation
  const cardRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );
    cardRefs.current.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [jobs, applications]);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col fixed h-full">
        <div className="flex flex-col items-start mb-8">
          <img src={m} alt="logo" className="w-full object-contain mb-4" />
          <h1 className="text-primary font-bold text-xl">Employer</h1>
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
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition duration-200 transform hover:scale-105 ${
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

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col relative">
        {/* Navbar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-semibold">
            Welcome, <span className="text-primary">{employeeName}</span>
          </h1>
          <div className="flex items-center gap-4 relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              placeholder="Search jobs by title..."
              className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="relative" ref={notificationRef}>
              <Bell
                className="w-6 h-6 text-primary cursor-pointer transition transform hover:scale-110"
                onClick={() => setShowNotification(!showNotification)}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
              {showNotification && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-80 max-h-96 overflow-y-auto z-50 animate-fadeIn">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b cursor-pointer transition hover:bg-gray-100 ${
                          n.read ? "bg-gray-50" : "bg-white font-semibold"
                        }`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <p className="text-sm">{n.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <User className="w-6 h-6 text-primary cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-auto bg-gray-50">
          {activeLink === "Applications" ? (
            <>
              <h2 className="text-xl font-bold mb-4">Applications</h2>
              {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs posted yet.</p>
              ) : (
                jobs
                  .filter((job) =>
                    job.title.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((job, index) => {
                    const jobApplications = applications.filter(
                      (app) => app.job_id === job.id
                    );
                    const isShowingRecommended =
                      recommendedCandidates[job.id] &&
                      recommendedCandidates[job.id].length > 0;
                    return (
                      <div
                        key={job.id}
                        ref={(el) => {
                          if (el) cardRefs.current[index] = el;
                        }}
                        className="mb-6 opacity-0 transform translate-y-4 transition duration-700"
                      >
                        <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          {!isShowingRecommended && jobApplications.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleGetRecommendedCandidates(job.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-500 transition transform hover:scale-105"
                            >
                              Get Recommended Candidates
                            </button>
                          )}
                          {isShowingRecommended && (
                            <button
                              type="button"
                              onClick={() =>
                                setRecommendedCandidates((prev) => ({
                                  ...prev,
                                  [job.id]: [],
                                }))
                              }
                              className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded-md hover:bg-gray-400 flex items-center gap-1 transition transform hover:scale-105"
                            >
                              ← Back to Applications
                            </button>
                          )}
                        </div>
                        {isShowingRecommended ? (
                          <div className="mt-2 bg-gray-100 p-3 rounded-md">
                            <h4 className="font-semibold text-sm mb-2">
                              Recommended Candidates
                            </h4>
                            <ul className="space-y-2">
                              {recommendedCandidates[job.id].map((match, idx) => (
                                <li
                                  key={idx}
                                  className="bg-white shadow rounded-md p-3 transition hover:scale-[1.02]"
                                >
                                  <span className="font-semibold">
                                    {match.candidate.name}
                                  </span>
                                  <p className="text-sm text-gray-600">
                                    Skills: {match.candidate.skills.join(", ")}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : jobApplications.length === 0 ? (
                          <p className="text-gray-500">No applications yet.</p>
                        ) : (
                          <ul className="space-y-2 mt-3">
                            {jobApplications.map((app) => (
                              <li
                                key={app.id}
                                className={`bg-white shadow-md rounded-md p-3 flex flex-col gap-1 transition hover:scale-[1.01] ${
                                  app.status === "rejected"
                                    ? "opacity-50 line-through"
                                    : ""
                                }`}
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
                                {/* Approve / Reject buttons */}
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() =>
                                      handleApplicationAction(app.id, "approve")
                                    }
                                    className={`px-3 py-1 rounded transition-transform duration-200 ${
                                    feedback?.id === app.id && feedback.action === "approve"
                                   ? "bg-green-600 animate-pulse"
                                   : "bg-green-500 hover:bg-green-600"
                                   } text-white`}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleApplicationAction(app.id, "reject")
                                    }
                                    className={`px-3 py-1 rounded transition-transform duration-200 ${
                                    feedback?.id === app.id && feedback.action === "reject"
                                    ? "bg-red-600 animate-pulse"
                                    : "bg-red-500 hover:bg-red-600"
                                     } text-white`}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">Job Postings</h2>
              <div className="space-y-4">
                {jobs
                  .filter((job) =>
                    job.title.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((job, idx) => (
                    <motion.div
                      key={job.id}
                      className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
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
                        <p className="mt-1 text-gray-700 text-sm line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 ml-4">
                        <button
                          onClick={() => handleOpenForm(job)}
                          className="bg-primary text-white px-4 py-1 rounded-md hover:bg-green-600 transition-all duration-300"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-white/30 backdrop-blur-sm"
              onClick={handleCloseForm}
            />
            <div className="relative bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg animate-fadeIn">
              <JobForm
                job={editingJob ?? undefined}
                onClose={handleCloseForm}
                onSuccess={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>
        {`
        .fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {opacity:0; transform: translateY(-10px);}
          to {opacity:1; transform: translateY(0);}
        }
      `}
      </style>
    </div>
  );
}

export default Employer;

import { useState, useEffect } from "react";
import { Menu, User, AppWindow, Briefcase, Send, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import m from "../../assets/images/img.png?url";
import type { Job } from "../../types/jobposting";
import { jwtDecode } from "jwt-decode"; // consistent import

interface JwtPayload {
  sub: string; // employer ID
  role: string;
  name?: string;
}

function Employer() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeLink, setActiveLink] = useState("My Jobs");
  const [employeeName, setEmployeeName] = useState("John Doe");
  const [employerId, setEmployerId] = useState<string>("");

  // Decode JWT token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      setEmployeeName(decoded.name ?? "John Doe");
      setEmployerId(decoded.sub); // store employer ID
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch jobs for this employer
  useEffect(() => {
    if (!employerId) return;

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`http://127.0.0.1:8000/jobs/read/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      }
    };

    fetchJobs();
  }, [employerId]);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://127.0.0.1:8000/jobs/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  const goToForm = (jobId?: number) => {
    navigate(jobId ? `/jobform/${jobId}` : "/jobform");
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
            {
              name: "Post Job",
              icon: <Send className="w-5 h-5 text-primary" />,
            },
            {
              name: "My Jobs",
              icon: <Briefcase className="w-5 h-5 text-primary" />,
            },
            {
              name: "Applications",
              icon: <AppWindow className="w-5 h-5 text-primary" />,
            },
            {
              name: "Profile",
              icon: <User className="w-5 h-5 text-primary" />,
            },
            {
              name: "Settings",
              icon: <Menu className="w-5 h-5 text-primary" />,
            },
          ].map((link) => (
            <span
              key={link.name}
              onClick={() => {
                setActiveLink(link.name);
                if (link.name === "Post Job") goToForm();
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
            <Bell className="w-6 h-6 text-primary cursor-pointer" />
            <User className="w-6 h-6 text-primary cursor-pointer" />
          </div>
        </div>

        {/* Job Listings */}
        <div className="p-6 flex-1 overflow-auto bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Job Postings</h2>

          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs posted yet.</p>
            ) : (
              Array.isArray(jobs) &&
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-md rounded-md p-4 flex justify-between items-start max-h-40 overflow-hidden"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
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
                    <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                      Requirements: {job.requirements}
                    </p>
                    {job.salary && (
                      <p className="text-gray-800 text-sm mt-1">
                        Salary: XAF{job.salary}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => goToForm(job.id)}
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employer;

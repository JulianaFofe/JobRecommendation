import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../dashboardView/sidebar";
import { Menu, X } from "lucide-react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    size?: "default" | "sm" | "lg" | "icon";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        className || ""
      }`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

type Job = {
  id: number;
  salary: number;
  title: string;
  location: string;
  description: string;
  is_approved: boolean;
  created_at: string;
};

function Jobstate() {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch all jobs (admin view)
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/admin/jobs/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setJobs(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching pending jobs:", err);
        setJobs([]); // fallback
      });
  }, []);

  const approveJob = async (jobId: number) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found. Please log in again.");
        return;
      }

      const res = await axios.put(
        `http://127.0.0.1:8000/admin/jobs/approve/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === jobId ? res.data : job))
      );
    } catch (err) {
      console.error("Error approving job:", err);
    }
  };

  const rejectJob = async (jobId: number) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found. Please log in again.");
        return;
      }

      await axios.put(
        `http://127.0.0.1:8000/admin/jobs/reject/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs((prev) => prev.filter((u) => u.id !== jobId));
    } catch (err) {
      console.error("Error approving job:", err);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      <div className="flex h-screen">
        {/* Sidebar (fixed width) */}
        <Sidebar sidebarOpen={sidebarOpen} />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <button
              className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {jobs.map((job) => (
            <div
              key={job.id}
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md shadow-slate-200 p-4 sm:p-7 rounded mb-4"
            >
              <div>
                <h1 className="font-semibold">{job.title}</h1>
                <p className="text-sm text-gray-600">{job.description}</p>
                <p className="text-sm text-gray-600">{job.location}</p>
                <p className="text-sm text-gray-600">{job.salary}</p>
                <span
                  className={`${
                    job.is_approved ? "text-green-600" : "text-yellow-600"
                  } font-medium`}
                >
                  {job.is_approved ? "Approved" : "Pending"}
                </span>
                <p className="text-xs text-gray-500">{job.created_at}</p>
              </div>
              <div className="flex gap-3">
                {!job.is_approved && (
                  <button
                    onClick={() => approveJob(job.id)}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                )}
                {!job.is_approved && (
                  <button
                    onClick={() => rejectJob(job.id)}
                    className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jobstate;

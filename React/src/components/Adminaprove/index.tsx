import React from "react";
import Navbar from "../../containers/navbar";
import {
  TrendingUp,
  Plus,
  Calendar,
  Briefcase,
  User,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

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
  title: string;
  company_name: string;
  is_approved: boolean;
  created_at: string;
};

function Jobstate() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const token = localStorage.getItem("access_token");

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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex gap-10">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/70 backdrop-blur-sm shadow-lg"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div>
        {/* Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 
          w-64 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg 
          m-2 lg:m-4 mr-0 transition-transform duration-300 ease-in-out
        `}
        >
          <div className="p-4 lg:p-6">
            <div className="flex flex-col items-center gap-1 mb-6 lg:mb-8">
              <a href="/jobstate">
                <img
                  src="WhatsApp_Image_2025-09-03_at_12.18.10-removebg-preview.png"
                  alt="SmartHire Logo"
                  className="w-32 lg:w-45 h-auto object-cover"
                />
              </a>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Admin Portal
              </p>
            </div>

            <nav className="space-y-2">
              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3">
                MAIN MENU
              </div>

              <a
                href="dashview"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Dashboard Overview</span>
              </a>
              <a
                href="/jobmanagement"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base"
              >
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Job Management</span>
              </a>
              <a
                href="management"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base"
              >
                <User className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">User Management</span>
              </a>
              <a
                href="/feedadmins"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Feedback Management</span>
              </a>

              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3 mt-6">
                QUICK ACTIONS
              </div>
              <a
                href="/jobstate"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <Plus className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Approve Jobs</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <Calendar className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Schedule Report</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-h-139 overflow-y-auto pr-2 w-full mt-10 mb-10">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md shadow-slate-400 ml-4 sm:ml-7 p-4 sm:p-7 rounded mt-4"
          >
            <div>
              <h1 className="font-semibold">{job.title}</h1>
              <p className="text-sm text-gray-600">{job.company_name}</p>
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
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobstate;

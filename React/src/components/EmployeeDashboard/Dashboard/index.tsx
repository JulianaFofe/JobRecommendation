import { useState, useEffect } from "react";
import axios from "axios";
import SidebarWrapper from "../hamburger";
import Navbar from "../Navbar";
import type { SidebarItem } from "../../../types/sidebar";
import {
  Home,
  FileText,
  Users,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  description: string;
  salary: string;
  status: string;
  location: string;
  company_name?: string;
  job_type?: string; // Added optional job_type
};

type JobCard = {
  id: number;
  title: string;
  ctaText: string;
  description: string;
  company?: string;
  location: string;
  salary: string;
  status: string;
};

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
  const [cards, setCards] = useState<JobCard[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    contact: "",
    job_id: null,
    resume: null,
  });

  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/", icon: LogOut },
  ];

  // Fetch public jobs
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/jobs/public")
      .then((res) => {
        const jobs = Array.isArray(res.data) ? res.data : [];
        setCards(
          jobs.map((job) => ({
            id: job.id,
            title: job.title,
            ctaText: "Apply",
            description: job.description,
            company: job.company_name,
            location: job.location,
            salary: job.salary,
            status: job.status,
          }))
        );
      })
      .catch((err) => {
        console.error("Error fetching public jobs:", err);
      });
  }, []);

  // Fetch all public jobs initially
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/jobs/public")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching public jobs:", err));
  }, []);

  const displayedJobs =
    recommendedJobs !== null
      ? recommendedJobs
      : searchResults !== null
      ? searchResults
      : jobs;

  const getTitle = () => {
    if (recommendedJobs !== null) return "Recommended Jobs";
    if (searchResults !== null) return "Search Results";
    return "All Job Postings";
  };

  // Add handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.job_id || !formData.resume) {
      setMessage("Please select a job and upload your resume.");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("contact", formData.contact);
    data.append("job_id", String(formData.job_id));
    data.append("resume", formData.resume);

    try {
      await axios.post("http://127.0.0.1:8000/apply", data);
      setMessage("Application submitted successfully!");
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        contact: "",
        job_id: null,
        resume: null,
      });
    } catch (error) {
      setMessage("Failed to submit application.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SidebarWrapper items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Navbar
          onSearchResults={setSearchResults}
          onRecommendedJobs={setRecommendedJobs}
        />
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:px-12 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            {(searchResults !== null || recommendedJobs !== null) && (
              <button
                onClick={() => {
                  setSearchResults(null);
                  setRecommendedJobs(null);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Show All Jobs
              </button>
            )}
          </div>

          <h2 className="text-xl font-bold mb-6 sm:mb-9">Job Searching</h2>

          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
            {message && (
              <div className="p-3 mb-4 rounded bg-green-100 text-green-800 font-semibold">
                {message}
              </div>
            )}

            {!showForm ? (
              displayedJobs.length > 0 ? (
                displayedJobs.map((job) => (
                  <article
                    key={job.id}
                    className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{job.title}</h4>
                      <p className="text-sm mb-2">{job.description}</p>
                      <p className="text-sm mb-2">{job.location}</p>
                      <p className="text-sm mb-2">{job.job_type}</p>
                      <p className="font-bold text-green-600">
                        XAF {job.salary}
                      </p>
                    </div>
                    <button
                      className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto"
                      onClick={() => {
                        setJob(job);
                        setFormData((prev) => ({
                          ...prev,
                          job_id: job.id,
                        }));
                        setShowForm(true);
                        setMessage(null);
                      }}
                    >
                      Apply
                    </button>
                  </article>
                ))
              ) : (
                <div>No jobs found.</div>
              )
            ) : (
              <div>
                {job && (
                  <>
                    <h2 className="text-xl">{job.title}</h2>
                    <p className="mb-3">{job.description}</p>
                  </>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-2 rounded justify-center shadow-slate-900 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] p-5 w-100 ml-80 mb-15 h-90 mr-10 h-100"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      className="border p-2 rounded ml-12"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="border p-2 rounded ml-12"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Contact"
                      className="border p-2 rounded ml-12"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className="block font-medium mb-1 ml-12 "
                    >
                      Resume
                    </label>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      className="border p-2 rounded-lg bg-green-500 text-white-600 text-center hover:bg-yellow-500 cursor-pointer w-60 ml-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, resume: file });
                      }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-6 bg-green-600 text-white rounded-md px-3 cursor-pointer hover:bg-yellow-500"
                  >
                    Submit Application
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-400 hover:bg-yellow-500 text-white rounded-md px-3 ml-4 cursor-pointer w-39"
                  >
                    Close
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

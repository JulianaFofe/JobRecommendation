/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import type { JobCard } from "../../../types/jobcard";
import type { SidebarItem } from "../../../types/sidebar";
import SidebarWrapper from "../hamburger";
import {
  Home,
  FileText,
  Users,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import Navbar from "../Navbar";

type Job = {
  id: number;
  title: string;
  description: string;
  salary: string;
  status: string;
  location: string;
};

type FormDataType = {
  name: string;
  email: string;
  contact: string;
  job_id: number | null;
  resume: File | null;
};

export default function Dashboard() {
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

  // ---------------------------
  // Submit application
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.job_id) {
      setMessage("Please select a job first");
      return;
    }

    const payload = {
      ...formData,
    };

    try {
      const res = await fetch(`http://localhost:8000/applications/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setShowForm(false);
      setMessage(result.message || "Application submitted!");
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage("Failed to submit application");
    }
  };

  // ---------------------------
  // Fetch public jobs
  // ---------------------------
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SidebarWrapper items={sidebarItems} />
      <section className="flex-1 flex flex-col">
        <Navbar />

        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:px-12">
          <h2 className="text-xl font-bold mb-6 sm:mb-9">Job Searching</h2>

          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 ">
            {message && (
              <div className="p-3 mb-4 rounded bg-green-100 text-green-800 font-semibold">
                {message}
              </div>
            )}

            {!showForm ? (
              cards.map((c) => (
                <article
                  key={c.id}
                  className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{c.title}</h4>
                    <p className="font-sm mb-2">{c.description}</p>
                    <p className="font-sm mb-2">{c.salary}</p>
                    <p className="font-sm mb-2">{c.location}</p>
                    <p className="font-bold mb-2 text-green-600 hover:text-yellow-300 cursor-pointer">
                      {c.status}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Use job info from cards directly
                      setJob({
                        id: Number(c.id),
                        title: c.title,
                        description: c.description,
                        salary: c.salary,
                        status: c.status,
                        location: c.location,
                      });
                      setFormData((prev) => ({
                        ...prev,
                        job_id: Number(c.id),
                      }));
                      setShowForm(true);
                    }}
                    className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto"
                  >
                    {c.ctaText}
                  </button>
                </article>
              ))
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
                      id="Resume"
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
                    className="bg-gray-400 hover:bg-yellow-500 text-white rounded-md px-3 ml-4 cursor-pointer w-39 bg-green-600"
                  >
                    Close
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
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
};

export default function Dashboard() {
  const [cards, setCards] = useState<JobCard[]>([]);

  const [job, setJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: "",
    contact: "",
  });

  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/", icon: LogOut },
  ];

  const fetchJobDetails = async (
    jobId: string,
    salary: string,
    location: string,
    status: string
  ) => {
    const res = await fetch(`http://localhost:8000/jobs/${jobId}`);
    const Data = await res.json();
    setJob(Data);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/jobs/${job?.id}/apply`, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    alert(result.message);
    setShowForm(false);
  };

  // Fetch approved jobs for employees
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/jobs/public")
      .then((res) => {
        const jobs = Array.isArray(res.data) ? res.data : [];
        // Map backend jobs to JobCard format
        setCards(
          jobs.map((job: any) => ({
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
            {!showForm ? (
              cards.map((c) => (
                <article
                  key={c.id}
                  className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1  ">
                    <h4 className="font-semibold mb-2">{c.title}</h4>
                    <p className="font-sm mb-2">{c.description}</p>
                    <p className="font-sm mb-2">{c.salary}</p>
                    <p className="font-sm mb-2">{c.location}</p>
                    <p className="font-bold mb-2 text-green-600 hover:text-yellow-300 cursor-pointer">
                      {c.status}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      fetchJobDetails(
                        c.description,
                        c.salary,
                        c.location,
                        c.status
                      )
                    }
                    className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto"
                  >
                    {c.ctaText}
                  </button>
                </article>
              ))
            ) : (
              <div className="">
                {job && (
                  <>
                    <h2 className="text-xl">{job.title}</h2>
                    <p className="mb-3">{job.description}</p>
                  </>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-2 rounded justify-center shadow-slate-900 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] p-5 w-100  ml-80 mb-15 h-90 mr-10 h-100"
                >
                  {" "}
                  <div className="">
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
                  <br />
                  <div className="">
                    <input
                      type="email"
                      placeholder="Email"
                      className="border p-2 rounded ml-12 "
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <br />
                  <div className="">
                    <input
                      type="tel"
                      placeholder="contact"
                      className="border p-2 rounded ml-12 "
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      required
                    />
                  </div>
                  <br />
                  <div className="">
                    <input
                      type="file"
                      accept="pdf,doc,docx"
                      placeholder=" upload Resume"
                      className="border p-2 rounded-lg bg-green-500 text-white-600 text-center hover:bg-yellow-500 cursor-pointer  w-60 ml-10"
                      value={formData.resume}
                      onChange={(e) =>
                        setFormData({ ...formData, resume: e.target.value })
                      }
                      required
                    />
                  </div>
                  <br />
                  <button
                    onClick={() => console.log("Application submitted")}
                    type="submit"
                    className="mt-6  bg-green-600 text-white rounded-md px-3 cursor-pointer hover:bg-yellow-500"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className=" bg-gray-400 hover:bg-yellow-500 text-white rounded-md px-3 ml-4 bg-green-600 cursor-pointer w-39"
                  >
                    close
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

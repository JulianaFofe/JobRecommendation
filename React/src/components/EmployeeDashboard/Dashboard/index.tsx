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

export default function Dashboard() {
  const [cards, setCards] = useState<JobCard[]>([]);

  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/", icon: LogOut },
  ];

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
            ctaText: "Apply", // or whatever CTA you want
            company: job.company_name,
            location: job.location,
            salary: job.salary,
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
          {/* Filters and recommendations remain the same */}

          <div className="space-y-4">
            {cards.map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{c.title}</h4>
                  {/* Optional description or placeholder bars */}
                </div>
                <button className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto">
                  {c.ctaText}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

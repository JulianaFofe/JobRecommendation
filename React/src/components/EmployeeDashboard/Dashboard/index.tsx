import { useState, useEffect } from "react";
import axios from "axios";
import SidebarWrapper from "../hamburger";
import Navbar from "../Navbar";
import type { SidebarItem } from "../../../types/sidebar";
import type { Job } from "../../../types/jobposting";
import {
  Home,
  FileText,
  Users,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchResults, setSearchResults] = useState<Job[] | null>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<Job[] | null>(null) // added recommended jobs state

  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/", icon: LogOut },
  ]

  // Fetch all public jobs initially
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/jobs/public")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching public jobs:", err))
  }, [])

  const displayedJobs = recommendedJobs !== null ? recommendedJobs : searchResults !== null ? searchResults : jobs

  const getTitle = () => {
    if (recommendedJobs !== null) return "Recommended Jobs"
    if (searchResults !== null) return "Search Results"
    return "All Job Postings"
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SidebarWrapper items={sidebarItems} />
      <div className="flex-1 flex flex-col">
        <Navbar
          onSearchResults={setSearchResults}
          onRecommendedJobs={setRecommendedJobs} // pass recommended jobs handler
        />
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:px-12 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-bold">
              {getTitle()} {/* dynamic title */}
            </h2>
            {(searchResults !== null || recommendedJobs !== null) && (
              <button
                onClick={() => {
                  setSearchResults(null)
                  setRecommendedJobs(null)
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Show All Jobs
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {displayedJobs.length > 0 ? (
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
                    <p className="font-bold text-green-600">XAF {job.salary}</p>
                  </div>
                  <button className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-full w-full sm:w-auto">
                    Apply
                  </button>
                </article>
              ))
            ) : (
              <p className="text-gray-500">No jobs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

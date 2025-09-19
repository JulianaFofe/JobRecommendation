import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, UserCircle } from "lucide-react";
import type { Job } from "../../../types/jobposting";

type Props = {
  onToggleSidebar?: () => void;
};

export default function Navbar({ onToggleSidebar }: Props) {
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setJobs([]);
      setShowDropdown(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const params = new URLSearchParams();
      params.append("title", query.trim());

      const res = await fetch(
        `http://127.0.0.1:8000/users/employee_search?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.statusText}`);
      const data: Job[] = await res.json();

      // Only show jobs that contain the search string (case-insensitive)
      const filtered = data.filter((job) =>
        job.title.toLowerCase().includes(query.trim().toLowerCase())
      );

      setJobs(filtered);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 shadow-md rounded-lg px-4 py-4 lg:px-10 backdrop-blur">
      {/* Left: Hamburger */}
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-primary hover:bg-gray-100 lg:hidden"

      {/* Search bar */}
      <div className="relative w-full max-w-md mx-4" ref={dropdownRef}>
        <div className="flex items-center border border-primary rounded-md px-4 py-2 bg-white shadow-sm">
          <Search className="w-5 h-5 text-primary" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(q)}
            placeholder="Search jobs by title..."
            className="ml-2 w-full outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {showDropdown && jobs.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-md mt-1 max-h-64 overflow-auto z-50">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="px-4 py-3 hover:bg-green-50 transition cursor-pointer"
              >
                <Link
                  to={`/job/${job.id}`}
                  onClick={() => setShowDropdown(false)}
                  className="flex flex-col text-gray-800"
                >
                  <span className="font-semibold">{job.title}</span>
                  <span className="text-gray-500 text-sm">
                    {job.location} — {job.job_type}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {showDropdown && jobs.length === 0 && (
          <div className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-md mt-1 px-4 py-2 text-gray-500 text-sm">
            No jobs found for "{q}".
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="p-2 rounded-full bg-primary text-white cursor-pointer">
        <Link to="/profile">
          <UserCircle className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}

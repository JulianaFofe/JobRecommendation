"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, UserCircle, ChevronDown, Star } from "lucide-react"
import type { Job } from "../../../types/jobposting"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

type Props = {
  onToggleSidebar?: () => void
  onSearchResults: (results: Job[] | null) => void
  onRecommendedJobs: (jobs: Job[]) => void
}

interface JwtPayload {
  sub: string;
  role: string;
  name?: string;
}

export default function Navbar({ onToggleSidebar, onSearchResults, onRecommendedJobs }: Props) {
  const [q, setQ] = useState("")
  const [filter, setFilter] = useState("all") 
  const [jobs, setJobs] = useState<Job[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false)
  const [employeeName, setEmployeeName] = useState("John Doe");
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();

  const filterOptions = [
    { label: "All", value: "all" }, 
    { label: "Title", value: "title" },
    { label: "Location", value: "location" },
    { label: "Job Type", value: "job_type" },
    { label: "Minimum Salary", value: "salary_min" },
  ]

  useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
  
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setEmployeeName(decoded.name ?? "John Doe");
      } catch {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    }, [navigate]);


  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setJobs([])
      setShowDropdown(false)
      onSearchResults(null)
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      if (!token) throw new Error("No access token found")

      let url = ""
      const params = new URLSearchParams()

      if (filter === "all") {
        url = "http://127.0.0.1:8000/jobs/public"
      } else {
        params.append(filter, query.trim())
        url = `http://127.0.0.1:8000/users/search?${params.toString()}`
      }

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.statusText}`)
      let data: Job[] = await res.json()

      if (filter === "all" && query.trim()) {
        data = data.filter(
          (job) =>
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.description.toLowerCase().includes(query.toLowerCase()) ||
            job.location.toLowerCase().includes(query.toLowerCase()) ||
            job.job_type.toLowerCase().includes(query.toLowerCase()),
        )
      }

      setJobs(data)
      setShowDropdown(true)
      onSearchResults(data) 
    } catch (err) {
      console.error(err)
      setJobs([])
      setShowDropdown(false)
      onSearchResults([]) 
    }
  }

  const handleGetRecommendedJobs = async () => {
    setIsLoadingRecommended(true)
    try {
      const token = localStorage.getItem("access_token")
      if (!token) throw new Error("No access token found")

      const res = await fetch("http://127.0.0.1:8000/recommendations/employees_recommendations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch recommendations")
      const data = await res.json()
      onRecommendedJobs(data.recommendations || [])
    } catch (err) {
      console.error("Error fetching recommended jobs:", err)
      onRecommendedJobs([])
    } finally {
      setIsLoadingRecommended(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-4 py-4 lg:px-10 backdrop-blur">

      <h1 className="text-lg font-semibold">
            Welcome, <span className="text-primary">{employeeName}</span>
      </h1>

      {/* Sidebar toggle */}
      <button onClick={onToggleSidebar} className="p-2 rounded-md text-primary hover:bg-gray-100 lg:hidden" />

      {/* Search bar + filter */}
      <div className="relative w-full max-w-md mx-4 flex items-center gap-2" ref={dropdownRef}>
        {/* Filter dropdown */}
        <div className="relative">
            <button
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              className="flex items-center border border-primary rounded-md px-3 py-2 bg-white shadow-sm text-sm text-gray-700 min-w-[130px]"
            >
              {filterOptions.find((f) => f.value === filter)?.label}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

          {showFilterDropdown && (
              <ul className="absolute left-0 mt-1 min-w-[130px] bg-white border border-gray-200 shadow-lg rounded-md z-50">
              {filterOptions.map((option) => (
                <li
                  key={option.value}
                  className="px-3 py-2 hover:bg-green-50 cursor-pointer text-sm text-gray-700"
                  onClick={() => {
                    setFilter(option.value)
                    setShowFilterDropdown(false)
                    if (q.trim()) {
                      handleSearch(q)
                    }
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search input */}
        <div className="flex-1 relative">
          <div className="flex items-center border border-primary rounded-md px-4 py-2 bg-white shadow-sm">
            <Search className="w-5 h-5 text-primary" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(q)}
              placeholder={`Search by ${filterOptions.find((f) => f.value === filter)?.label.toLowerCase()}...`}
              className="ml-2 w-full outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {showDropdown && jobs.length === 0 && (
            <div className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-md mt-1 px-4 py-2 text-gray-500 text-sm">
              No jobs found for "{q}".
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleGetRecommendedJobs}
          disabled={isLoadingRecommended}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Star className="w-4 h-4" />
          {isLoadingRecommended ? "Loading..." : "Get Recommended"}
        </button>

        {/* Profile */}
        <div className="p-2 rounded-full bg-primary text-white cursor-pointer">
          <Link to="/profile">
            <UserCircle className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}
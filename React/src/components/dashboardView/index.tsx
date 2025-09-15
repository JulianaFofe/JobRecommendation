/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, FileText, Clock, Award, Plus, Calendar, Briefcase, User, ShieldCheck, Menu, X } from "lucide-react"
import axios from "axios"

// ----- Card Components -----

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg bg-white/70 backdrop-blur-sm text-card-foreground shadow-lg ${className || ""}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className || ""}`} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />,
)
CardContent.displayName = "CardContent"

// ----- Button Component -----

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ""}`} ref={ref} {...props} />
  )
})
Button.displayName = "Button"

// ----- Chart Data -----

const platformActivityData = [
  { month: "Jan", jobPosting: 120, applications: 180 },
  { month: "Feb", jobPosting: 150, applications: 220 },
  { month: "Mar", jobPosting: 180, applications: 280 },
  { month: "Apr", jobPosting: 160, applications: 240 },
  { month: "May", jobPosting: 200, applications: 320 },
  { month: "Jun", jobPosting: 240, applications: 380 },
]

const jobCategoriesData = [
  { name: "Technology", value: 45, color: "#10b981" },
  { name: "Healthcare", value: 25, color: "#6ee7b7" },
  { name: "Finance", value: 20, color: "#34d399" },
  { name: "Education", value: 10, color: "#a7f3d0" },
]

// ----- Dashboard Component -----

function DashView() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({ total_jobs: 0, total_users: 0, total_applications: 0 })
  const [selectedData, setSelectedData] = useState<unknown[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"job" | "user" | "none">("job");
  const [filteredData, setFilteredData] = useState<unknown[]>([]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        console.error("No access token found. User not logged in.")
        return
      }

      const response = await axios.get("http://localhost:8000/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  fetchStats()
  }, [])
  
  const handleSearch = () => {
  if (!searchQuery.trim()) {
    setFilteredData(selectedData); // reset if empty search
    setModalTitle(modalTitle); // keep original title
    return;
  }

  const query = searchQuery.toLowerCase();

  const filtered = selectedData.filter((item: any) => {
    if (searchType === "user") {
      return item.username?.toLowerCase().includes(query);
    } else if (searchType === "job") {
      return item.title?.toLowerCase().includes(query);
    }
    return false;
  });

  setFilteredData(filtered);
  setModalTitle(`Search results for "${searchQuery}"`);
};

  const handleCardClick = async (endpoint: string, title: string) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    setLoading(true);

    const res = await axios.get(`http://localhost:8000${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data || [];
    setSelectedData(data);
    setFilteredData(data); // initialize filtered data for search
    setModalTitle(title);
    setShowModal(true);

    // Determine search type based on the card clicked
    if (title === "Active Users") setSearchType("user");
    else if (title === "Total Applications") setSearchType("none"); // no search for applications
    else setSearchType("job"); // default to job search

    setSearchQuery(""); // reset search input

  } catch (err) {
    console.error("Error fetching data", err);
  } finally {
    setLoading(false);
  }
};

  const closeModal = () => {
    setShowModal(false)
    setSelectedData([])    
    setModalTitle("") 
    setSearchQuery("")
    setSearchType("job");
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/70 backdrop-blur-sm shadow-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex">
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
              <a href="/"><img
                src="WhatsApp_Image_2025-09-03_at_12.18.10-removebg-preview.png"
                alt="SmartHire Logo"
                className="w-32 lg:w-45 h-auto object-cover"
              /></a>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">Admin Portal</p>
            </div>

            <nav className="space-y-2">
              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3">MAIN MENU</div>

              <a
                href="dashview"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Dashboard Overview</span>
              </a>
              <a
                href="#"
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

              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3 mt-6">
                QUICK ACTIONS
              </div>
              <a
                href="#"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <Plus className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Add New Job</span>
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

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 lg:ml-0">
          <div className="mb-6 lg:mb-8 mt-12 lg:mt-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm lg:text-base text-gray-600">Manage your SmartHire platform with ease</p>
          </div>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 lg:mb-8">
            {[
              { title: "Total Jobs Posted", value: stats.total_jobs, growth: "+3%", icon: Briefcase, endpoint: "/admin/jobs" },
              { title: "Active Users", value: stats.total_users, growth: "+4%", icon: User, endpoint: "/admin/users" },
              { title: "Total Applications", value: stats.total_applications, growth: "+3%", icon: FileText, endpoint: "/admin/applications" },
            ].map(({ title, value, growth, icon: Icon, endpoint }, idx) => (
              <Card
                key={idx}
                onClick={() => handleCardClick(endpoint, title)}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:bg-white/80"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6 lg:p-6">
                  <CardTitle className="text-xl md:text-lg lg:text-2xl font-light text-black">{title}</CardTitle>
                  <div className="w-14 h-14 md:w-12 md:h-12 lg:w-15 lg:h-15 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 md:w-6 md:h-6 lg:w-8 lg:h-8 text-black" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 lg:p-6 pt-0">
                  <div className="text-3xl md:text-xl lg:text-2xl font-bold text-primary">{value}</div>
                  <div className="flex items-center text-base md:text-sm lg:text-md text-primary">
                    <TrendingUp className="w-4 h-4 lg:w-4 lg:h-4 mr-1" />
                    {growth} <p className="text-black font-thin ml-2 lg:ml-4 hidden sm:inline">from last month</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
              <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-primary">{modalTitle || "Search Jobs"}</h2>
                  <button
                    onClick={closeModal}
                    className="hover:text-red-500 font-bold text-4xl"
                  >
                    &times;
                  </button>
                </div>

                {/* 🔍 Search Bar */}
                {searchType !== "none" && (
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder={
                        searchType === "user"
                          ? "Search user by username..."
                          : "Search job by title..."
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                    >
                      Search
                    </button>
                  </div>
                )}

                {/* Results */}
                {loading ? (
                  <div className="text-center py-10 text-gray-500 animate-pulse">
                    Loading...
                  </div>
                ) : filteredData.length > 0 ? (
                  <div className="space-y-4">
                    {filteredData.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                      >
                        {/* Display fields */}
                        {Object.entries(item).map(([key, value], i) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-semibold text-gray-700 capitalize">{key}</span>
                            <span className="text-gray-900">{String(value)}</span>
                          </div>
                        ))}

                        {/* 🗑️ Delete button for users */}
                        {searchType === "user" && item.id && (
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="px-4 py-2 rounded-lg shadow-md bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 transition-all duration-200"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("access_token")
                                  if (!token) return

                                  await axios.delete(
                                    `http://localhost:8000/admin/users/${item.id}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  )

                                  // remove from UI
                                  const updated = filteredData.filter((u: any) => u.id !== item.id)
                                  setFilteredData(updated)
                                  setSelectedData(updated)

                                } catch (err) {
                                  console.error("Failed to delete user", err)
                                  alert("Error deleting user")
                                }
                              }}
                            >
                              {/* Use lucide-react Trash2 icon for professional look */}
                              <span className="text-lg"></span> Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">No data available.</div>
                )}


              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Line Chart */}
            <Card className="xl:col-span-2 hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-lg lg:text-2xl font-semibold text-primary">Platform Activity</CardTitle>
                <p className="text-sm lg:text-md text-black font-thin">Job posting and application over time</p>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={platformActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#666" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#666" }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="jobPosting" stroke="#34A853" strokeWidth={2} />
                      <Line type="monotone" dataKey="applications" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:bg-white/80">
              <CardHeader className="p-4 lg:p-6">
                <CardTitle className="text-lg lg:text-2xl font-semibold text-primary">Job Categories</CardTitle>
                <p className="text-sm lg:text-md text-black font-thin">Distribution by Industry</p>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobCategoriesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {jobCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {jobCategoriesData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs lg:text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Success Rate", value: "80%", growth: "+3%", icon: ShieldCheck },
              { title: "Avg time to Hire", value: "60%", growth: "+4%", icon: Clock },
              { title: "Top Performer", value: "90%", growth: "+4%", icon: Award },
            ].map(({ title, value, growth, icon: Icon }, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:bg-white/80">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6 lg:p-6">
                  <CardTitle className="text-xl md:text-lg lg:text-2xl text-black">{title}</CardTitle>
                  <div className="w-14 h-14 md:w-12 md:h-12 lg:w-15 lg:h-15 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon className="w-7 h-7 md:w-6 md:h-6 lg:w-8 lg:h-8 text-black" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 lg:p-6 pt-0">
                  <div className="text-3xl md:text-xl lg:text-2xl font-bold text-primary">{value}</div>
                  <div className="flex items-center text-base md:text-sm lg:text-md text-primary">
                    <TrendingUp className="w-4 h-4 lg:w-4 lg:h-4 mr-1" />
                    {growth} <p className="text-black font-thin ml-2 lg:ml-4 hidden sm:inline">from last month</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashView

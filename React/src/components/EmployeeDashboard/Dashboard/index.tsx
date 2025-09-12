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

type Props = { cards: JobCard[] };

export default function Dashboard({ cards }: Props) {
  // sidebar data (mapped in Sidebar)
  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/employeedash", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/logout", icon: LogOut },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarWrapper items={sidebarItems} />

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        <Navbar />

        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:px-12">
          {/* Title */}
          <h2 className="text-xl font-bold mb-6 sm:mb-9">Job Searching</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 sm:gap-6 mb-8">
            {["Industry", "Salary Range", "Location", "Requirements"].map(
              (label) => (
                <button
                  key={label}
                  className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 w-full sm:w-auto"
                >
                  {label} <ChevronDown className="w-4 h-4 text-secondary" />
                </button>
              )
            )}
          </div>

          {/* Recommendations header */}
          <div className="bg-white rounded-md shadow flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 py-3 mb-6">
            <h3 className="font-semibold">Recommendations</h3>
            <button className="bg-secondary hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md w-full sm:w-auto">
              Search
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {cards.map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-md shadow px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* Card content */}
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{c.title}</h4>
                  {/* simple grey bars like in the mock */}
                  <div className="space-y-2">
                    <div className="h-3 w-40 sm:w-56 bg-gray-200 rounded" />
                    <div className="flex gap-2">
                      <div className="h-3 w-24 sm:w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-24 sm:w-40 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* CTA button */}
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

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
    <div className="flex flex-col lg:flex-row  min-h-screen lg:justify-between bg-gray-50">
      <SidebarWrapper items={sidebarItems} />
      <section className="flex-1 flex flex-col ">
        <Navbar />
        <div className=" mx-auto p-6 px-20">
          {/* Title */}
          <h2 className="text-xl font-bold mb-9">Job Posting</h2>

          {/* Filters */}
          <div className=" flex-col sm:flex-row flex-1 flex flex-wrap gap-20 space-x-15 mb-15 ">
            {["Industry", "Salary Range", "Location"].map((label) => (
              <button
                key={label}
                className=" flex justify-betwee items-center cursor-pointer gap-2 bg-white border border-white rounded-md px-30 py-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:bg-white/80"
              >
                {label} <ChevronDown className="w-4 h-4  text-secondary" />
              </button>
            ))}
          </div>

          {/* Recommendations header */}
          <div className="bg-white rounded-md shadow flex items-center justify-between px-4 py-3 mb-4">
            <h3 className="font-semibold">Recommendations</h3>
            <button className="bg-secondary hover:bg-yellow-500 text-white font-semibold px-20 py-2 rounded-md">
              Search
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-4 ">
            {cards.map((c) => (
              <article
                key={c.id}
                className="bg-white md:flex-col-1 md:px-2 rounded-md shadow px-4 py-4 flex  items-center justify-between"
              >
                <div className="pr-3">
                  <h4 className="font-semibold mb-1">{c.title}</h4>
                  {/* simple grey bars like in the mock */}
                  <div className="space-y-25">
                    <div className="h-3 w-56 bg-gray-200 rounded" />
                    <div className="flex gap-3">
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-40 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
                <button className="bg-primary hover:bg-green-500 cursor-pointer text-white font-semibold px-20 py-4 rounded-full">
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

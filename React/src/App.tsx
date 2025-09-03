import Sidebar from "./components/EmployeeDashboard/Sidebar";
import Navbar from "./components/EmployeeDashboard/Navbar";
import Dashboard from "./components//EmployeeDashboard/Dashboard";

import type { SidebarItem } from "./types/sidebar";
import type { JobCard } from "./types/jobcard";

import {
  Home,
  FileText,
  Users,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

function App() {
  // sidebar data (mapped in Sidebar)
  const sidebarItems: SidebarItem[] = [
    { id: "home", title: "Home", path: "/", icon: Home },
    { id: "review", title: "Review Jobs", path: "/review", icon: FileText },
    { id: "applicants", title: "Applicants", path: "/applicants", icon: Users },
    { id: "profile", title: "Profile", path: "/profile", icon: UserCircle },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "logout", title: "Logout", path: "/logout", icon: LogOut },
  ];

  // top mini tabs (mapped in Navbar)
  // const tabs: NavbarTab[] = [
  //   { id: "s1", label: "Section 1" },
  //   { id: "s2", label: "Section 2" },
  // ];

  // job cards (mapped in MainBody)
  const cards: JobCard[] = [
    { id: "c1", title: "Jom-Job", ctaText: "Apply" },
    { id: "c2", title: "Save Jobs Easily", ctaText: "Apply" },
    { id: "c3", title: "Track Applicants", ctaText: "Apply" },
  ];

  return (
    <div className="flex min-h-screen ">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col ">
        <Navbar />
        <Dashboard cards={cards} />
      </div>
    </div>
  );
}

export default App;

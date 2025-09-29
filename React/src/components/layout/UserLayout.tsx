import { Outlet } from "react-router-dom";
import SidebarWrapper from "../EmployeeDashboard/hamburger";
import Dashboard from "../EmployeeDashboard/Dashboard/index"; // adjust path if needed
import type { SidebarItem } from "../../types/sidebar";
import { Home, FileText, UserCircle, LogOut, BookmarkCheck } from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { id: "home", title: "Home", path: "/employeedash", icon: Home },
  { id: "review", title: "Review Table", path: "/reviewtsable", icon: FileText },
  { id: "profile", title: "Profile", path: "/employeeform", icon: UserCircle },
  { id: "savejobs", title: "Save Jobs", path: "/savejobs", icon: BookmarkCheck },
  { id: "logout", title: "Logout", path: "/logout", icon: LogOut },
];

export default function UserLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <SidebarWrapper items={sidebarItems} />

      {/* Main content area */}
      <section className="flex-1 flex flex-col relative">
        <main className="flex-1 relative">

          {/* Dashboard always rendered underneath */}
          <div className="relative z-0">
            <Dashboard />
          </div>

          {/* Dynamic page content from routes */}
          <div className="absolute inset-0 z-10 ">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}

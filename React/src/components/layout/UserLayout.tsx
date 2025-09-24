// components/layouts/UserLayout.tsx
import { Outlet } from "react-router-dom";
import SidebarWrapper from "../EmployeeDashboard/hamburger";
import Navbar from "../EmployeeDashboard/Navbar";
import type { SidebarItem } from "../../types/sidebar";
import { Home, FileText, UserCircle, LogOut, Briefcase } from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { id: "home", title: "Home", path: "/employeedash", icon: Home },
  { id: "reviewtable", title: "ReviewTable", path: "/reviewtable", icon: FileText },
  { id: "jobs-applied", title: "Jobs Applied", path: "/comingsoon", icon: Briefcase },
  { id: "employee", title: "Employee", path: "/employee", icon: UserCircle },
  { id: "logout", title: "Logout", path: "/", icon: LogOut },
];

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (hidden on small screens, visible on lg+) */}
      <aside className="hidden lg:block w-64 bg-white border-r">
        <SidebarWrapper items={sidebarItems} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar always visible */}
        <Navbar />

        {/* Sidebar for mobile (drawer style if SidebarWrapper supports it) */}
        <div className="lg:hidden">
          <SidebarWrapper items={sidebarItems}/>
        </div>

        {/* Dynamic Page */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

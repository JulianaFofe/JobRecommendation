import { Outlet } from "react-router-dom";
import SidebarWrapper from "../EmployeeDashboard/hamburger";
import type { SidebarItem } from "../../types/sidebar";
import { Home, FileText, UserCircle, LogOut, BookmarkCheck } from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { id: "home", title: "Home", path: "/employeedash", icon: Home },
  { id: "review", title: "Review Table", path: "/reviewtsable", icon: FileText },
  { id: "profile", title: "Profile", path: "/employeeform", icon: UserCircle },
  { id: "savejobs", title: "savejobs", path:"/savejobs", icon: BookmarkCheck},
  { id: "logout", title: "Logout", path: "/", icon: LogOut },
];

export default function UserLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <SidebarWrapper items={sidebarItems} />

      {/* Navbar + Dynamic Page */}
      <section className="flex-1 flex flex-col">
        <main className="flex-1 ">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

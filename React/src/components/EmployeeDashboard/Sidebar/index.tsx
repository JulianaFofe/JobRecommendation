import { Link, useLocation } from "react-router-dom";
import type { SidebarItem } from "../../../types/sidebar";

type Props = { items: SidebarItem[] };

export default function Sidebar({ items }: Props) {
  const { pathname } = useLocation();

  return (
    <aside className="sticky top-0 left-0 z-50 w-64 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen">
      {/* Brand */}
      <div className="flex items-center justify-center mb-6 mt-4">
        <div className="flex flex-col items-start mb-8">
          <a href="/">
            <img
              src="WhatsApp_Image_2025-09-03_at_12.18.10-removebg-preview.png"
              alt="SmartHire Logo"
              className="w-32 h-auto object-cover"
            />
          </a>
          <h1 className="text-xs lg:text-sm text-primary font-bold mt-3">Employee</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-2">
        {items.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition
                ${isActive ? "text-primary bg-green-100" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Icon className="w-5 h-5 text-primary" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

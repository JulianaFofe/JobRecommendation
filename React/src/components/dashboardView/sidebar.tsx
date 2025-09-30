import React from "react";
import type { SidebarItem } from '../../types/sidebar';
import {
  TrendingUp,
  MessageSquare,
  Calendar,
  LogOut,
  Plus,
  User2Icon,
} from "lucide-react"; 

type SidebarProps = {
  sidebarOpen: boolean;
};

const sidebarItems: SidebarItem[] = [
  { id: "Dashboard View", title: "Dashboard View", path: "/dashview", icon: TrendingUp, section: "MAIN MENU" },
  { id: "Feedback management", title: "Feedback Management", path: "/feedadmins", icon: MessageSquare, section: "MAIN MENU" },
  { id: "Schedule Report", title: "Schedule Report", path: "/adminReport", icon: Calendar, section: "MAIN MENU" },
  { id: "Approve jobs", title: "Approve jobs", path: "/jobstate", icon: Plus, section: "QUICK ACTIONS" },
  { id: "Approve Accounts", title: "Approve accounts", path: "/pending-users", icon: User2Icon, section: "QUICK ACTIONS" },
  { id: "logout", title: "Logout", path: "/", icon: LogOut, section: "QUICK ACTIONS" },
];

const sections = ["MAIN MENU", "QUICK ACTIONS"] as const;

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg m-2 transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="p-4 lg:p-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-1 mb-6 lg:mb-8">
          <a href="/">
            <img
              src="WhatsApp_Image_2025-09-03_at_12.18.10-removebg-preview.png"
              alt="SmartHire Logo"
              className="w-32 h-auto object-cover"
            />
          </a>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {sections.map((section) => (
            <div key={section}>
              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3">
                {section}
              </div>

              {sidebarItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={item.title}
                    >
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      <span className="hidden sm:inline">{item.title}</span>
                    </a>
                  );
                })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

// src/pages/Management.tsx
import { useState } from "react";
import {
  Trash2,
  Plus,
  Search,
  User,
  Menu,
  X,
} from "lucide-react";
import Sidebar from "../dashboardView/sidebar";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Job Seeker" | "Employer";
  joined: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "Sarah@example.com",
    role: "Job Seeker",
    joined: "2 days ago",
  },
  {
    id: 2,
    name: "StartupXYZ",
    email: "Jobs@StartupXYZ.com",
    role: "Employer",
    joined: "3 days ago",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@example.com",
    role: "Job Seeker",
    joined: "5 days ago",
  },
];

export default function Management() {
  const [users] = useState<User[]>(initialUsers);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="">
      <div className="flex p-6 bg-white rounded-md shadow-md">
        {/* Hamburger Button (only visible on mobile) */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} />
        <div className="flex-1 p-4 lg:p-8 lg:ml-0">
          <div className="mb-6 lg:mb-8 mt-12 lg:mt-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm lg:text-base text-gray-600">
              Manage your SmartHire platform with ease
            </p>
          </div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-green-700">Management</h2>
              <p className="text-sm text-gray-500">
                Manage employers and job seekers
              </p>
            </div>
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md shadow">
              <Plus className="w-5 h-5" /> Add User
            </button>
          </div>

          {/* Recent Users Title + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-md font-semibold text-gray-700">
              Recent Users
            </h3>
            <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-gray-50 w-full sm:w-64 mt-2 sm:mt-0">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Jobs..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* User List */}
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between cursor-pointer hover:bg-yellow-50 bg-white rounded-md shadow px-4 py-3 ${
                  user.role === "Employer" ? "" : ""
                }`}
              >
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                      user.role === "Employer"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">Joined {user.joined}</p>
                  {/* <button className="text-yellow-600 hover:text-yellow-800">
                    <Eye className="w-5 h-5" />
                  </button> */}
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

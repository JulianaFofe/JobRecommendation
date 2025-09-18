"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Calendar,
  Briefcase,
  User,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";

import axios from "axios";

type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_approved: boolean;
};

function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/admin/users/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPendingUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching pending users:", err));
  }, [token]);

  const approveUser = async (userId: string) => {
    try {
      if (!token) return;

      const res = await axios.put(
        `http://127.0.0.1:8000/admin/users/approve/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingUsers((prev) =>
        prev.map((u) => (u.id === userId ? res.data : u))
      );
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  return (
    <div className="flex gap-10">
      <div>
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
              <a href="/jobstate">
                <img
                  src="WhatsApp_Image_2025-09-03_at_12.18.10-removebg-preview.png"
                  alt="SmartHire Logo"
                  className="w-32 lg:w-45 h-auto object-cover"
                />
              </a>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Admin Portal
              </p>
            </div>

            <nav className="space-y-2">
              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3">
                MAIN MENU
              </div>

              <a
                href="dashview"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Dashboard Overview</span>
              </a>
              <a
                href="/jobmanagement"
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
              <a
                href="/feedadmins"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Feedback Management</span>
              </a>

              <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3 mt-6">
                QUICK ACTIONS
              </div>
              <a
                href="/jobstate"
                className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
              >
                <Plus className="w-5 h-5 text-primary" />
                <span className="hidden sm:inline">Approve Jobs</span>
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
      </div>

      <div className="max-h-139 overflow-y-auto pr-2 w-full mt-10 mb-10">
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No pending users</p>
        ) : (
          pendingUsers.map((user) => (
            <div
              key={user.id}
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md shadow-slate-400 ml-4 sm:ml-7 p-4 sm:p-7 rounded mt-4"
            >
              <div>
                <h1 className="font-semibold">{user.username}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span
                  className={`${
                    user.is_approved ? "text-green-600" : "text-yellow-600"
                  } font-medium`}
                >
                  {user.is_approved ? "Approved" : "Pending"}
                </span>
                <p className="text-xs text-gray-500">{user.created_at}</p>
              </div>
              <div className="flex gap-3">
                {!user.is_approved && (
                  <button
                    onClick={() => approveUser(user.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PendingUsers;

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../dashboardView/sidebar";
import { Menu, X } from "lucide-react";

type UserData = {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_approved: boolean;
};

function PendingUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);

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

  const rejectUser = async (userId: string) => {
    try {
      if (!token) return;

      await axios.put(
        `http://127.0.0.1:8000/admin/users/reject/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} />
        
        <div className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-y-auto">
          <button
              className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                  <p className="text-sm text-gray-600">{user.role}</p>
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
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                  )}

                  {!user.is_approved && (
                    <button
                      onClick={() => rejectUser(user.id)}
                      className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>      
    </div>
  );
}

export default PendingUsers;

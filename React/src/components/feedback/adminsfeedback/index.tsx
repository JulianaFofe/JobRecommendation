// src/components/AdminFeedback.tsx
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  TrendingUp,
  Briefcase,
  User,
  Plus,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  rating: number;
  created_at: string;
}

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data: Feedback[] = await res.json();
        setFeedbacks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading feedback...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (feedbacks.length === 0) return <div className="text-center mt-10 text-gray-500">No feedback available.</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg m-2 transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 lg:p-6">
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

          <nav className="space-y-2">
            <div className="text-xs lg:text-md font-medium text-black uppercase tracking-wider mb-3">
              MAIN MENU
            </div>

            <a
              href="/dashview"
              className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Dashboard Overview</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-secondary rounded-lg text-sm lg:text-base"
            >
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Job Management</span>
            </a>
            <a
              href="#"
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
              href="#"
              className="flex items-center gap-3 px-3 text-gray-600 hover:text-secondary py-2 rounded-lg text-sm lg:text-base"
            >
              <Plus className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Add New Job</span>
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

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center">Admin Feedback Dashboard</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Message</th>
                <th className="py-2 px-4">Rating</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4">{fb.id}</td>
                  <td className="py-2 px-4">{fb.name}</td>
                  <td className="py-2 px-4">{fb.email}</td>
                  <td className="py-2 px-4">{fb.message}</td>
                  <td className="py-2 px-4">{fb.rating}</td>
                  <td className="py-2 px-4">{new Date(fb.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;

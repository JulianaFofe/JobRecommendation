import { useEffect, useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";
import Sidebar from "../../dashboardView/sidebar";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
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

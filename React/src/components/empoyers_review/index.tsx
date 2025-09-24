import React, { useState } from "react";
import { Star } from "lucide-react";

const EmployersReview: React.FC = () => {
  const [form, setForm] = useState({
    applicant_name: "",
    job_position: "",
    rating: 0,
    message: "",
  });

  const [rating, setRating] = useState(0);
  const [popup, setPopup] = useState<{ message: string; type: "loading" | "success" | "error" | null }>({ message: "", type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPopup({ message: "Submitting review…", type: "loading" });

    try {
      const response = await fetch("http://localhost:8000/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      console.log("✅ Saved review:", data);

      setPopup({ message: "Review submitted successfully!", type: "success" });

      // Clear form
      setForm({ applicant_name: "", job_position: "", rating: 0, message: "" });
      setRating(0);
    } catch (err) {
      console.error("❌ Error saving review:", err);
      setPopup({ message: "Failed to submit review. Please try again.", type: "error" });
    } finally {
      // Hide popup after 3 seconds
      setTimeout(() => setPopup({ message: "", type: null }), 3000);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border-1 border-gray-100 shadow my-6 relative">
      {/* Floating Center Popup */}
      {popup.type && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div
            className={`px-6 py-3 rounded-xl text-white text-lg font-semibold shadow-lg pointer-events-none ${
              popup.type === "loading"
                ? "bg-blue-500 animate-pulse"
                : popup.type === "success"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {popup.message}
          </div>
        </div>
      )}

      <section className="text-center mb-6">
        <h1 className="text-2xl font-bold">Write a Review</h1>
        <p className="text-gray-500">Share your feedback about the applicant</p>
      </section>

      <form
        className="bg-white shadow-md rounded-2xl p-6 space-y-5"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-semibold mb-2">
            Select applicant
          </label>
          <input
            type="text"
            placeholder="Jane Doe – Software Engineer"
            value={form.applicant_name}
            onChange={(e) =>
              setForm({ ...form, applicant_name: e.target.value })
            }
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Job position reviewed
          </label>
          <input
            type="text"
            placeholder="Job position reviewed"
            value={form.job_position}
            onChange={(e) =>
              setForm({ ...form, job_position: e.target.value })
            }
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={`cursor-pointer ${
                  rating >= star
                    ? "fill-secondary text-secondary"
                    : "text-gray-300"
                }`}
                onClick={() => {
                  setRating(star);
                  setForm({ ...form, rating: star });
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Your Review</label>
          <textarea
            placeholder="Write your review here..."
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Submit
          </button>
          <button
            type="button"
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployersReview;

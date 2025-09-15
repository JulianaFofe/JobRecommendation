import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Navbar from "../../../containers/navbar";
import { submitFeedback } from "../../../types/feedback";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitFeedback({ ...form, rating });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setRating(0);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-lg w-full"
        >
          {!submitted ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6">
                We Value Your Feedback 💬
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Help us improve SmartHire by sharing your thoughts. Your
                feedback makes a difference!
              </p>

              {/* Feedback Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-primary rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-primary rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rate your experience
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        className={`cursor-pointer transition ${
                          star <= rating
                            ? "fill-secondary text-secondary"
                            : "text-gray-400"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-primary rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us more about your experience..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-secondary transition disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                Thank You!
              </h3>
              <p className="text-gray-600">
                Your feedback has been received. We appreciate your time and
                will use your insights to make SmartHire even better!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

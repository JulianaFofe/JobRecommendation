import React, { useEffect, useState } from "react";

type Review = {
  id: number;
  applicant_name: string;
  job_position: string;
  rating: number;
  message: string;
};

const ReviewsTable: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/review");
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data: Review[] = await res.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading reviews…</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Reviews</h2>
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">Applicant</th>
            <th className="px-4 py-2 border-b">Job Position</th>
            <th className="px-4 py-2 border-b">Rating</th>
            <th className="px-4 py-2 border-b">Message</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No reviews yet
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{review.applicant_name}</td>
                <td className="px-4 py-2 border-b">{review.job_position || "-"}</td>
                <td className="px-4 py-2 border-b">{review.rating} ⭐</td>
                <td className="px-4 py-2 border-b">{review.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsTable;

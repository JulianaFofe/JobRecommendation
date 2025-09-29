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

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading reviews…</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray/30 backdrop-blur-sm">
      <div className="relative h-4/5 w-4/5 flex justify-center">
        {/* Semi-transparent card */}
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg w-full max-w-6xl p-2">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">
            Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No reviews yet</p>
          ) : (
            <div className="overflow-scroll max-h-[400px]">
              <table className="min-w-full border border-gray-200 bg-transparent rounded-lg">
                <thead className="bg-gray-100 bg-opacity-70">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Applicant</th>
                    <th className="px-4 py-2 border-b text-left">Job Position</th>
                    <th className="px-4 py-2 border-b text-left">Rating</th>
                    <th className="px-4 py-2 border-b text-left">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="hover:bg-gray-50 hover:bg-opacity-40"
                    >
                      <td className="px-4 py-2 border-b">{review.applicant_name}</td>
                      <td className="px-4 py-2 border-b">
                        {review.job_position || "-"}
                      </td>
                      <td className="px-4 py-2 border-b">{review.rating} ⭐</td>
                      <td className="px-4 py-2 border-b">{review.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTable;

import API from "./api_feedback";

export interface FeedbackData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

// Submit feedback (POST)
export const submitFeedback = async (feedback: FeedbackData) => {
  const response = await API.post("/api/feedback", feedback);
  return response.data;
};

// Get all feedback (GET) — for admin page
export const getAllFeedback = async () => {
  const response = await API.get("/api/feedback");
  return response.data;
};

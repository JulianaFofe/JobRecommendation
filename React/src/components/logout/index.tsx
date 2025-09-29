import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true); // trigger animation on mount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleCancel = () => {
    // animate out before navigating back
    setShow(false);
    setTimeout(() => navigate(-1), 300); // match duration
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <section
        className={`bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <p className="text-gray-800 text-lg font-medium mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-center gap-4 text-white font-semibold">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md bg-primary hover:opacity-80 transition"
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
};

export default Logout;

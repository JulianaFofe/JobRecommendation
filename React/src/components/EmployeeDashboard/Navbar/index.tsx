import { useState, useEffect } from "react";
import { Search, UserCircle } from "lucide-react";
import Employee_Form from "../../employee_form/index"; // adjust path

type Props = {
  onSearch?: (q: string) => void;
  onToggleSidebar?: () => void;
};

export default function Navbar({ onSearch, onToggleSidebar }: Props) {
  const [q, setQ] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ Show modal only on the first visit ever
  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenProfileModal");

    if (!hasSeenModal) {
      setShowModal(true);
      localStorage.setItem("hasSeenProfileModal", "true");
    }
  }, []);

  return (
    <>
      <header className="flex max-w-8xl items-center mt-5 justify-between bg-white/80 shadow-md rounded-lg px-4 py-4 lg:px-6">
        {/* Left: Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-primary hover:bg-gray-100 lg:hidden"
        >
          {/* <Menu /> can go here */}
        </button>

        {/* Center: Search */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="flex items-center border border-primary rounded-md px-3 py-2">
            <Search className="w-4 h-4 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch?.(q)}
              placeholder="Search..."
              className="ml-2 w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Right: Profile */}
        <div
          onClick={() => setShowModal(true)}
          className="p-2 rounded-full bg-primary text-white cursor-pointer"
        >
          <UserCircle className="w-6 h-6" />
        </div>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Render Employee_Form inside modal */}
            <Employee_Form />
          </div>
        </div>
      )}
    </>
  );
}

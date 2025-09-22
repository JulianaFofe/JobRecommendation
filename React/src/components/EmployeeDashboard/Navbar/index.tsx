import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserCircle } from "lucide-react";

type Props = {
  onSearch?: (q: string) => void;
  onToggleSidebar?: () => void;
};

export default function Navbar({ onSearch, onToggleSidebar }: Props) {
  const [q, setQ] = useState("");
  const [, setShowModal] = useState(false);

  // Show modal only on the first visit ever
  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenProfileModal");
    if (!hasSeenModal) {
      setShowModal(true);
      localStorage.setItem("hasSeenProfileModal", "true");
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-white/80 shadow-md rounded-lg px-4 py-4 lg:px-10 backdrop-blur">
      {/* Left: Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-primary hover:bg-gray-100 lg:hidden"
      >
        {/* You can add a menu icon here */}
      </button>

      {/* Center: Search */}
      <div className="w-200 mx-6">
        <div className="flex items-center border border-primary rounded-md px-5 py-2 w-full">
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
      <div className="p-2 rounded-full bg-primary text-white cursor-pointer">
        <Link to="/profile">
          <UserCircle className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}

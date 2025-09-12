import { useState } from "react";
import { Search, UserCircle, Menu } from "lucide-react";

type Props = {
  onSearch?: (q: string) => void;
  onToggleSidebar?: () => void; // control sidebar from parent
};

export default function Navbar({ onSearch, onToggleSidebar }: Props) {
  const [q, setQ] = useState("");

  return (
    <header className="flex max-w-8xl items-center mt-5 justify-between bg-white/80 shadow-md rounded-lg px-4 py-4 lg:px-6">
      {/* Left: Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-primary hover:bg-gray-100 lg:hidden"
      >
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
      <div className="p-2 rounded-full bg-primary text-white cursor-pointer">
        <UserCircle className="w-6 h-6" />
      </div>
    </header>
  );
}

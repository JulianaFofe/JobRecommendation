import { useState } from "react";
import { Search, UserCircle } from "lucide-react";

type Props = {onSearch?: (q: string) => void };

export default function Navbar({ onSearch }: Props) {
  const [q, setQ] = useState("");

  return (
    <div className="px-15 ">
      <header className="translate-x-0-translate-x-full lg:translate-x-0 lg:justify-between lg:static inset-y-0 left-0 z-50 w-250  bg-white/70 shadow-lg rounded-lg m-2 lg:m-4 mr-0 transition-transform duration-300 ease-in-out">
        {/* Search bar row */}
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="flex-1 flex items-center border border-primary rounded-md px-3 py-2">
            <Search className="w-4 h-4 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch?.(q)}
              placeholder="Search..."
              className="ml-2 w-full outline-none text-sm"
            />
          </div>
          <div className="p-2 rounded-full bg-primary text-white">
            <UserCircle className="w-5 h-5" />
          </div>
        </div>
      </header>
    </div>
  );
}

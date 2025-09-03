import { useState } from "react";
import { Search, UserCircle } from "lucide-react";
//import type { NavbarTab } from "../../../types/navbar";

type Props = { /*tabs: NavbarTab[];*/ onSearch?: (q: string) => void };

export default function Navbar({ onSearch }: Props) {
  // const [active, setActive] = useState(tabs[0]?.id ?? "");
  const [q, setQ] = useState("");

  return (
    <header className="fix shadow bg-white border border-white">
      {/* Small tabs row (Section 1 / 2) */}
      {/* <div className="px-4 pt-2 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`text-sm px-3 py-1 rounded border
              ${active === t.id ? "bg-gray-200 border-gray-300" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {t.label}
          </button>
        ))}
      </div> */}

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
  );
}

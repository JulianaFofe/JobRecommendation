import { Link, useLocation } from "react-router-dom";
import type { SidebarItem } from "../../../types/sidebar";
import logo from "../../../assets/images/logo.png";

type Props = { items: SidebarItem[] };

export default function Sidebar({ items }: Props) {
  const { pathname } = useLocation();

  return (
    <aside className="h-[calc(100vh-64px)] translate-x-0-translate-x-full lg:translate-x-0 lg:static inset-y-0 left-0 z-50 w-65 bg-white/70 backdrop-blur-sm shadow-lg rounded-lg m-2 lg:m-4 mr-0 transition-transform duration-300 ease-in-out">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-40 h-40 rounded-full  grid place-items-center text-white font-bold"><img src={logo} alt="" /></div>
      </div>

      {/* Nav */}
      <nav className="space-y-15">
        {items.map((item) => {
          const Active = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex  items-center gap-3 rounded-md px-3 py-2 transition
                ${Active ? "text-primary/100 bg-green-100  " : "text-gray-700 hover:bg-gray-100"}`}
            >
              <Icon className="w-5 h-5 text-primary" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

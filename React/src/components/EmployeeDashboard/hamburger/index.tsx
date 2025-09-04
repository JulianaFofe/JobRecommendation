import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../Sidebar"; 
import type { SidebarItem } from "../../../types/sidebar";

type Props = { items: SidebarItem[] };

export default function SidebarWrapper({ items }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button - visible only on mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay (blurred background) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}
      >
        {/* Exit button on mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Your existing Sidebar component */}
        <Sidebar items={items} />
      </div>
    </>
  );
}

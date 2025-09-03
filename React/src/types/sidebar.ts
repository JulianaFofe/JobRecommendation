import type { ElementType } from "react";

export interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: ElementType; // e.g. Home from lucide-react
}

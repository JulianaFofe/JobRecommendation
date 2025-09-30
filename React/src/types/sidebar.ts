import type { ElementType } from "react";

export interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: ElementType;
  section?: "MAIN MENU" | "QUICK ACTIONS";
}

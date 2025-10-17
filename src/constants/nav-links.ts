import { Calendar, FileText, LayoutDashboard, Users } from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Documents",
    icon: FileText,
    path: "/documents",
  },
  {
    label: "Sessions",
    icon: Calendar,
    path: "/sessions",
  },
  {
    label: "Users",
    icon: Users,
    path: "/users",
  },
];

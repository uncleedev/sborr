import { Calendar, FileText, LayoutDashboard, Users } from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/protected/dashboard",
  },
  {
    label: "Documents",
    icon: FileText,
    path: "/protected/documents",
  },
  {
    label: "Sessions",
    icon: Calendar,
    path: "/protected/sessions",
  },
  {
    label: "Users",
    icon: Users,
    path: "/protected/users",
  },
];

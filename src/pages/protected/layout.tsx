import Sidebar from "@/components/shared/sidebar";
import Topbar from "@/components/shared/topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full h-screen flex p-4 gap-2 sm:gap-4">
      <Sidebar />

      <div className="w-full flex flex-col gap-2 sm:gap-4">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}

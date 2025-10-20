import Sidebar from "@/components/shared/sidebar";
import Topbar from "@/components/shared/topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="w-full h-screen flex gap-2 sm:gap-4 p-4">
      {/* Sidebar: fixed height */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-4">
        <Topbar />

        {/* Outlet scrollable */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}

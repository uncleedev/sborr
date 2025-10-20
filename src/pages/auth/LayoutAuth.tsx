import Logo from "@/components/shared/logo";
import { Outlet } from "react-router-dom";

export default function LayoutAuth() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-1">
        <Logo size="6xl" />
        <p className="text-xs md:text-sm font-medium text-muted-foreground">
          Municipality of Montalban
        </p>
      </div>

      <Outlet />
    </div>
  );
}

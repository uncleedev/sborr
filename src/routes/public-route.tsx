import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PublicRoute() {
  const { hasSession, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const isHome = location.pathname === "/";

  if (hasSession && !isHome) {
    return <Navigate to="/protected/documents" replace />;
  }

  return <Outlet />;
}

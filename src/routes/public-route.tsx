import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { hasSession, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (hasSession) {
    return <Navigate to="/documents" replace />;
  }

  return <Outlet />;
}

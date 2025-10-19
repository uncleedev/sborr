import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute() {
  const { hasSession, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!hasSession) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

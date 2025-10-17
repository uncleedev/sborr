import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicRoute() {
  const { hasSession, loading } = useAuth();

  if (loading) {
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

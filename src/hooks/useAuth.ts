import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export const useAuth = () => {
  const navigate = useNavigate();
  const { session, loading, initialized, signin, initializeSession, signout } =
    useAuthStore();

  const hasSession = !!session;

  const handleSignin = async (email: string, password: string) => {
    try {
      await signin(email, password);
      toast.success("Successfully signed in.");
      navigate("/dashboard");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in.");
      return false;
    }
  };

  const handleSignout = async () => {
    try {
      await signout();
      toast.success("Successfully signed out.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out.");
    }
  };

  useEffect(() => {
    initializeSession();
  }, []);

  return {
    session,
    loading,
    hasSession,
    handleSignin,
    handleSignout,
    initialized,
  };
};

import { useAuthStore } from "@/stores/auth-store";
import { UserCreate } from "@/types/user-type";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const navigate = useNavigate();
  const { session, signin, setSession, loading } = useAuthStore();

  const hasSession = !!session;

  const handleSignin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await signin(email, password);
      toast.success("You’ve successfully signed in to your account.");
      navigate("/documents");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  // const handleInvite = async (
  //   user: UserCreate & { password: string }
  // ): Promise<boolean> => {
  //   try {
  //     await invite(user);
  //     toast.success("Successfully invited a user");

  //     return true;
  //   } catch (error: any) {
  //     toast.error(error);
  //     return false;
  //   }
  // };

  useEffect(() => {
    const initSession = async () => {
      await setSession();
    };

    initSession();
  }, [setSession]);

  return {
    session,
    loading,
    hasSession,
    handleSignin,
  };
};

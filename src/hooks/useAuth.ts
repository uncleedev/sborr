import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    session,
    loading,
    initialized,
    signin,
    initializeSession,
    signout,
    sendOtp,
    resetPasswordWithOtp,
    forgotPassword,
  } = useAuthStore();

  const hasSession = !!session;

  /* ------------------ HANDLE SIGNIN ------------------ */
  const handleSignin = async (email: string, password: string) => {
    try {
      // 1️⃣ Check user role before signing in
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();

      if (userError || !userData) {
        toast.error("Account not found or cannot verify role.");
        return false;
      }

      if (userData.role !== "secretary") {
        toast.error("Only secretaries are allowed to sign in.");
        return false;
      }

      // 2️⃣ If role is valid, proceed to sign in
      await signin(email, password);

      // 3️⃣ Success — redirect to dashboard
      toast.success("Successfully signed in.");
      navigate("/protected/dashboard");
      return true;
    } catch (err: any) {
      console.error("❌ Signin error:", err);
      toast.error(err.message || "Failed to sign in.");
      return false;
    }
  };

  /* ------------------ HANDLE SIGNOUT ------------------ */
  const handleSignout = async () => {
    try {
      await signout();
      toast.success("Successfully signed out.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out.");
    }
  };

  /* ------------------ FORGOT PASSWORD ------------------ */
  const handleForgotPassword = async (email: string): Promise<boolean> => {
    try {
      await forgotPassword(email);
      toast.success("Successfully sent reset instructions to your email.");
      navigate("/auth/signin");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  /* ------------------ SEND OTP ------------------ */
  const handleSendOtp = async (email: string) => {
    try {
      await sendOtp(email);
      toast.success("OTP sent to your email!");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP.");
      return false;
    }
  };

  /* ------------------ RESET PASSWORD ------------------ */
  const handleResetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    try {
      await resetPasswordWithOtp(email, otp, newPassword);
      toast.success("Password reset successfully!");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
      return false;
    }
  };

  /* ------------------ INITIALIZE SESSION ON LOAD ------------------ */
  useEffect(() => {
    initializeSession();
  }, []);

  return {
    session,
    loading,
    hasSession,
    initialized,
    handleSignin,
    handleSignout,
    handleForgotPassword,
    handleSendOtp,
    handleResetPassword,
  };
};

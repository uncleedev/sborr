import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth-service";

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  signin: (email: string, password: string) => Promise<void>;
  initializeSession: () => Promise<void>;
  signout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  resetPasswordWithOtp: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: false,
  error: null,
  initialized: false,

  signin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.signin(email, password);
      set({ session: data.session || null });
    } catch (err: any) {
      set({ error: err.message, session: null });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  initializeSession: async () => {
    set({ loading: true, error: null });
    try {
      const data = await authService.getSession();
      set({ session: data.session || null });
    } catch (err: any) {
      console.error("Initialize session failed:", err);
      set({ session: null, error: err.message || "Failed to get session" });
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  signout: async () => {
    set({ loading: true, error: null });
    try {
      await authService.signout();
      set({ session: null, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to sign out", loading: false });
      throw err;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.forgotPassword(email);
    } catch (err: any) {
      set({ error: err.message || "Faile to forgot password" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  sendOtp: async (email) => {
    set({ loading: true, error: null });
    try {
      await authService.sendOtp(email);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  resetPasswordWithOtp: async (email, otp, newPassword) => {
    set({ loading: true, error: null });
    try {
      await authService.resetPasswordWithOtp(email, otp, newPassword);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth-service";

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;

  signin: (email: string, password: string) => Promise<void>;
  setSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: false,
  error: null,

  signin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.signin(email, password);
      set({ session: data.session });
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  setSession: async () => {
    set({ loading: true, error: null });
    try {
      const data = await authService.getSession();
      set({ session: data.session });
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/auth-service";
import { UserCreate } from "@/types/user-type";

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;

  signin: (email: string, password: string) => Promise<void>;
  setSession: () => Promise<void>;
  // invite: (user: UserCreate & { password: string }) => Promise<void>;
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

  // invite: async (user) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const data = await authService.inviteUser(user);
  //     console.log("User invited:", data);
  //   } catch (err: any) {
  //     set({ error: err.message });
  //     throw err.message;
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
}));

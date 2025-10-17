import { supabase } from "@/lib/supabase";

export const authService = {
  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message || "Failed to signin");

    return data;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw new Error(error.message || "Failed to get session");

    return data;
  },
};

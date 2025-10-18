import { supabase } from "@/lib/supabase";
import { UserCreate } from "@/types/user-type";

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

  // async inviteUser(user: UserCreate & { password: string }) {
  //   const { data, error } = await supabase.functions.invoke("invite-user", {
  //     body: user,
  //   });

  //   if (error) throw new Error(error.message || "Failed to invite user");
  //   if (data?.error) throw new Error(data.error);
  //   return data;
  // },
};

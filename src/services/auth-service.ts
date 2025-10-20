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

  async signout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message || "Failed to signout");
  },

  async inviteUser(user: UserCreate & { password: string }) {
    const { data, error } = await supabase.functions.invoke("invite-user", {
      body: user,
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  },

  async deleteUser(userId: string) {
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { userId },
    });

    if (error) throw new Error(error.message);

    if (data?.error) {
      if (data.error.toLowerCase().includes("user not found")) {
        console.warn("User not found in Auth, deleting DB record only.");
        return { success: true, message: "Deleted from DB only." };
      }

      throw new Error(data.error);
    }

    return data;
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    const session = (await supabase.auth.getSession()).data.session;
    const email = session?.user?.email;

    if (!email) throw new Error("No active user session found.");

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (reauthError) throw new Error("Current password is incorrect.");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error(error.message || "Failed to update password.");
    return { success: true };
  },

  async forgotPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw new Error(error.message || "Failed to send reset email");
    return data;
  },
};

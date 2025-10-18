import { supabase } from "@/lib/supabase";
import { User, UserCreate } from "@/types/user-type";

export const userService = {
  /* ---------- CREATE ---------- */
  async createUser(user: UserCreate): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .insert([{ ...user }])
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to create user");

    return data as User[];
  },

  /* ---------- READ ---------- */
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to fetch users");

    return data as User[];
  },

  /* ---------- UPDATE ---------- */
  async updateUser(id: string, updates: Partial<UserCreate>): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to update user");

    return data as User[];
  },

  /* ---------- DELETE ---------- */
  async deleteUser(id: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to delete user");

    return data as User[];
  },

  /* ---------- REAL-TIME SUBSCRIPTION ---------- */
  subscribeToUsers(
    callback: (payload: {
      eventType: "INSERT" | "UPDATE" | "DELETE";
      new: any;
      old: any;
    }) => void
  ) {
    const channel = supabase
      .channel("users-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          callback({
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new,
            old: payload.old,
          });
        }
      )
      .subscribe();

    return channel;
  },
};

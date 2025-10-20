import { supabase } from "@/lib/supabase";
import { User, UserCreate } from "@/types/user-type";

export const userService = {
  /* ---------- CREATE (Upload avatar first) ---------- */
  async createUser(user: UserCreate, avatarFile?: File): Promise<User[]> {
    let avatar_url: string | null = null;
    let avatar_path: string | null = null;

    // Upload avatar first (if provided)
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `avatars/${user.firstname}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError)
        throw new Error(uploadError.message || "Failed to upload avatar");

      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatar_url = publicData.publicUrl;
      avatar_path = filePath;
    }

    // Insert user after avatar upload
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...user,
          avatar_url,
          avatar_path,
        },
      ])
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

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message || "Failed to fetch user");
    return data as User;
  },

  /* ---------- UPDATE ---------- */
  async updateUser(id: string, updates: Partial<UserCreate>): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .update({
        firstname: updates.firstname,
        lastname: updates.lastname,
        bio: updates.bio,
        role: updates.role,
        email: updates.email,
        avatar_url: updates.avatar_url,
        avatar_path: updates.avatar_path,
      })
      .eq("id", id)
      .select("*");

    if (error) throw new Error(error.message || "Failed to update user");
    return data as User[];
  },

  /* ---------- DELETE ---------- */
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message || "Failed to delete user");
  },

  /* ---------- AVATAR DELETE ---------- */
  async deleteAvatar(
    userId: string,
    avatar_path: string | null
  ): Promise<void> {
    if (!avatar_path) return;

    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([avatar_path]);

    if (deleteError)
      throw new Error(deleteError.message || "Failed to delete avatar");

    await this.updateUser(userId, { avatar_url: null, avatar_path: null });
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

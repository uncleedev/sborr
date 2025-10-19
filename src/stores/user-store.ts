import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { userService } from "@/services/user-service";
import { User, UserCreate } from "@/types/user-type";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  channel?: ReturnType<typeof supabase.channel>;

  createUser: (user: UserCreate, avatarFile?: File) => Promise<void>;
  getAllUsers: () => Promise<void>;
  updateUser: (id: string, updates: Partial<UserCreate>) => Promise<void>;

  uploadAvatar: (userId: string, file: File) => Promise<void>;
  deleteAvatar: (userId: string, avatar_path?: string | null) => Promise<void>;

  subscribe: () => void;
  unsubscribe: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  channel: undefined,

  /* ---------- CREATE (with avatar upload before insert) ---------- */
  createUser: async (user, avatarFile) => {
    set({ loading: true, error: null });
    try {
      await userService.createUser(user, avatarFile);
      await get().getAllUsers(); // refresh after creation
    } catch (err: any) {
      console.error("Create User Error:", err);
      set({ error: err.message || "Failed to create user" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- READ (get all users) ---------- */
  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userService.getAllUsers();
      set({ users: data });
    } catch (err: any) {
      console.error("Get All Users Error:", err);
      set({ error: err.message || "Failed to fetch users" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- UPDATE ---------- */
  updateUser: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const data = await userService.updateUser(id, updates);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? data[0] : u)),
      }));
    } catch (err: any) {
      console.error("Update User Error:", err);
      set({ error: err.message || "Failed to update user" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- AVATAR UPLOAD ---------- */
  uploadAvatar: async (userId, file) => {
    set({ loading: true, error: null });
    try {
      // Reuse the create logic for consistent upload handling
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatar_url = data.publicUrl;
      const avatar_path = filePath;

      await userService.updateUser(userId, { avatar_url, avatar_path });

      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, avatar_url, avatar_path } : u
        ),
      }));
    } catch (err: any) {
      console.error("Upload Avatar Error:", err);
      set({ error: err.message || "Failed to upload avatar" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- AVATAR DELETE ---------- */
  deleteAvatar: async (userId, avatar_path) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteAvatar(userId, avatar_path || null);

      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, avatar_url: null, avatar_path: null } : u
        ),
      }));
    } catch (err: any) {
      console.error("Delete Avatar Error:", err);
      set({ error: err.message || "Failed to delete avatar" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- REALTIME SUBSCRIPTION ---------- */
  subscribe: () => {
    if (get().channel) return;

    const channel = userService.subscribeToUsers(
      ({ eventType, new: newUser, old: oldUser }) => {
        set((state) => {
          let updatedUsers = [...state.users];

          switch (eventType) {
            case "INSERT":
              if (!updatedUsers.some((u) => u.id === newUser.id)) {
                updatedUsers.unshift(newUser);
              }
              break;

            case "UPDATE":
              updatedUsers = updatedUsers.map((u) =>
                u.id === newUser.id ? newUser : u
              );
              break;

            case "DELETE":
              updatedUsers = updatedUsers.filter((u) => u.id !== oldUser.id);
              break;
          }

          return { users: updatedUsers };
        });
      }
    );

    set({ channel });
  },

  /* ---------- UNSUBSCRIBE ---------- */
  unsubscribe: () => {
    const channel = get().channel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: undefined });
    }
  },
}));

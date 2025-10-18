import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { userService } from "@/services/user-service";
import { User, UserCreate } from "@/types/user-type";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  channel?: ReturnType<typeof supabase.channel>;

  createUser: (user: UserCreate) => Promise<void>;
  getAllUsers: () => Promise<void>;
  updateUser: (id: string, updates: Partial<UserCreate>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  subscribe: () => void;
  unsubscribe: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  channel: undefined,

  /* ---------- CREATE ---------- */
  createUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const data = await userService.createUser(user);
      set((state) => ({
        users: [...data, ...state.users],
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- READ ---------- */
  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userService.getAllUsers();
      set({ users: data });
    } catch (err: any) {
      set({ error: err.message });
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
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- DELETE ---------- */
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
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

  unsubscribe: () => {
    const channel = get().channel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: undefined });
    }
  },
}));

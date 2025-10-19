import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { User, UserCreate, UserUpdate } from "@/types/user-type";
import { useAuth } from "./useAuth";

export const useUser = () => {
  const [loggedOnUser, setLoggedOnUser] = useState<User>();

  const { session } = useAuth();

  const {
    users,
    loading,
    error,
    getAllUsers,
    createUser,
    updateUser,
    uploadAvatar,
    deleteAvatar,
    subscribe,
    unsubscribe,
  } = useUserStore();

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUsers();
      } catch (err: any) {
        toast.error(err.message || "Failed to load users");
      }
    };

    fetchUsers();
    subscribe();
    return () => unsubscribe();
  }, [getAllUsers, subscribe, unsubscribe]);

  /* ---------- SYNC LOGGED-IN USER ---------- */
  useEffect(() => {
    if (session?.user?.id) {
      const user = users.find((u) => u.id === session.user.id);
      setLoggedOnUser(user);
    }
  }, [session, users]);

  /* ---------- CREATE USER ---------- */
  const handleAddUser = useCallback(
    async (user: UserCreate, avatarFile?: File): Promise<boolean> => {
      try {
        await createUser(user, avatarFile);
        toast.success("✅ User successfully added");
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to add user");
        return false;
      }
    },
    [createUser]
  );

  /* ---------- UPDATE USER ---------- */
  const handleEditUser = useCallback(
    async (id: string, newUser: UserUpdate): Promise<boolean> => {
      try {
        await updateUser(id, newUser);
        toast.success("✅ User information updated");
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to update user");
        return false;
      }
    },
    [updateUser]
  );

  /* ---------- UPLOAD AVATAR ---------- */
  const handleUploadAvatar = useCallback(
    async (userId: string, file: File) => {
      try {
        await uploadAvatar(userId, file);
        toast.success("🖼️ Avatar updated successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to upload avatar");
      }
    },
    [uploadAvatar]
  );

  /* ---------- DELETE AVATAR ---------- */
  const handleDeleteAvatar = useCallback(
    async (userId: string, avatar_path?: string | null) => {
      try {
        await deleteAvatar(userId, avatar_path);
        toast.success("🗑️ Avatar removed successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete avatar");
      }
    },
    [deleteAvatar]
  );
  const getUserName = useCallback(
    (id?: string): string => {
      if (!id) return "Unknown";
      const user = users.find((u) => u.id === id);
      return user ? `${user.firstname} ${user.lastname}` : "Unknown";
    },
    [users]
  );

  return {
    users,
    loggedOnUser,
    loading,
    error,
    handleAddUser,
    handleEditUser,
    handleUploadAvatar,
    handleDeleteAvatar,
    getUserName,
  };
};

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { UserCreate, UserUpdate } from "@/types/user-type";

export const useUser = () => {
  const {
    users,
    loading,
    error,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    subscribe,
    unsubscribe,
  } = useUserStore();

  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers();
    };

    fetchUsers();
    subscribe();

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (user: UserCreate): Promise<boolean> => {
    try {
      await createUser(user);
      toast.success("Successfully added user");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to add user");
      return false;
    }
  };

  const handleEditUser = async (
    id: string,
    newUser: UserUpdate
  ): Promise<boolean> => {
    try {
      await updateUser(id, newUser);
      toast.success("Successfully updated user");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
      return false;
    }
  };

  const handleDeleteUser = async (id: string): Promise<boolean> => {
    try {
      await deleteUser(id);
      toast.success("Successfully deleted user");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
  };
};

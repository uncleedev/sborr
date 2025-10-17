import { useSessionStore } from "@/stores/session-store";
import { SessionCreate, SessionUpdate } from "@/types/session-type";
import { useEffect } from "react";
import { toast } from "sonner";

export const useSession = () => {
  const {
    sessions,
    loading,
    error,
    getAllSessions,
    createSession,
    updateSession,
    deleteSession,
    subscribe,
    unsubscribe,
  } = useSessionStore();

  useEffect(() => {
    getAllSessions();
    subscribe();

    return () => unsubscribe();
  }, []);

  const handleAddSession = async (session: SessionCreate): Promise<boolean> => {
    try {
      await createSession(session);
      toast.success("Successfully added session");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  const handleEditSession = async (
    id: string,
    newSession: SessionUpdate
  ): Promise<boolean> => {
    try {
      await updateSession(id, newSession);
      toast.success("Successfully updated session");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  const hadnleDeleteSession = async (id: string): Promise<boolean> => {
    try {
      await deleteSession(id);
      toast.success("Successfully deleted session");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  return {
    sessions,
    loading,
    error,
    handleAddSession,
    handleEditSession,
    hadnleDeleteSession,
  };
};

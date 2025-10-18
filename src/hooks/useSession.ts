import { useEffect } from "react";
import { toast } from "sonner";
import { useSessionStore } from "@/stores/session-store";
import {
  AgendaCreate,
  SessionCreate,
  SessionUpdate,
} from "@/types/session-type";
import { useDocument } from "./useDocument";

export const useSession = () => {
  const {
    sessions,
    agendas,
    loading,
    error,
    getAllSessions,
    createSession,
    updateSession,
    deleteSession,
    subscribe,
    unsubscribe,
  } = useSessionStore();

  const { documents } = useDocument();

  useEffect(() => {
    getAllSessions();
    subscribe();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddSession = async (
    session: SessionCreate,
    agenda: AgendaCreate[]
  ): Promise<boolean> => {
    try {
      await createSession(session, agenda);
      toast.success("Successfully added session");
      return true;
    } catch (err: any) {
      toast.error(err || "Failed to add session");
      return false;
    }
  };

  const handleEditSession = async (
    id: string,
    newSession: SessionUpdate,
    agendas?: AgendaCreate[]
  ): Promise<boolean> => {
    try {
      await updateSession(id, newSession, agendas);
      toast.success("Successfully updated session");
      return true;
    } catch (err: any) {
      toast.error(err || "Failed to update session");
      return false;
    }
  };

  const handleDeleteSession = async (id: string): Promise<boolean> => {
    try {
      await deleteSession(id);
      toast.success("Successfully deleted session");
      return true;
    } catch (err: any) {
      toast.error(err || "Failed to delete session");
      return false;
    }
  };

  const getAgendaBySchedule = (sessionId: string) => {
    const sessionAgendas = agendas.filter(
      (agenda) => agenda.session_id === sessionId
    );

    const documentIds = sessionAgendas.map((agenda) => agenda.document_id);

    const sessionDocuments = documents.filter((doc) =>
      documentIds.includes(doc.id)
    );

    return sessionDocuments;
  };

  return {
    sessions,
    agendas,
    loading,
    error,
    handleAddSession,
    handleEditSession,
    handleDeleteSession,
    getAgendaBySchedule,
  };
};

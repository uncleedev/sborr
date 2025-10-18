import { supabase } from "@/lib/supabase";
import {
  AgendaCreate,
  Agenda,
  Session,
  SessionCreate,
  SessionUpdate,
} from "@/types/session-type";

export const sessionService = {
  /* ---------- CREATE ---------- */
  async createSession(
    session: SessionCreate,
    agendas: AgendaCreate[]
  ): Promise<{ sessions: Session[]; agendas: Agenda[] }> {
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .insert([{ ...session }])
      .select("*")
      .order("created_at", { ascending: false });

    if (sessionError)
      throw new Error(sessionError.message || "Failed to create session");

    let agendaData: Agenda[] = [];

    if (sessionData && agendas.length > 0) {
      const session_id = sessionData[0].id;
      const newAgendaData = agendas.map((agenda) => ({
        ...agenda,
        session_id,
      }));

      const { data: insertedAgenda, error: agendaError } = await supabase
        .from("session_documents")
        .insert(newAgendaData)
        .select("*");

      if (agendaError)
        throw new Error(agendaError.message || "Failed to attach documents");

      agendaData = insertedAgenda as Agenda[];
    }

    return { sessions: sessionData as Session[], agendas: agendaData };
  },

  /* ---------- READ ---------- */
  async getAllSession(): Promise<{ sessions: Session[]; agendas: Agenda[] }> {
    const { data: sessionsData, error: sessionsError } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (sessionsError)
      throw new Error(sessionsError.message || "Failed to get all sessions");

    const { data: agendasData, error: agendasError } = await supabase
      .from("session_documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (agendasError)
      throw new Error(agendasError.message || "Failed to get all agendas");

    return {
      sessions: sessionsData as Session[],
      agendas: agendasData as Agenda[],
    };
  },

  /* ---------- UPDATE ---------- */
  async updateSession(
    id: string,
    newSession: SessionUpdate,
    agendas?: AgendaCreate[]
  ): Promise<{ sessions: Session[]; agendas: Agenda[] }> {
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .update([{ ...newSession }])
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });

    if (sessionError)
      throw new Error(sessionError.message || "Failed to update session");

    let agendaData: Agenda[] = [];

    if (agendas && agendas.length > 0) {
      const { error: deleteError } = await supabase
        .from("session_documents")
        .delete()
        .eq("session_id", id);

      if (deleteError)
        throw new Error(
          deleteError.message || "Failed to remove existing session agendas"
        );

      const newAgendaData = agendas.map((agenda) => ({
        ...agenda,
        session_id: id,
      }));
      const { data: insertedAgenda, error: insertError } = await supabase
        .from("session_documents")
        .insert(newAgendaData)
        .select("*");

      if (insertError)
        throw new Error(
          insertError.message || "Failed to update session agendas"
        );

      agendaData = insertedAgenda as Agenda[];
    }

    return { sessions: sessionData as Session[], agendas: agendaData };
  },

  /* ---------- DELETE ---------- */
  async deleteSession(id: string): Promise<Session[]> {
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });

    if (sessionError)
      throw new Error(sessionError.message || "Failed to delete session");

    return sessionData as Session[];
  },

  /* ---------- REAL-TIME SUBSCRIPTION ---------- */
  subscribeToSessions(
    callback: (payload: {
      table: "sessions" | "session_documents";
      eventType: "INSERT" | "UPDATE" | "DELETE";
      new: any;
      old: any;
    }) => void
  ) {
    const sessionChannel = supabase
      .channel("sessions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions" },
        (payload) => {
          callback({
            table: "sessions",
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new,
            old: payload.old,
          });
        }
      )
      .subscribe();

    const agendaChannel = supabase
      .channel("session-documents-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_documents" },
        (payload) => {
          callback({
            table: "session_documents",
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new,
            old: payload.old,
          });
        }
      )
      .subscribe();

    return { sessionChannel, agendaChannel };
  },
};

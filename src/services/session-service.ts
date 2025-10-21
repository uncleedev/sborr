import { supabase } from "@/lib/supabase";
import emailjs from "emailjs-com";
import {
  AgendaCreate,
  Agenda,
  Session,
  SessionCreate,
  SessionUpdate,
} from "@/types/session-type";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;

export const sessionService = {
  /* ---------- CREATE ---------- */
  async createSession(
    session: SessionCreate,
    agendas: AgendaCreate[]
  ): Promise<{ sessions: Session[]; agendas: Agenda[] }> {
    // 1. Insert session
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

    // 2. Fetch all users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, firstname, lastname, email");

    if (usersError) console.error("Failed to fetch users:", usersError);

    // 3. Fetch agenda document titles for this session
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("title")
      .in(
        "id",
        agendaData.map((a) => a.document_id)
      );

    if (docsError) console.error("Failed to fetch document titles:", docsError);

    // 4. Preformat agenda as bullet list
    const agendaList =
      documents?.map((doc) => `• ${doc.title}`).join("<br>") || "";

    // 5. Send email to all users
    if (users && users.length > 0) {
      for (const user of users) {
        try {
          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
              name: `${user.firstname} ${user.lastname}`,
              session_type: session.type,
              session_date: new Date(session.scheduled_at).toLocaleDateString(),
              session_time: new Date(session.scheduled_at).toLocaleTimeString(),
              session_venue: session.venue,
              session_description: session.description || "",
              agendaList, // <-- insert formatted agenda here
              email: user.email,
            },
            PUBLIC_KEY
          );
          console.log(`Email sent to ${user.email}`);
        } catch (err) {
          console.error(`Failed to send email to ${user.email}`, err);
        }
      }
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

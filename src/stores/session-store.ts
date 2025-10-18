import { create } from "zustand";
import {
  Agenda,
  AgendaCreate,
  Session,
  SessionCreate,
  SessionUpdate,
} from "@/types/session-type";
import { sessionService } from "@/services/session-service";
import { supabase } from "@/lib/supabase";

interface SessionState {
  sessions: Session[];
  agendas: Agenda[];
  loading: boolean;
  error: string | null;
  sessionChannel?: ReturnType<typeof supabase.channel>;
  agendaChannel?: ReturnType<typeof supabase.channel>;

  createSession: (
    session: SessionCreate,
    agendas: AgendaCreate[]
  ) => Promise<void>;
  getAllSessions: () => Promise<void>;
  updateSession: (
    id: string,
    newSession: SessionUpdate,
    agendas?: AgendaCreate[]
  ) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  agendas: [],
  loading: false,
  error: null,
  sessionChannel: undefined,
  agendaChannel: undefined,

  /* ---------- CREATE ---------- */
  createSession: async (session, agendas) => {
    set({ loading: true, error: null });
    try {
      await sessionService.createSession(session, agendas);
      get().getAllSessions();
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- READ ---------- */
  getAllSessions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await sessionService.getAllSession();
      set({ sessions: data.sessions, agendas: data.agendas });
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- UPDATE ---------- */
  updateSession: async (id, newSession, agendas) => {
    set({ loading: true, error: null });
    try {
      const data = await sessionService.updateSession(id, newSession, agendas);
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === id ? data.sessions[0] : s
        ),
        agendas: [
          ...state.agendas.filter((a) => a.session_id !== id),
          ...data.agendas,
        ],
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- DELETE ---------- */
  deleteSession: async (id) => {
    set({ loading: true, error: null });
    try {
      await sessionService.deleteSession(id);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        agendas: state.agendas.filter((a) => a.session_id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  /* ---------- REAL-TIME SUBSCRIBE ---------- */
  subscribe: () => {
    const { sessionChannel, agendaChannel } = get();
    if (sessionChannel || agendaChannel) return;

    const {
      sessionChannel: newSessionChannel,
      agendaChannel: newAgendaChannel,
    } = sessionService.subscribeToSessions((payload) => {
      set((state) => {
        if (payload.table === "sessions") {
          let updatedSessions = [...state.sessions];

          switch (payload.eventType) {
            case "INSERT":
              if (!updatedSessions.some((s) => s.id === payload.new.id)) {
                updatedSessions.unshift(payload.new as Session);
              }
              break;
            case "UPDATE":
              updatedSessions = updatedSessions.map((s) =>
                s.id === payload.new.id ? (payload.new as Session) : s
              );
              break;
            case "DELETE":
              updatedSessions = updatedSessions.filter(
                (s) => s.id !== payload.old.id
              );
              break;
          }

          return { sessions: updatedSessions };
        }

        if (payload.table === "session_documents") {
          let updatedAgendas = [...state.agendas];

          switch (payload.eventType) {
            case "INSERT":
              if (!updatedAgendas.some((a) => a.id === payload.new.id)) {
                updatedAgendas.unshift(payload.new as Agenda);
              }
              break;
            case "UPDATE":
              updatedAgendas = updatedAgendas.map((a) =>
                a.id === payload.new.id ? (payload.new as Agenda) : a
              );
              break;
            case "DELETE":
              updatedAgendas = updatedAgendas.filter(
                (a) => a.id !== payload.old.id
              );
              break;
          }

          return { agendas: updatedAgendas };
        }

        return state;
      });
    });

    set({
      sessionChannel: newSessionChannel,
      agendaChannel: newAgendaChannel,
    });
  },

  /* ---------- REAL-TIME UNSUBSCRIBE ---------- */
  unsubscribe: () => {
    const { sessionChannel, agendaChannel } = get();

    if (sessionChannel) supabase.removeChannel(sessionChannel);
    if (agendaChannel) supabase.removeChannel(agendaChannel);

    set({ sessionChannel: undefined, agendaChannel: undefined });
  },
}));

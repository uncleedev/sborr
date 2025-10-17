import { create } from "zustand";
import { Session, SessionCreate, SessionUpdate } from "@/types/session-type";
import { sessionService } from "@/services/session-service";
import { supabase } from "@/lib/supabase";

interface SessionState {
  sessions: Session[] | [];
  loading: boolean;
  error: string | null;
  channel?: ReturnType<typeof supabase.channel>;

  createSession: (session: SessionCreate) => Promise<void>;
  getAllSessions: () => Promise<void>;
  updateSession: (id: string, newSession: SessionUpdate) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  loading: false,
  error: null,
  channel: undefined,

  createSession: async (session) => {
    set({ loading: true, error: null });
    try {
      const data = await sessionService.createSession(session);
      set((state) => ({ sessions: [...data, ...state.sessions] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  getAllSessions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await sessionService.getAllSession();
      set({ sessions: data });
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  updateSession: async (id, newSession) => {
    set({ loading: true, error: null });
    try {
      const updatedSession = await sessionService.updateSession(id, newSession);
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === id ? updatedSession[0] : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  deleteSession: async (id) => {
    set({ loading: true, error: null });
    try {
      await sessionService.deleteSession(id);
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  subscribe: () => {
    if (get().channel) return;

    const channel = supabase
      .channel("sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions" },
        ({ eventType, new: newData, old: oldData }) => {
          // Cast the Supabase payload to Session
          const newSession = newData as Session;
          const oldSession = oldData as Session;

          set((state) => {
            let updatedSessions = [...state.sessions];

            switch (eventType) {
              case "INSERT":
                if (!updatedSessions.some((s) => s.id === newSession.id)) {
                  updatedSessions.unshift(newSession);
                }
                break;

              case "UPDATE":
                updatedSessions = updatedSessions.map((s) =>
                  s.id === newSession.id ? newSession : s
                );
                break;

              case "DELETE":
                updatedSessions = updatedSessions.filter(
                  (s) => s.id !== oldSession.id
                );
                break;
            }

            return { sessions: updatedSessions };
          });
        }
      )
      .subscribe();

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

import { supabase } from "@/lib/supabase";
import { Session, SessionCreate, SessionUpdate } from "@/types/session-type";

export const sessionService = {
  /* ---------- CREATE ---------- */
  async createSession(session: SessionCreate): Promise<Session[]> {
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ ...session }])
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to create session");

    return data as Session[];
  },

  /* ---------- READ ---------- */
  async getAllSession(): Promise<Session[]> {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to get all session");

    return data as Session[];
  },

  /* ---------- UPDATE ---------- */
  async updateSession(
    id: string,
    newSession: SessionUpdate
  ): Promise<Session[]> {
    const { data, error } = await supabase
      .from("sessions")
      .update([{ ...newSession }])
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to update session");

    return data as Session[];
  },

  async deleteSession(id: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message || "Failed to delete session");

    return data as Session[];
  },
};

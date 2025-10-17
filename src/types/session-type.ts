export type SessionType = "regular" | "special";

export type SessionStatus = "draft" | "scheduled" | "ongoing" | "completed";

export interface Session {
  id: string;
  scheduled_at: string;
  type: SessionType;
  status: SessionStatus;
  venue?: string;
  description?: string;

  created_at: string;
}

export type SessionCreate = Omit<Session, "id" | "created_at">;

export type SessionUpdate = Partial<SessionCreate>;

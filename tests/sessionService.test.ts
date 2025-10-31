/// <reference types="vitest" />

import { supabase } from "../src/lib/supabase";
import { sessionService } from "../src/services/session-service";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import emailjs from "emailjs-com";

// ------------------------------
// Mock Supabase
// ------------------------------
vi.mock("../src/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    })),
  },
}));

// ------------------------------
// Mock emailjs-com with default export
// ------------------------------
vi.mock("emailjs-com", () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200 }),
    sendForm: vi.fn().mockResolvedValue({ status: 200 }),
  },
}));

describe("sessionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a session with agendas", async () => {
    const fakeSession = {
      id: "s1",
      type: "regular",
      status: "draft",
      scheduled_at: new Date().toISOString(),
      venue: "Hall",
      description: "Test session",
      created_by: "user1",
      created_at: new Date().toISOString(),
    };

    // Chainable Supabase mock for insert -> select -> order
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [fakeSession], error: null }),
      }),
    });

    const selectMock = vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [fakeSession], error: null }),
    });

    (supabase.from as unknown as Mock).mockImplementation((table: string) => ({
      insert: insertMock,
      select: selectMock,
    }));

    const result = await sessionService.createSession(
      {
        type: fakeSession.type,
        status: fakeSession.status,
        scheduled_at: fakeSession.scheduled_at,
        venue: fakeSession.venue,
        description: fakeSession.description,
        created_by: fakeSession.created_by,
      },
      [{ document_id: "d1" }, { document_id: "d2" }]
    );

    expect(result.sessions[0]).toEqual(fakeSession);
  });

  it("sends session emails", async () => {
    const session = {
      id: "s1",
      type: "regular",
      status: "draft",
      scheduled_at: new Date().toISOString(),
      venue: "Hall",
      description: "Test session",
      created_by: "user1",
      created_at: new Date().toISOString(),
    };

    const agendas = [{ document_id: "d1", session_id: session.id }];

    // Chainable Supabase mock for users and documents
    const fromMock = vi.fn().mockImplementation((tableName: string) => {
      if (tableName === "users") {
        return {
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [
                {
                  firstname: "John",
                  lastname: "Doe",
                  email: "john@example.com",
                  role: "mayor",
                },
              ],
              error: null,
            }),
          }),
        };
      } else if (tableName === "documents") {
        return {
          select: vi.fn().mockReturnValue({
            in: vi
              .fn()
              .mockResolvedValue({ data: [{ title: "Doc 1" }], error: null }),
          }),
        };
      }
      return { select: vi.fn().mockReturnValue({ in: vi.fn(), error: null }) };
    });

    (supabase.from as unknown) = fromMock;

    await sessionService.sendSessionEmails(session, agendas);

    expect(emailjs.send).toHaveBeenCalled();
  });
});

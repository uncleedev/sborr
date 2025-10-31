import { supabase } from "../src/lib/supabase";
import { authService } from "../src/services/auth-service";
import { describe, it, expect, vi, beforeEach } from "vitest";
import emailjs from "emailjs-com";

// ------------------------------
// Mock Supabase
// ------------------------------
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    functions: {
      invoke: vi.fn(),
    },
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

// ------------------------------
// Tests
// ------------------------------
describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in user successfully", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { session: "dummy-session" },
      error: null,
    });

    const data = await authService.signin("test@example.com", "password123");
    expect(data).toEqual({ session: "dummy-session" });
  });

  it("throws error when signin fails", async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    await expect(
      authService.signin("test@example.com", "wrongpassword")
    ).rejects.toThrow("Invalid credentials");
  });

  it("invites user and sends email", async () => {
    (supabase.functions.invoke as any).mockResolvedValue({
      data: { userId: "123" },
      error: null,
    });

    const user = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      role: "councilor",
      password: "secret123",
    };

    const data = await authService.inviteUser(user);
    expect(data).toEqual({ userId: "123" });

    // ✅ Correct way to check emailjs mock
    expect(emailjs.send).toHaveBeenCalled();
  });

  it("signs out user", async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });
    await expect(authService.signout()).resolves.toBeUndefined();
  });
});

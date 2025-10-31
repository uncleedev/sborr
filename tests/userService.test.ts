// tests/userService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "../src/services/user-service";
import { supabase } from "../src/lib/supabase";
import { UserCreate } from "../src/types/user-type";

// ------------------------------
// Mock Supabase with full chain support
// ------------------------------
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({ data: [{ id: "1" }], error: null })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: "1", firstname: "John" },
            error: null,
          })),
        })),
        order: vi.fn(() => ({ data: [{ id: "1" }], error: null })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({ data: [{ id: "1" }], error: null })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({ data: null, error: null })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ error: null })),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: "http://avatar.url" },
        })),
        remove: vi.fn(() => ({ error: null })),
      })),
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => "mockChannel"),
      })),
    })),
  },
}));

// ------------------------------
// Tests
// ------------------------------
describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user without avatar", async () => {
    const user: UserCreate = {
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      role: "councilor",
      bio: "Hello",
    };

    const data = await userService.createUser(user);
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("creates a user with avatar", async () => {
    const user: UserCreate = {
      firstname: "Jane",
      lastname: "Doe",
      email: "jane@example.com",
      role: "secretary",
      bio: "Bio",
    };

    const file = new File(["dummy"], "avatar.png", { type: "image/png" });

    const data = await userService.createUser(user, file);
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("fetches all users", async () => {
    const users = await userService.getAllUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe("1");
  });

  it("fetches user by id", async () => {
    const user = await userService.getUserById("1");
    expect(user).toBeDefined();
    expect(user?.id).toBe("1");
  });

  it("updates a user", async () => {
    const data = await userService.updateUser("1", { firstname: "Updated" });
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("deletes a user", async () => {
    await expect(userService.deleteUser("1")).resolves.toBeUndefined();
  });

  it("deletes a user avatar", async () => {
    await expect(
      userService.deleteAvatar("1", "avatars/john.png")
    ).resolves.toBeUndefined();
  });

  it("subscribes to users", () => {
    const callback = vi.fn();
    const channel = userService.subscribeToUsers(callback);
    expect(channel).toBeDefined();
    expect(channel).toBe("mockChannel");
  });
});

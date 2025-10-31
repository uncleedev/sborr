/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from "vitest";
import { activityService } from "../src/services/activity-service";
import { supabase } from "../src/lib/supabase";
import { ActivityLog } from "../src/types/activity";

// ------------------------------
// Mock Supabase
// ------------------------------
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("activityService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllActivity returns logs successfully", async () => {
    const fakeLogs: ActivityLog[] = [
      {
        id: "1",
        action: "created document",
        performed_by: "user1",
        performed_at: new Date().toISOString(),
      },
      {
        id: "2",
        action: "deleted document",
        performed_by: "user2",
        performed_at: new Date().toISOString(),
      },
    ];

    const orderMock = vi
      .fn()
      .mockResolvedValue({ data: fakeLogs, error: null });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    (supabase.from as unknown as vi.Mock).mockReturnValue({
      select: selectMock,
    });

    const logs = await activityService.getAllActivity();
    expect(logs).toEqual(fakeLogs);
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(orderMock).toHaveBeenCalledWith("performed_at", {
      ascending: false,
    });
  });

  it("throws error if Supabase returns an error", async () => {
    const fakeError = { message: "DB error" };
    const orderMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: fakeError });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    (supabase.from as unknown as vi.Mock).mockReturnValue({
      select: selectMock,
    });

    await expect(activityService.getAllActivity()).rejects.toThrow("DB error");
  });
});

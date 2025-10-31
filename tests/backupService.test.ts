/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from "vitest";
import { BackupService } from "../src/services/backup-service";
import { supabase } from "../src/lib/supabase";

// ------------------------------
// Mock Supabase
// ------------------------------
vi.mock("@/lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        list: vi.fn(),
        createSignedUrl: vi.fn(),
        remove: vi.fn(),
      })),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(),
    })),
  },
}));

// ------------------------------
// Tests
// ------------------------------
describe("BackupService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createBackup downloads backup successfully", async () => {
    const fakeUrl = "https://example.com/backup.json";
    const fakeFileName = "backup.json";
    const blobContent = new Blob([JSON.stringify({ test: 123 })], {
      type: "application/json",
    });

    (supabase.functions.invoke as any).mockResolvedValue({
      data: { url: fakeUrl, fileName: fakeFileName },
      error: null,
    });

    // Mock fetch to return blob
    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(blobContent),
    } as any);

    // Mock document.createElement
    const clickMock = vi.fn();
    const appendMock = vi.fn();
    const removeMock = vi.fn();
    const linkMock: any = {
      click: clickMock,
      remove: removeMock,
      href: "",
      download: "",
    };
    vi.spyOn(document, "createElement").mockReturnValue(linkMock);
    vi.spyOn(document.body, "appendChild").mockImplementation(appendMock);

    const result = await BackupService.createBackup();
    expect(result).toEqual({
      success: true,
      message: "Backup downloaded successfully!",
    });
    expect(clickMock).toHaveBeenCalled();
    expect(appendMock).toHaveBeenCalled();
    expect(removeMock).toHaveBeenCalled();
  });

  it("listBackups returns files", async () => {
    const mockList = vi.fn().mockResolvedValue({
      data: [{ name: "backup1.json" }, { name: "backup2.json" }],
      error: null,
    });
    (supabase.storage.from as any).mockReturnValue({ list: mockList });

    const files = await BackupService.listBackups();
    expect(files.length).toBe(2);
    expect(files[0].name).toBe("backup1.json");
  });

  it("getSignedUrl returns URL", async () => {
    const mockSignedUrl = vi.fn().mockResolvedValue({
      data: { signedUrl: "https://signed.url/backup.json" },
      error: null,
    });
    (supabase.storage.from as any).mockReturnValue({
      createSignedUrl: mockSignedUrl,
    });

    const url = await BackupService.getSignedUrl("backup.json");
    expect(url).toBe("https://signed.url/backup.json");
  });

  it("deleteBackup calls Supabase remove", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ error: null });
    (supabase.storage.from as any).mockReturnValue({ remove: mockRemove });

    await BackupService.deleteBackup("backup.json");
    expect(mockRemove).toHaveBeenCalledWith(["backup.json"]);
  });

  it("restoreBackup merges backup successfully", async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ upsert: upsertMock });

    const fakeFile = new File(
      [JSON.stringify({ users: [{ id: "1", name: "John" }] })],
      "backup.json",
      { type: "application/json" }
    );

    const result = await BackupService.restoreBackup(fakeFile);
    expect(result).toEqual({
      success: true,
      message: "Backup merged successfully!",
    });

    // Expect upsert called for "users" table
    expect(upsertMock).toHaveBeenCalled();
  });

  it("restoreBackup returns error on invalid JSON", async () => {
    const fakeFile = new File(["invalid-json"], "backup.json", {
      type: "application/json",
    });
    const result = await BackupService.restoreBackup(fakeFile);
    expect(result.success).toBe(false);
    expect(result.message).toContain("Unexpected token");
  });
});

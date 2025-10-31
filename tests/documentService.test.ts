// tests/documentService.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { documentService } from "../src/services/document-service";
import { supabase } from "../src/lib/supabase";
import {
  DocumentCreate,
  DocumentUpdate,
  Document,
} from "../src/types/document-type";

// ------------------------------
// Mock Supabase with full chain support
// ------------------------------
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [
              {
                id: "1",
                type: "ordinance",
                status: "draft",
                title: "Test Doc",
                author_name: "John Doe",
                series: "2025-01",
                approved_by: null,
                approved_at: null,
                description: "Test document",
                file_path: "documents/test-file.pdf",
                file_url: "http://file.url",
                file_name: "test-file.pdf",
                created_by: "admin",
                created_at: new Date().toISOString(),
              },
            ],
            error: null,
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: "1",
              type: "ordinance",
              status: "draft",
              title: "Test Doc",
              author_name: "John Doe",
              series: "2025-01",
              approved_by: null,
              approved_at: null,
              description: "Test document",
              file_path: "documents/test-file.pdf",
              file_url: "http://file.url",
              file_name: "test-file.pdf",
              created_by: "admin",
              created_at: new Date().toISOString(),
            },
            error: null,
          })),
        })),
        order: vi.fn(() => ({
          data: [
            {
              id: "1",
              type: "ordinance",
              title: "Test Doc",
              created_by: "admin",
              created_at: new Date().toISOString(),
            },
          ],
          error: null,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: "1" },
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [{ id: "1" }],
              error: null,
            })),
          })),
        })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "http://file.url" } })),
        remove: vi.fn(() => ({ error: null })),
      })),
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => "mockDocumentChannel"),
      })),
    })),
  },
}));

// ------------------------------
// Tests
// ------------------------------
describe("documentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a document without file", async () => {
    const doc: DocumentCreate = {
      type: "ordinance",
      status: "draft",
      title: "Test Doc",
      author_name: "John Doe",
      series: "2025-01",
      created_by: "admin",
    };
    const data = await documentService.createDocument(doc);
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("creates a document with file", async () => {
    const doc: DocumentCreate = {
      type: "ordinance",
      status: "draft",
      title: "Test Doc",
      author_name: "John Doe",
      series: "2025-01",
      created_by: "admin",
    };
    const file = new File(["dummy"], "file.pdf", { type: "application/pdf" });
    const data = await documentService.createDocument(doc, file);
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("fetches all documents", async () => {
    const docs = await documentService.getAllDocuments();
    expect(docs).toHaveLength(1);
    expect(docs[0].id).toBe("1");
  });

  it("updates a document without new file", async () => {
    const update: DocumentUpdate = {
      title: "Updated Doc",
      status: "for_review",
    };
    const data = await documentService.updateDocument("1", update);
    expect(data).toBeDefined();
    expect(data.id).toBe("1");
  });

  it("updates a document with new file", async () => {
    const update: DocumentUpdate = {
      title: "Updated Doc",
      status: "for_review",
    };
    const file = new File(["dummy"], "new-file.pdf", {
      type: "application/pdf",
    });
    const data = await documentService.updateDocument("1", update, file);
    expect(data).toBeDefined();
    expect(data.id).toBe("1");
  });

  it("deletes a document without file path", async () => {
    const data = await documentService.deleteDocument("1");
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("deletes a document with file path", async () => {
    const data = await documentService.deleteDocument(
      "1",
      "documents/test-file.pdf"
    );
    expect(data).toBeDefined();
    expect(data[0].id).toBe("1");
  });

  it("subscribes to documents", () => {
    const callback = vi.fn();
    const channel = documentService.subscribeToDocuments(callback);
    expect(channel).toBeDefined();
    expect(channel).toBe("mockDocumentChannel");
  });
});

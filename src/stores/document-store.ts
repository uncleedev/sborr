import { create } from "zustand";
import {
  Document,
  DocumentCreate,
  DocumentUpdate,
} from "@/types/document-type";
import { documentService } from "@/services/document-service";
import { supabase } from "@/lib/supabase";

interface DocumentState {
  documents: Document[] | [];
  loading: boolean;
  error: string | null;
  channel?: ReturnType<typeof supabase.channel>;

  createDocument: (document: DocumentCreate, file?: File) => Promise<void>;
  getAllDocuments: () => Promise<void>;
  updateDocument: (
    id: string,
    newDocument: DocumentUpdate,
    newFile?: File
  ) => Promise<void>;
  deleteDocument: (id: string, filepath: string) => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  loading: false,
  error: null,
  channel: undefined,

  createDocument: async (document, file) => {
    set({ loading: true, error: null });
    try {
      await documentService.createDocument(document, file);
      get().getAllDocuments();
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  getAllDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await documentService.getAllDocuments();
      set({ documents: data });
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  updateDocument: async (id, newDocument, newFile) => {
    set({ loading: true, error: null });
    try {
      const updatedDoc = await documentService.updateDocument(
        id,
        newDocument,
        newFile
      );
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? updatedDoc : doc
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err.message;
    } finally {
      set({ loading: false });
    }
  },

  deleteDocument: async (id, filepath) => {
    set({ loading: true, error: null });
    try {
      await documentService.deleteDocument(id, filepath);
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
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

    const channel = documentService.subscribeToDocuments(
      ({ eventType, new: newDoc, old }) => {
        set((state) => {
          let updatedDocs = [...state.documents];

          switch (eventType) {
            case "INSERT":
              if (!updatedDocs.some((d) => d.id === newDoc.id)) {
                updatedDocs.unshift(newDoc);
              }
              break;

            case "UPDATE":
              updatedDocs = updatedDocs.map((d) =>
                d.id === newDoc.id ? newDoc : d
              );
              break;

            case "DELETE":
              updatedDocs = updatedDocs.filter((d) => d.id !== old.id);
              break;
          }

          return { documents: updatedDocs };
        });
      }
    );

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

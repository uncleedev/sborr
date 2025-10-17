import { create } from "zustand";
import {
  Document,
  DocumentCreate,
  DocumentUpdate,
} from "@/types/document-type";
import { documentService } from "@/services/document-service";

interface DocumentState {
  documents: Document[] | [];
  loading: boolean;
  error: string | null;

  createDocument: (document: DocumentCreate, file?: File) => Promise<void>;
  getAllDocuments: () => Promise<void>;
  updateDocument: (
    id: string,
    newDocument: DocumentUpdate,
    newFile?: File
  ) => Promise<void>;

  deleteDocument: (id: string, filepath: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  loading: false,
  error: null,

  createDocument: async (document, file) => {
    set({ loading: true, error: null });
    try {
      const data = await documentService.createDocument(document, file);
      set((state) => ({
        documents: [...data, ...state.documents],
      }));
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
}));

import { supabase } from "@/lib/supabase";
import {
  Document,
  DocumentCreate,
  DocumentUpdate,
} from "@/types/document-type";

export const documentService = {
  /* ---------- CREATE ---------- */
  async createDocument(
    document: DocumentCreate,
    file?: File
  ): Promise<Document[]> {
    let fileData: {
      file_url?: string;
      file_path?: string;
      file_name?: string;
    } = {};

    if (file) {
      const filename = `${document.type}-${file.name}`;
      const filepath = `${document.type}/${filename}`;

      const { error } = await supabase.storage
        .from("documents")
        .upload(filepath, file, { upsert: true });
      if (error) throw new Error(error.message || "Failed to upload file");

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(filepath);
      fileData = {
        file_url: data.publicUrl,
        file_path: filepath,
        file_name: file.name,
      };
    }

    const { data, error } = await supabase
      .from("documents")
      .insert([{ ...document, ...fileData }])
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message || "Failed to create document");
    return data as Document[];
  },

  /* ---------- READ ---------- */
  async getAllDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message || "Failed to get all documents");
    return data as Document[];
  },

  /* ---------- UPDATE ---------- */
  async updateDocument(
    id: string,
    newDocument: DocumentUpdate,
    newFile?: File
  ): Promise<Document> {
    let fileData: {
      file_url?: string;
      file_path?: string;
      file_name?: string;
    } = {};

    const { data: existingDocs, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchError || !existingDocs)
      throw new Error(fetchError?.message || "Document not found");

    const oldFilepath = existingDocs.file_path;

    if (newFile) {
      const filename = `${newDocument.type}-${newFile.name}`;
      const filepath = `${newDocument.type}/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filepath, newFile, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicData } = supabase.storage
        .from("documents")
        .getPublicUrl(filepath);
      fileData = {
        file_url: publicData.publicUrl,
        file_path: filepath,
        file_name: newFile.name,
      };

      if (oldFilepath && oldFilepath !== filepath) {
        const { error: deleteError } = await supabase.storage
          .from("documents")
          .remove([oldFilepath]);
        if (deleteError)
          console.warn("Failed to delete old file:", deleteError.message);
      }
    }

    const { data, error } = await supabase
      .from("documents")
      .update({ ...newDocument, ...fileData })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message || "Failed to update document");
    return data as Document;
  },

  /* ---------- DELETE ---------- */
  async deleteDocument(id: string, filepath?: string): Promise<Document[]> {
    if (filepath) {
      const { error } = await supabase.storage
        .from("documents")
        .remove([filepath]);
      if (error)
        throw new Error(error.message || "Failed to remove document file");
    }

    const { data, error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message || "Failed to delete document");
    return data as Document[];
  },

  /* ---------- REAL-TIME SUBSCRIPTION ---------- */
  subscribeToDocuments(
    callback: (payload: {
      eventType: "INSERT" | "UPDATE" | "DELETE";
      new: any;
      old: any;
    }) => void
  ) {
    const channel = supabase
      .channel("documents-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        (payload) => {
          callback({
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new,
            old: payload.old,
          });
        }
      )
      .subscribe();

    return channel;
  },
};

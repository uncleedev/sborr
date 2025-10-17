import { useEffect } from "react";
import { useDocumentStore } from "@/stores/document-store";
import { DocumentCreate, DocumentUpdate } from "@/types/document-type";
import { toast } from "sonner";

export const useDocument = () => {
  const {
    documents,
    loading,
    error,
    getAllDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    subscribe,
    unsubscribe,
  } = useDocumentStore();

  useEffect(() => {
    getAllDocuments();
    subscribe();

    return () => unsubscribe();
  }, []);

  const handleAddDocument = async (document: DocumentCreate, file?: File) => {
    try {
      await createDocument(document, file);
      toast.success("Successfully added document");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  const handleEditDocument = async (
    id: string,
    newDocument: DocumentUpdate,
    newFile?: File
  ) => {
    try {
      await updateDocument(id, newDocument, newFile);
      toast.success("Successfully updated document");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  const handleDeleteDocument = async (id: string, filepath: string) => {
    try {
      await deleteDocument(id, filepath);
      toast.success("Successfully deleted document");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  return {
    documents,
    loading,
    error,
    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
  };
};

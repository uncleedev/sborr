import { useDocumentStore } from "@/stores/document-store";
import { DocumentCreate, DocumentUpdate } from "@/types/document-type";
import { useEffect } from "react";
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
  } = useDocumentStore();

  useEffect(() => {
    getAllDocuments();
  }, []);

  const handleAddDocument = async (
    document: DocumentCreate,
    file?: File
  ): Promise<boolean> => {
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
  ): Promise<boolean> => {
    try {
      await updateDocument(id, newDocument, newFile);
      toast.success("Successfully updated document");
      return true;
    } catch (error: any) {
      toast.error(error);
      return false;
    }
  };

  const handleDeleteDocument = async (
    id: string,
    filepath: string
  ): Promise<boolean> => {
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
    getAllDocuments,
    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
  };
};

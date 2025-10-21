import { useEffect, useState } from "react";
import { useDocumentStore } from "@/stores/document-store";
import {
  Document,
  DocumentCreate,
  DocumentStatus,
  DocumentUpdate,
} from "@/types/document-type";
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

  const [forReviewDocuments, setForReviewDocuments] = useState<Document[]>([]);
  const [archivedDocuments, setArchivedDocuments] = useState<Document[]>([]);
  const [ordinanceDocuments, setOrdinaceDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      await getAllDocuments();
    };

    fetchDocuments();
    subscribe();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const forReview = documents.filter(
      (document) => document.status === "for_review"
    );
    setForReviewDocuments(forReview);

    const archived = documents.filter(
      (document) => document.status === "archived"
    );
    setArchivedDocuments(archived);

    const ordinances = documents.filter(
      (documents) => documents.type === "ordinance"
    );

    setOrdinaceDocuments(ordinances);
  }, [documents]);

  const getArchivedDocuments = (): Document[] => {
    return documents.filter((document) => document.status === "archived");
  };

  const handleAddDocument = async (document: DocumentCreate, file?: File) => {
    try {
      await createDocument(document, file);
      toast.success("Successfully added document");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to add document");
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
      toast.error(error.message || "Failed to update document");
      return false;
    }
  };

  const handleDeleteDocument = async (id: string, filepath: string) => {
    try {
      await deleteDocument(id, filepath);
      toast.success("Successfully deleted document");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete document");
      return false;
    }
  };

  const handleDocumentStatus = async (
    id: string,
    status: DocumentStatus
  ): Promise<boolean> => {
    try {
      await updateDocument(id, { status });
      toast.success("Successfully updated document status");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
      return false;
    }
  };

  return {
    documents,
    loading,
    error,

    forReviewDocuments,
    archivedDocuments,
    getArchivedDocuments,
    ordinanceDocuments,

    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
    handleDocumentStatus,
  };
};

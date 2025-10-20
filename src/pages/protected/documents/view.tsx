"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "@/types/document-type";
import { useUser } from "@/hooks/useUser";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
}

export default function ViewDocument({ open, onClose, document }: Props) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  const { getUserName } = useUser();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        {document ? (
          <>
            <DialogHeader>
              <DialogTitle>{document.title}</DialogTitle>
              <DialogDescription>
                View detailed information about this document.
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[400px] mt-2">
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Author:</strong> {document.author_name}
                </p>
                <p>
                  <strong>Type:</strong> {document.type}
                </p>
                <p>
                  <strong>Series:</strong> {document.series}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{document.status}</span>
                </p>
                {document.approved_by && (
                  <p>
                    <strong>Approved By:</strong> {document.approved_by}
                  </p>
                )}
                {document.approved_at && (
                  <p>
                    <strong>Approved At:</strong>{" "}
                    {new Date(document.approved_at).toLocaleString()}
                  </p>
                )}
                {document.description && (
                  <p>
                    <strong>Description:</strong> {document.description}
                  </p>
                )}
                {document.file_url && (
                  <p>
                    <strong>Attachment:</strong>{" "}
                    <a
                      href={document.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View File
                    </a>
                  </p>
                )}
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(document.created_at).toLocaleString()}
                </p>

                <p>
                  <strong>Created By:</strong>{" "}
                  {getUserName(document.created_by)}
                </p>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

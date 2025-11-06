import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Document } from "@/types/document-type";
import { formatDateWithOrdinal } from "@/lib/utils";

interface ViewDocumentProps {
  document: Document;
}

export default function ViewDocument({ document }: ViewDocumentProps) {
  return (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button title="View document" variant="outline" size="sm">
          <Eye className="size-4" />
          View
        </Button>
      </DialogTrigger>

      {/* Scrollable Dialog */}
      <DialogContent
        className="
          max-w-4xl 
          w-full 
          max-h-[90vh] 
          overflow-y-auto 
          p-0
          rounded-xl
        "
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-primary leading-snug">
            {document.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {document.description || "No description provided."}
          </DialogDescription>
        </DialogHeader>

        {/* Body — everything scrolls together */}
        <div className="p-6 space-y-4 text-sm">
          <p>
            <strong>Type:</strong> {document.type}
          </p>
          <p>
            <strong>Series:</strong> {document.series}
          </p>
          <p>
            <strong>Author:</strong> {document.author_name}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {formatDateWithOrdinal(document.created_at)}
          </p>

          {document.approved_by && (
            <p>
              <strong>Approved by:</strong> {document.approved_by}
            </p>
          )}
          {document.approved_at && (
            <p>
              <strong>Approved at:</strong>{" "}
              {formatDateWithOrdinal(document.approved_at)}
            </p>
          )}

          {/* PDF Viewer */}
          {document.file_url ? (
            <div className="mt-6 border rounded-lg overflow-hidden shadow-sm">
              <iframe
                src={document.file_url}
                title={document.title}
                className="w-full h-[80vh]"
                style={{ border: "none" }}
              />
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No file attached for this document.
            </p>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0 border-t bg-background sticky bottom-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

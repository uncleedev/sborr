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
import { ScrollArea } from "../ui/scroll-area";
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
        <Button title="View document">
          <Eye className="size-4" />
          View
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-primary">
            {document.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {document.description || "No description provided."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 mt-4 border-t">
          <div className="p-6 space-y-3 text-sm">
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

            {/* ✅ Approved Info (No icons, simple text) */}
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
                  className="w-full h-[600px]"
                  title={document.title}
                />
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No file attached for this document.
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocument } from "@/hooks/useDocument";
import { Document } from "@/types/document-type";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
}

export default function DeleteDocument({ open, onClose, document }: Props) {
  if (!document) return null;

  const { handleDeleteDocument } = useDocument();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    const success = await handleDeleteDocument(
      document.id,
      document.file_path || ""
    );
    if (success) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              You are about to delete <strong>{document.title}</strong> <br />
              <span className="text-red-500 font-semibold">
                This cannot be undone!
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>

            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Deleting.." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

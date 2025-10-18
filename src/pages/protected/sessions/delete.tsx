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
import { useSession } from "@/hooks/useSession";
import { Session } from "@/types/session-type";
import { formatDateWithOrdinal } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export default function DeleteSession({ open, onClose, session }: Props) {
  if (!session) return null;

  const { handleDeleteSession } = useSession();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    const success = await handleDeleteSession(session.id);
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
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              You are about to delete this session scheduled on{" "}
              <strong>{formatDateWithOrdinal(session.scheduled_at)}</strong>.
              <br />
              <span className="text-red-500 font-semibold">
                This action cannot be undone!
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>

            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

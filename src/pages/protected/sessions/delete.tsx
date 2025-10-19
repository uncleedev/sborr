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
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export default function DeleteSession({ open, onClose, session }: Props) {
  const { handleDeleteSession } = useSession();
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async () => {
    if (!session) return;

    try {
      const success = await handleDeleteSession(session.id);
      if (success) {
        toast.success("Session deleted successfully.");
        reset();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete session.");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {session ? (
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
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Session"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

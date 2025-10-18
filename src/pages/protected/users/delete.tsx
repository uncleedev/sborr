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
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user-type";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export default function DeleteUser({ open, onClose, user }: Props) {
  if (!user) return null;

  const { handleDeleteUser } = useUser();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    const success = await handleDeleteUser(user.id);
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              You are about to delete{" "}
              <strong>
                {user.firstname} {user.lastname}
              </strong>{" "}
              ({user.email})
              <br />
              <span className="text-red-500 font-semibold">
                This action cannot be undone!
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Close
              </Button>
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

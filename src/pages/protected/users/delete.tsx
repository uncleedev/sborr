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
import { User } from "@/types/user-type";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

interface FormValues {}

export default function DeleteUser({ open, onClose, user }: Props) {
  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>();

  const onSubmit = async () => {
    if (!user) return;

    try {
      await authService.deleteUser(user.id);
      toast.success("User deleted successfully.");
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
      setError("root", { message: err.message || "Failed to delete user" });
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
        {user ? (
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
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete User"}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

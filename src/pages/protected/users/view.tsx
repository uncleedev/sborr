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
import { User } from "@/types/user-type";
import { formatDateWithOrdinal } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ViewUser({ open, onClose, user }: Props) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {user.firstname} {user.lastname}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this user.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] mt-2">
          <div className="space-y-3 text-sm">
            <p>
              <strong>Full Name:</strong> {user.firstname} {user.lastname}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <span className="capitalize">{user.role.replace("_", " ")}</span>
            </p>
            {user.bio && (
              <p>
                <strong>Bio:</strong> {user.bio}
              </p>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {formatDateWithOrdinal(user.created_at)}
            </p>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

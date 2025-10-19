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
import { Calendar, Mail, UserCircle2, Shield } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ViewUser({ open, onClose, user }: Props) {
  if (!user) return null;

  const avatarUrl =
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=random`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          {/* ✅ Avatar */}
          <div className="flex justify-center mb-4">
            <img
              src={avatarUrl}
              alt={`${user.firstname} ${user.lastname}`}
              className="w-28 h-28 rounded-full border object-cover"
            />
          </div>

          {/* ✅ Name + Role */}
          <DialogTitle className="text-xl font-semibold">
            {user.firstname} {user.lastname}
          </DialogTitle>
          <DialogDescription>
            {user.role
              ? user.role
                  .replace("_", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "No role assigned"}
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Scrollable Info Section */}
        <ScrollArea className="max-h-[380px] px-1">
          <div className="space-y-4 text-sm text-muted-foreground">
            {/* Email */}
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="flex items-start gap-2">
                <UserCircle2 className="w-4 h-4 text-primary mt-1" />
                <p>
                  <strong>Bio:</strong> {user.bio}
                </p>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p>
                <strong>Created At:</strong>{" "}
                {formatDateWithOrdinal(user.created_at)}
              </p>
            </div>

            {/* ID or Role */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* ✅ Footer */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { Session } from "@/types/session-type";
import { formatDateWithOrdinal } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export default function ViewSession({ open, onClose, session }: Props) {
  const { getAgendaBySchedule } = useSession();

  if (!session) return null;

  const agendas = getAgendaBySchedule(session.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Session</DialogTitle>
          <DialogDescription>View details of this session </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <strong>Type:</strong>{" "}
            <span className="capitalize">{session.type}</span>
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{session.status}</span>
          </div>
          <div>
            <strong>Date:</strong> {formatDateWithOrdinal(session.scheduled_at)}
          </div>
          <div>
            <strong>Time:</strong>{" "}
            {new Date(session.scheduled_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div>
            <strong>Venue:</strong> {session.venue || "-"}
          </div>
          <div>
            <strong>Description:</strong> {session.description || "-"}
          </div>

          <div>
            <strong>Agendas:</strong>
            {agendas.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-1">
                No agendas found.
              </p>
            ) : (
              <ul className="list-disc list-inside mt-1">
                {agendas.map((agenda) => (
                  <li key={agenda.id}>{agenda.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocument } from "@/hooks/useDocument";
import { DocumentStatus } from "@/types/document-type";

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export default function ViewSession({ open, onClose, session }: Props) {
  const { getAgendaBySchedule } = useSession();
  const { handleDocumentStatus } = useDocument();

  const agendas = session ? getAgendaBySchedule(session.id) : [];

  const handleStatusChange = async (
    agendaId: string,
    newStatus: DocumentStatus
  ) => {
    await handleDocumentStatus(agendaId, newStatus);
  };

  const canEditStatus =
    session?.status === "ongoing" || session?.status === "completed";

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        {session ? (
          <>
            <DialogHeader>
              <DialogTitle>View Session</DialogTitle>
              <DialogDescription>
                View details of this session
              </DialogDescription>
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
                <strong>Date:</strong>{" "}
                {formatDateWithOrdinal(session.scheduled_at)}
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
                  <ul className="space-y-2 mt-2">
                    {agendas.map((agenda) => (
                      <li
                        key={agenda.id}
                        className="flex items-center justify-between gap-4 border rounded-lg p-3"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate">
                            {agenda.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Current:{" "}
                            {(
                              agenda.status.charAt(0).toUpperCase() +
                              agenda.status.slice(1)
                            ).replace("_", " ")}
                          </span>
                        </div>

                        {canEditStatus && (
                          <Select
                            defaultValue={agenda.status || "approved"}
                            onValueChange={(value) =>
                              handleStatusChange(
                                agenda.id,
                                value as DocumentStatus
                              )
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="approved">
                                  Approved
                                </SelectItem>
                                <SelectItem value="rejected">
                                  Rejected
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

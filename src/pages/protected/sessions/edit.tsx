import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "@/hooks/useSession";
import { useDocument } from "@/hooks/useDocument";
import { Session, SessionUpdate, AgendaCreate } from "@/types/session-type";
import { SELECT_SESSION_TYPE } from "@/constants/select-item";

const sessionSchema = z.object({
  type: z.enum(["regular", "special"], { message: "Type is required" }),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof sessionSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session | null;
}

export default function EditSession({ open, onClose, session }: Props) {
  const { handleEditSession, getAgendaBySchedule } = useSession();
  const { forReviewDocuments } = useDocument();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      type: "regular",
      date: "",
      time: "",
      venue: "",
      description: "",
    },
  });

  // Populate form when session changes
  useEffect(() => {
    if (!session) return;

    const dateObj = new Date(session.scheduled_at);
    const date = dateObj.toISOString().split("T")[0];
    const time = dateObj.toTimeString().slice(0, 5);

    reset({
      type: session.type,
      date,
      time,
      venue: session.venue || "",
      description: session.description || "",
    });

    const agendaDocs = getAgendaBySchedule(session.id).map((doc) => doc.id);
    setSelectedDocs(agendaDocs);
  }, [session, reset]);

  const handleCheckbox = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (!session) return;

    const scheduled_at = new Date(`${data.date}T${data.time}`).toISOString();

    const updatedSession: SessionUpdate = {
      type: data.type,
      scheduled_at,
      venue: data.venue,
      description: data.description,
    };

    const agendas: AgendaCreate[] = selectedDocs.map((docId) => ({
      document_id: docId,
      session_id: session.id,
    }));

    const success = await handleEditSession(
      session.id,
      updatedSession,
      agendas
    );
    if (success) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Edit the session details and attached documents
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Session Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {SELECT_SESSION_TYPE.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <span className="text-destructive text-sm">
                  {errors.type.message}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && (
                <span className="text-destructive text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" {...register("time")} />
              {errors.time && (
                <span className="text-destructive text-sm">
                  {errors.time.message}
                </span>
              )}
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input {...register("venue")} />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>

            {/* Documents */}
            <div className="space-y-2">
              <Label>Attach Documents (For Review)</Label>
              {forReviewDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => handleCheckbox(doc.id)}
                  />
                  <span>{doc.title}</span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

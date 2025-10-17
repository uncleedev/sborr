import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "@/hooks/useSession";
import { SessionCreate } from "@/types/session-type";
import { SELECT_SESSION_TYPE } from "@/constants/select-item";

const sessionSchema = z.object({
  type: z.enum(["regular", "special"], { message: "Type is required" }),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof sessionSchema>;

export default function AddSession() {
  const { handleAddSession } = useSession();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    reset,
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

  const onSubmit = async (data: FormValues) => {
    const scheduled_at = new Date(`${data.date}T${data.time}`).toISOString();

    const newSession: SessionCreate = {
      type: data.type,
      scheduled_at,
      venue: data.venue,
      description: data.description,
      status: "scheduled",
    };

    const success = await handleAddSession(newSession);
    if (success) {
      reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span className="font-semibold">Add Session</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Session</DialogTitle>
          <DialogDescription>Add new session schedule</DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && (
                <span className="text-destructive text-sm">
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" {...register("time")} />
              {errors.time && (
                <span className="text-destructive text-sm">
                  {errors.time.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Venue</Label>
              <Input {...register("venue")} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Save..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

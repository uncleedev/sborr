import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";
import { useSession } from "@/hooks/useSession";

interface CardCalendarProps {
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
}

export default function CardCalendar({
  selected,
  onSelect,
}: CardCalendarProps) {
  const { sessions } = useSession();

  // Helper: find a session matching a specific date
  const getSessionByDate = (date: Date) =>
    sessions.find(
      (s) => new Date(s.scheduled_at).toDateString() === date.toDateString()
    );

  // Avoid highlighting selected days that already have a status modifier
  const filteredSelected =
    selected && !getSessionByDate(selected) ? selected : undefined;

  return (
    <Card className="p-3 lg:col-span-2">
      <div className="w-full flex flex-col gap-4">
        <header>
          <h2 className="font-semibold text-lg">Session Calendar</h2>
          <p className="text-muted-foreground text-sm">
            Click a date to view session details or check status colors.
          </p>
        </header>

        <div className="w-full flex items-center justify-center">
          <Calendar
            mode="single"
            selected={filteredSelected}
            onSelect={onSelect}
            captionLayout="dropdown"
            className="w-full"
            modifiers={{
              draft: (date) => getSessionByDate(date)?.status === "draft",
              scheduled: (date) =>
                getSessionByDate(date)?.status === "scheduled",
              ongoing: (date) => getSessionByDate(date)?.status === "ongoing",
              completed: (date) =>
                getSessionByDate(date)?.status === "completed",
            }}
            modifiersClassNames={{
              draft: "bg-gray-300 text-gray-800 !important",
              scheduled: "bg-blue-500 text-white !important",
              ongoing: "bg-yellow-500 text-white !important",
              completed: "bg-green-500 text-white !important",
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-gray-300"></span> Draft
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500"></span> Scheduled
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-yellow-500"></span> Ongoing
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-500"></span> Completed
          </div>
        </div>
      </div>
    </Card>
  );
}

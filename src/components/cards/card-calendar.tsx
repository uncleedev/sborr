import { Calendar } from "../ui/calendar";
import { Card } from "../ui/card";

interface CardCalendarProps {
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
}

export default function CardCalendar({
  selected,
  onSelect,
}: CardCalendarProps) {
  return (
    <Card className="p-3 lg:col-span-2">
      <div className="w-full flex flex-col gap-4">
        <header>
          <h2>Session Calendar</h2>
          <p className="text-muted-foreground">Upcoming session & event.</p>
        </header>

        <div className="w-full flex items-center justify-center">
          <Calendar
            mode="single"
            required={false}
            selected={selected}
            onSelect={onSelect}
            captionLayout="dropdown"
            className="w-full "
          />
        </div>
      </div>
    </Card>
  );
}

import { useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

import { Calendar } from "@/components/ui/calendar-rac";

export default function OrigCalendar() {
  const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));

  return (
    <div>
      <Calendar
        className="rounded-md border p-2"
        value={date}
        onChange={setDate}
      />
    </div>
  );
}

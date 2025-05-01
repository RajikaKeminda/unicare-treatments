import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";

export default function DateElement({
  date,
  onDateChange,
}: {
  date?: Date;
  onDateChange: (date?: Date) => void;
}) {
  return (
    <div>
      <Popover
        onOpenChange={(open) => {
          if (open) {
            const calendarGrid = document.querySelector(
              "[role='grid']"
            ) as HTMLElement | null;
            calendarGrid?.focus();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal px-[12px] py-0 h-8",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {date ? format(date, "yyyy-MM-dd") : <span>Pick a Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-none">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate: Date | undefined) => {
              onDateChange(selectedDate);
            }}
            className="w-[280px] border rounded-md shadow-md p-2"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

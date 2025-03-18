import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { channel } from "@/helpers/validation/channel-schema";
import { JSX, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";

const allowedDates = [
  new Date("2023-01-01"),
  new Date("2023-01-15"),
  new Date("2025-04-16"),
  new Date("2025-03-01"),
  new Date("2025-03-10"),
  new Date("2025-03-20"),
  new Date("2025-04-01"),
  new Date("2025-05-05"),
];

export default function DateElement({
  form,
  icon,
  label,
}: {
  form: channel;
  label: string;
  icon?: JSX.Element;
}) {
  const [date, setDate] = useState<Date>();
  const isDateAllowed = (date: Date) => {
    return allowedDates.some(
      (allowedDate) => allowedDate.toDateString() === date.toDateString()
    );
  };
  return (
    <FormField
      control={form.control}
      name="appointmentDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium flex items-center gap-2 min-h-[20px]">
            {icon && icon} {label}
          </FormLabel>
          <FormControl>
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
                    "w-full justify-start text-left font-normal px-[12px] py-0",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-none">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate: Date | undefined) => {
                    if (selectedDate && isDateAllowed(selectedDate)) {
                      setDate(selectedDate);
                      field.onChange(selectedDate);
                    }
                  }}
                  disabled={(day) => !isDateAllowed(day)}
                  className="w-[280px] border rounded-md shadow-md p-2"
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

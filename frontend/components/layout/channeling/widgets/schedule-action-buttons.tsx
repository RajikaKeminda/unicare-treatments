import { first, second, third } from "@/helpers/data/time.data";
import { Button } from "@/shadcn/ui/button";
import { TimeSlot } from "@/types/channeling";

export default function ScheduleActionButtons({
  isDisabled,
  setFirstSession,
  setSecondSession,
  setThirdSession,
}: {
  isDisabled: boolean;
  setFirstSession: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  setSecondSession: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  setThirdSession: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
}) {
  return (
    <>
      <Button
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;
          setFirstSession((prev) =>
            prev.map((item) => ({ ...item, isActive: true }))
          );
          setSecondSession((prev) =>
            prev.map((item) => ({ ...item, isActive: true }))
          );
          setThirdSession((prev) =>
            prev.map((item) => ({ ...item, isActive: true }))
          );
        }}
      >
        Select All Sessions
      </Button>
      <Button
        disabled={isDisabled}
        variant="outline"
        className="border-black border-2"
        onClick={() => {
          if (isDisabled) return;
          // TODO: handle this if a user has selected a session
          setFirstSession(first);
          setSecondSession(second);
          setThirdSession(third);
        }}
      >
        Deselect All Sessions
      </Button>
    </>
  );
}

import { TimeSlot } from "@/types/channeling";

export const getDataFiltered = (data: TimeSlot[]) => {
  const active = data.filter((slot) => slot.isActive === true);
  const index = active.findIndex((slot) => !slot.appointmentId);
  if (index < 0) {
    return undefined;
  }
  return {
    start: active[index].start,
    end: active[index].end,
    number: (index + 1).toString(),
  };
};

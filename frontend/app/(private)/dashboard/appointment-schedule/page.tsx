"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  format,
  isAfter,
  isSameDay,
  parse,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { Calendar } from "@/shadcn/ui/calendar";
import { first, second, third } from "@/helpers/data/time.data";
import { Button } from "@/shadcn/ui/button";
import { toast } from "sonner";
import { apiService } from "@/libs/api";
import type {
  ChannelingResponse,
  ChannelingWithDates,
  TimeSlot,
} from "@/types/channeling";
import { Loader2 } from "lucide-react";
import SessionCol from "@/channeling/widgets/session-col";
import ScheduleActionButtons from "@/channeling/widgets/schedule-action-buttons";
import { FaCalendar } from "react-icons/fa";

type SetAction = Dispatch<SetStateAction<TimeSlot[]>>;

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());
  const [firstSession, setFirstSession] = useState<TimeSlot[]>(first);
  const [secondSession, setSecondSession] = useState<TimeSlot[]>(second);
  const [thirdSession, setThirdSession] = useState<TimeSlot[]>(third);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Date[]>([]);

  const handleSessionClick = (session: SetAction, timeIndex: number) => {
    if (isDisabled) return;
    session((prev) =>
      prev.map((item, i) => ({
        ...item,
        isActive: i === timeIndex ? !item.isActive : item.isActive,
      }))
    );
  };

  const [totalCount, firstCount, secondCount, thirdCount] = useMemo(() => {
    const firstTotal = firstSession.filter((time) => time.isActive).length;
    const secondTotal = secondSession.filter((time) => time.isActive).length;
    const thirdTotal = thirdSession.filter((time) => time.isActive).length;
    const total = firstTotal + secondTotal + thirdTotal;
    return [total, firstTotal, secondTotal, thirdTotal];
  }, [firstSession, secondSession, thirdSession]);

  const isANewDay = useMemo(() => {
    const today = new Date();
    return isSameDay(date, today) || isAfter(date, startOfDay(today));
  }, [date]);

  const isDisabled = !isANewDay || loading;

  const getData = async (selectedDate: Date) => {
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await apiService.get<ChannelingResponse>(
        `/channeling/${formattedDate}`
      );
      if (response.channeling) {
        const { channelingSlots } = response.channeling;
        setFirstSession([...channelingSlots[0]]);
        setSecondSession([...channelingSlots[1]]);
        setThirdSession([...channelingSlots[2]]);
      } else {
        setFirstSession([...first]);
        setSecondSession([...second]);
        setThirdSession([...third]);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAllActive = async () => {
    try {
      // const formattedDate = format(new Date(), "yyyy-MM-dd");
      const firstDayOfMonth = startOfMonth(new Date());
      const formattedDate = format(firstDayOfMonth, "yyyy-MM-dd");
      const response = await apiService.get<ChannelingWithDates>(
        `/channeling/active/${formattedDate}`
      );
      const convertedDates = response.dates.map((dateStr) =>
        parse(dateStr, "yyyy-MM-dd", new Date())
      );
      setCompleted(convertedDates);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([getData(new Date()), getAllActive()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const createChanneling = async () => {
    try {
      if (totalCount === 0) return;
      setLoading(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      const newData = await apiService.post<ChannelingResponse>(`/channeling`, {
        channelingDate: formattedDate,
        channelingSlots: [firstSession, secondSession, thirdSession],
        currentDate: format(new Date(), "yyyy-MM-dd"),
      });

      const convertedDates = (newData?.dates || []).map((dateStr) =>
        parse(dateStr, "yyyy-MM-dd", new Date())
      );
      setCompleted(convertedDates);
      toast.success("Updated successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white py-5 px-10 min-h-svh ">
      <div className="relative flex items-start text-indigo-950 gap-5 w-full mb-4">
        <div className="relative border-2 border-black bg-black flex-none shadow-md rounded-xl">
          <div className="flex items-center justify-center p-2 text-white gap-2">
            <FaCalendar />
            <span className="text-center ">
              {format(date, "do")} of {format(date, "LLLL")},{" "}
              {format(date, "yyyy")}
            </span>
          </div>
          <div className="rounded-br-xl rounded-bl-xl bg-white flex gap-2.5 p-2.5">
            <SessionCol
              sessionTitle="First Session"
              session={firstSession}
              clickHandler={(index) => {
                handleSessionClick(setFirstSession, index);
              }}
              count={firstCount}
              isDisabled={isDisabled}
              onSelect={(active: boolean) => {
                if (isDisabled) return;
                setFirstSession((prev) =>
                  prev.map((item) => {
                    if (item.appointmentId) return item;
                    return { ...item, isActive: active };
                  })
                );
              }}
              // blockFirst={<BlockedTime start="00.00" end="08.00" />}
              // blockedEnd={<BlockedTime start="12.00" end="14.00" />}
            />
            <SessionCol
              sessionTitle="Second Session"
              session={secondSession}
              clickHandler={(index) => {
                handleSessionClick(setSecondSession, index);
              }}
              count={secondCount}
              isDisabled={isDisabled}
              onSelect={(active: boolean) => {
                if (isDisabled) return;
                setSecondSession((prev) =>
                  prev.map((item) => {
                    if (item.appointmentId) return item;
                    return { ...item, isActive: active };
                  })
                );
              }}
              // blockedEnd={<BlockedTime start="18.00" end="20.00" />}
            />
            <SessionCol
              sessionTitle="Third Session"
              session={thirdSession}
              clickHandler={(index) => {
                handleSessionClick(setThirdSession, index);
              }}
              count={thirdCount}
              isDisabled={isDisabled}
              onSelect={(active: boolean) => {
                if (isDisabled) return;
                setThirdSession((prev) =>
                  prev.map((item) => {
                    if (item.appointmentId) return item;
                    return { ...item, isActive: active };
                  })
                );
              }}
              // blockedEnd={<BlockedTime start="22.00" end="24.00" />}
            />
          </div>
          {loading && (
            <div className="absolute inset-0  flex items-center justify-center text-black">
              <Loader2 className="animate-spin w-10 h-10" />
            </div>
          )}
          <div className="ribbon bg-gray-300 text-black">
            Total: {totalCount}
          </div>
        </div>
        <div className="flex-auto flex flex-col gap-2">
          <Calendar
            mode="single"
            selected={date}
            holidays={completed}
            onSelect={(selectedDate: Date | undefined) => {
              if (selectedDate) {
                getData(selectedDate);
                setDate(selectedDate);
              }
            }}
            className="w-[280px] rounded-xl shadow-md p-2 border-black border-2"
          />
          <div className="flex flex-col gap-2 max-w-[280px]">
            <ScheduleActionButtons
              isDisabled={isDisabled}
              setFirstSession={setFirstSession}
              setSecondSession={setSecondSession}
              setThirdSession={setThirdSession}
            />
            <Button
              disabled={isDisabled}
              onClick={createChanneling}
              className="w-full"
            >
              Save
              {loading && <Loader2 className="animate-spin" />}
            </Button>
          </div>
          {/* <div className="max-w-[280px]">
            <p>
              <span className="text-red-500 font-semibold">Note:</span> You can
              use <b>&quot;Select All&quot;</b> or{" "}
              <b>&quot;Deselect All&quot;</b>.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

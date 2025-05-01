"use client";
import Link from "next/link";
import AppointmentCard from "@/channeling/widgets/appointment-card";
import { useEffect, useState } from "react";
import { apiService } from "@/libs/api";
import { AppointmentResponse } from "@/types/appointment";
import { IUser } from "@/types/users";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/shadcn/ui/button";

export default function StepFinalState({
  appointmentId,
  userDetails,
  amount,
}: {
  appointmentId: string;
  userDetails?: IUser;
  amount: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [data, setData] = useState({
    reference: "",
    date: "",
    startingTime: "",
    endingTime: "",
    doctorName: "",
    sessionNumber: 0,
  });
  useEffect(() => {
    const getData = async () => {
      const response = await apiService.get<AppointmentResponse>(
        `/appointments/all/${appointmentId}`
      );
      setData({
        reference: appointmentId,
        date: response?.appointment?.channelingDate || "",
        startingTime: response?.appointment?.startingTime || "",
        endingTime: response?.appointment?.endingTime || "",
        doctorName: response?.appointment?.doctorName || "",
        sessionNumber: response?.appointment?.sessionNumber || 0,
      });
    };
    getData();
  }, [appointmentId]);
  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10 ">
      <div className="flex flex-col gap-2 items-center">
        <div className="text-2xl font-bold text-gray-800 text-center">
          Thank you for your payment!
        </div>
        <p>Your appointment details are available here.</p>
      </div>
      <AppointmentCard
        reference={data.reference}
        amount={amount}
        date={data.date}
        time={`Session ${data.sessionNumber} (${data.startingTime} - ${data.endingTime})`}
        name={`${userDetails?.firstName} ${userDetails?.lastName}`}
        doctorName={data.doctorName}
        contentRef={contentRef}
      />
      <div className="flex gap-4">
        <Link
          href={"/channeling/upload-lab-reports"}
          className="bg-black text-white px-5 py-2 rounded-md"
        >
          Upload Your Lab Reports
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            reactToPrintFn();
          }}
        >
          Print or Save Receipt
        </Button>
      </div>
    </div>
  );
}

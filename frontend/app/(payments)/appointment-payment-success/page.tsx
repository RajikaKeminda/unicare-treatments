"use client";
import Link from "next/link";
import AppointmentCard from "@/channeling/widgets/appointment-card";
import { use, useEffect, useState } from "react";
import { apiService } from "@/libs/api";
import { AppointmentResponse } from "@/types/appointment";
import { IUser, UserApiResponse } from "@/types/users";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/shadcn/ui/button";
import { lkrToCents } from "@/utils/common";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const searchParams = use(props.searchParams);
  const appointmentId = searchParams?.appointmentId as string;
  const userId = searchParams?.userId as string;
  const [userDetails, setUserDetails] = useState<IUser>();

  const [data, setData] = useState({
    paymentAmount: 560,
    reference: "",
    date: "",
    startingTime: "",
    endingTime: "",
    doctorName: "",
    sessionNumber: 0,
  });

  const amount = +(data?.paymentAmount || 560);
  const paymentInCent = lkrToCents(amount);

  useEffect(() => {
    const getData = async () => {
      const response = await apiService.get<AppointmentResponse>(
        `/appointments/all/${appointmentId}`
      );
      setData({
        paymentAmount: response?.appointment?.paymentAmount || 560,
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

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!userId) return;
      const response = await apiService.get<UserApiResponse>(
        `/users/${userId}`
      );
      setUserDetails(response.user);
    };
    fetchUserAppointments();
  }, [userId]);

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
        amount={paymentInCent}
        date={data.date}
        time={`Session ${data.sessionNumber} (${data.startingTime} - ${data.endingTime})`}
        name={`${userDetails?.firstName} ${userDetails?.lastName}`}
        doctorName={data.doctorName}
        contentRef={contentRef}
      />
      <div className="flex gap-4">
        <Link
          href={"/channeling/view-my-appointments"}
          className="bg-black text-white px-5 py-2 rounded-md"
        >
          View Appointments
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

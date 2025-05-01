"use client";

import ChannelDateStep from "@/channeling/ui/steps/step-calendar";

import StepPayment from "@/channeling/ui/steps/step-payment";
import StepsHeader from "@/channeling/widgets/steps-header";
import StepFinalState from "@/channeling/ui/steps/step-final-state";
import StepPersonalDetails from "@/channeling/ui/steps/step-personal-details";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { usePatient } from "@/utils/get-user";
import { useStep } from "@/utils/set-step";
import { AppointmentDetails } from "@/types/channeling";
import { lkrToCents } from "@/utils/common";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ChannelAppointment(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const numSteps = 3;
  const amount = lkrToCents(560);
  const searchParams = use(props.searchParams);
  const [appointmentId, setAppointmentId] = useState("");
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetails>({
      session: 0,
      channelingDate: "",
    });
  const [date, setDate] = useState<Date | null>(null);
  const { form, userId, userDetails } = usePatient();
  const { stepsComplete, handleSetStep, updateUser } = useStep(
    searchParams,
    numSteps,
    userId
  );

  return (
    <div className=" bg-white py-5 px-10 border-t-2 border-black border-dashed">
      <div className="flex items-center justify-between mb-5">
        <Link href="/channeling" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          Appointment Center
        </Link>
      </div>
      <StepsHeader numSteps={numSteps} stepsComplete={stepsComplete} />
      <div className="py-8 pb-10 px-4 my-4 bg-gray-400/10 border-2 border-dashed border-black rounded-lg">
        <div className="flex flex-col gap-4 justify-center items-center">
          {stepsComplete === 0 && (
            <StepPersonalDetails form={form} updateUser={updateUser} />
          )}
          {stepsComplete === 1 && (
            <ChannelDateStep
              handleSetStep={handleSetStep}
              date={date}
              setDate={setDate}
              userId={userId}
              makePayment={(id) => {
                setAppointmentId(id);
              }}
              amount={amount}
              setAppointmentDetails={setAppointmentDetails}
            />
          )}
          {stepsComplete === 2 && (
            <StepPayment
              handleSetStep={handleSetStep}
              date={date ? date.toDateString() : ""}
              appointmentId={appointmentId}
              userDetails={userDetails}
              appointmentDetails={appointmentDetails}
              amount={amount}
            />
          )}
          {stepsComplete === 3 && (
            <StepFinalState
              appointmentId={appointmentId}
              userDetails={userDetails}
              amount={amount}
            />
          )}
        </div>
      </div>
    </div>
  );
}

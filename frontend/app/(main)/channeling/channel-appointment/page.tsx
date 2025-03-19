import ChannelAppointmentForm from "@/channeling/forms/ChannelAppointmentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChannelAppointment() {
  return (
    <div className=" bg-gray-100 py-5 px-10">
      <div className="w-full hidden md:block">
        <Link href="/channeling" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          Appointment Center
        </Link>
      </div>
      <div className="flex flex-col gap-5 justify-center items-center mt-5 md:mt-0">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-5 md:mb-0">
          Make an Appointment
        </h1>
        <ChannelAppointmentForm />
      </div>
    </div>
  );
}

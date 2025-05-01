import QRCode from "react-qr-code";
import Image from "next/image";
import { RefObject } from "react";
import { centsToLKR } from "@/utils/common";
export default function AppointmentCard({
  reference,
  amount,
  date,
  time,
  name,
  doctorName,
  contentRef,
}: {
  reference: string;
  amount: number;
  date: string;
  time: string;
  doctorName: string;
  name: string;
  contentRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="flex flex-col items-center gap-2 bg-white p-4 border-dotted border-2 border-black print:h-[420px] print:w-full"
      ref={contentRef}
    >
      <Image
        alt="logo"
        width={200}
        height={100}
        src="/assets/images/logo.svg"
        className="text-black mb-2 w-100"
      />
      <div className="flex gap-5">
        <div className="h-auto max-w-16 w-full">
          {reference && reference.trim().length > 0 ? (
            <QRCode
              size={256}
              className="h-auto max-w-full w-full"
              value={reference}
              viewBox={`0 0 256 256`}
            />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100"></div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div>
            <span className="font-bold">Patient Name:</span> {name}
          </div>
          <div>
            <span className="font-bold">Reference ID:</span> {reference}
          </div>
          <div>
            <span className="font-bold">Amount Paid:</span> Rs.
            {centsToLKR(amount)}
          </div>
          <div>
            <span className="font-bold">Date:</span> {date}
          </div>
          <div>
            <span className="font-bold">Time:</span> {time}
          </div>
          <div>
            <span className="font-bold">Doctor:</span> {doctorName}
          </div>
        </div>
      </div>
    </div>
  );
}

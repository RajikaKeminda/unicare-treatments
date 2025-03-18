"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckOngoingNumber() {
  return (
    <div className=" bg-gray-100 py-5 px-10">
      <div className="w-full">
        <Link href="/channeling" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
          Appointment Center
        </Link>
      </div>
      <div className="flex flex-col gap-5 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Check Ongoing Number
        </h1>
        <div className="min-h-svh">
          <p className="text-gray-600">This page will be updated ..</p>
        </div>
      </div>
    </div>
  );
}

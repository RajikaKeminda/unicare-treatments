"use client";

import { getColumns } from "@/channeling/ui/columns/admin-column";
import { DataTable } from "@/channeling/ui/tables/appointment-table";
import { generateReport } from "@/channeling/widgets/generate-report";
import { apiService } from "@/libs/api";
import { Button } from "@/shadcn/ui/button";
import { AppointmentResponse, IAppointment } from "@/types/appointment";
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState({
    ref: "",
    item: "",
  });

  const refreshPage = () => {
    getData();
  };

  const sendPaymentNotification = async (
    appointmentId: string,
    email: string,
    userId: string
  ) => {
    try {
      setLoading({
        ref: appointmentId,
        item: "payment",
      });
      const response = await apiService.post(`/appointments/payment/request`, {
        appointmentId: appointmentId,
        email: email,
        userId: userId,
      });
      if (!response.success) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      toast.success("Payment request sent successfully.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading({
        ref: "",
        item: "",
      });
    }
  };

  const getData = async () => {
    const response = await apiService.get<AppointmentResponse>(
      `/appointments/patient`
    );
    if (response.success) {
      setData(response?.appointments || []);
    }
  };

  const columns = getColumns(refreshPage, sendPaymentNotification, loading);

  useEffect(() => {
    getData();
  }, []);

  const url = useMemo(() => generateReport(data), [data]);

  return (
    <div className=" bg-white py-5 px-5 w-full min-h-svh md:w-[calc(100vw-260px)] mx-auto">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          All Appointments <Stethoscope className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={data}>
          <Link href={url} download>
            <Button size="sm" className="ml-auto hidden h-8 lg:flex">
              CSV
            </Button>
          </Link>
        </DataTable>
      </div>
    </div>
  );
}

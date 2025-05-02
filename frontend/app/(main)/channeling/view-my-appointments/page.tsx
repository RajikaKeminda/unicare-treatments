"use client";

import { DataTable } from "@/channeling/ui/tables/appointment-table";
import { getColumns } from "@/channeling/ui/columns/patient-column";
import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import { AppointmentResponse, IAppointment } from "@/types/appointment";
import { apiService } from "@/libs/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, PlusIcon } from "lucide-react";

export default function ViewAppointment() {
  const [data, setData] = useState<IAppointment[]>([]);
  const { data: session } = useSession();
  const user = session?.user;

  const getData = async () => {
    const response = await apiService.get<AppointmentResponse>(
      `/appointments/patient/${user?.id}`
    );
    if (response.success) {
      setData(response?.appointments || []);
    }
  };

  const columns = getColumns(user?.id || "");

  useEffect(() => {
    if (user?.id) {
      getData();
    }
  }, [user?.id]);

  return (
    <div className=" bg-white py-5 px-10 min-h-svh border-t-2 border-black border-dashed">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          My Appointments <Stethoscope className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={data} onlyRef>
          <>
            <Link
              href="/channeling"
              className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8  rounded-md px-3"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
              <div className="flex items-center gap-[4px]">
                <span className="inline md:hidden">Back</span>
                <span className="hidden md:inline">Appointment Center</span>
              </div>
            </Link>
            <Link
              href="/channeling/channel-appointment"
              className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3"
            >
              <PlusIcon className="h-4 w-4 text-gray-600" />
              Add
            </Link>
          </>
        </DataTable>
      </div>
    </div>
  );
}

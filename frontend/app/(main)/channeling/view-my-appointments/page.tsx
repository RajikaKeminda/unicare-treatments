"use client";

import { DataTable } from "@/components/layout/channeling/tables/my-appointments";
import { IAppointment } from "@/types/index";
import { columns } from "@/components/layout/channeling/tables/columns";
import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import { AppointmentResponse } from "@/types/users";
import { apiService } from "@/libs/api";
import { useSession } from "next-auth/react";

export default function ViewAppointment() {
  const [data, setData] = useState<IAppointment[]>([]);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const getData = async () => {
      const response = await apiService.get<AppointmentResponse>(
        `/appointments/patient/${user?.id}`
      );
      if (response.success) {
        setData(response?.appointments || []);
      }
    };

    if (user?.id) {
      getData();
    }

    // setData();
  }, [user?.id]);

  return (
    <div className=" bg-white py-5 px-10 min-h-svh">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          My Appointments <Stethoscope className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}

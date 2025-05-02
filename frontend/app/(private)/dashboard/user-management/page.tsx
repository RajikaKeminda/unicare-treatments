"use client";

import { getColumns } from "@/channeling/ui/columns/user-column";
import { useEffect, useMemo, useRef, useState } from "react";
import { UserIcon } from "lucide-react";
import { apiService } from "@/libs/api";
import { DataTable } from "@/channeling/ui/tables/user-table";
import { IUser, UserApiResponse } from "@/types/users";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session?.user]);
  const initialFetchDone = useRef(false);

  const getData = async () => {
    try {
      const response = await apiService.get<UserApiResponse>(`/users`);
      if (response.success) {
        setAllUsers(response?.users || []);
      }
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const refreshPage = () => {
    getData();
  };

  const columns = getColumns(refreshPage);

  useEffect(() => {
    if (user && !initialFetchDone.current) {
      initialFetchDone.current = true;
      getData();
    }
  }, [user]);

  return (
    <div className=" bg-white py-5 px-5 w-full min-h-svh md:w-[calc(100vw-260px)] mx-auto">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-4">
          System Users <UserIcon className="h-8 w-8 text-black" />
        </h1>
        <DataTable columns={columns} data={allUsers}></DataTable>
      </div>
    </div>
  );
}

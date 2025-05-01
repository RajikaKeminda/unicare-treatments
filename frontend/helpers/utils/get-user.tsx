"use client";
import { apiService } from "@/libs/api";
import {
  channelAppointmentSchema,
  TChannelSchema,
} from "@/schemas/channel-schema";
import { IUser, UserApiResponse } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const usePatient = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [userDetails, setUserDetails] = useState<IUser>();
  const form = useForm<TChannelSchema>({
    resolver: zodResolver(channelAppointmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "other",
      maritalState: "single",
      phoneNumber: "",
      email: "",
      address: "",
      //   channelingDate: undefined,
    },
  });

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!user?.id) return;
      const response = await apiService.get<UserApiResponse>(
        `/users/${user?.id}`
      );

      const formattedDate = response.user?.dateOfBirth
        ? new Date(response.user?.dateOfBirth || "").toISOString().split("T")[0]
        : "";

      form.reset({
        ...form.getValues(),
        email: response.user?.email,
        gender: response.user?.gender || "other",
        maritalState: response.user?.maritalState || "single",
        firstName: response.user?.firstName || "",
        lastName: response.user?.lastName || "",
        ...(response.user?.dateOfBirth && {
          dateOfBirth: formattedDate,
        }),
        ...(response.user?.phoneNumber && {
          phoneNumber: response.user?.phoneNumber || "",
        }),
        ...(response.user?.address && {
          address: response.user?.address || "",
        }),
      });
      setUserDetails(response.user);
    };
    fetchUserAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    form,
    userId: user?.id,
    userDetails,
  };
};

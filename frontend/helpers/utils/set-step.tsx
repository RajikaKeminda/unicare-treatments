"use client";
import { apiService } from "@/libs/api";
import { TChannelSchema } from "@/schemas/channel-schema";
import { AppointmentResponse } from "@/types/appointment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SearchParams = {
  step?: string;
};

export const useStep = (
  searchParams: SearchParams,
  numSteps: number,
  userId?: string | null
) => {
  const [stepsComplete, setStepsComplete] = useState(0);

  useEffect(() => {
    if (searchParams?.step) {
      const step = Number(searchParams.step);
      if (step >= 0 && step <= numSteps) {
        setStepsComplete(step);
      } else {
        setStepsComplete(0);
      }
    }
  }, [searchParams, numSteps]);

  const handleSetStep = (num: -1 | 1) => {
    if (
      (stepsComplete === 0 && num === -1) ||
      (stepsComplete === numSteps && num === 1)
    ) {
      return;
    }
    setStepsComplete((pv) => pv + num);
  };

  const updateUser = async (values: TChannelSchema) => {
    try {
      if (userId) {
        const response = await apiService.put<AppointmentResponse>(
          `/users/${userId}`,
          { ...values }
        );
        if (response.success) {
          handleSetStep(1);
        } else {
          toast.error("Something went wrong, try again");
        }
      } else {
        toast.error("Something went wrong, try again");
      }
    } catch {
      toast.error("Something went wrong, try again");
    }
  };

  return {
    stepsComplete,
    setStepsComplete,
    handleSetStep,
    updateUser,
  };
};

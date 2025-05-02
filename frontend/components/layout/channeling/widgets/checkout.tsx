"use client";

import { centsToLKR } from "@/utils/common";
import { apiService } from "@/libs/api";
import { Button } from "@/shadcn/ui/button";
import { AppointmentResponse } from "@/types/appointment";
import { IUser } from "@/types/users";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { toast } from "sonner";

export default function CheckoutPage({
  userId = "",
  amount,
  currency,
  handleSetStep,
  appointmentId,
  userDetails,
}: {
  userId?: string;
  amount: number;
  currency: string;
  handleSetStep?: (num: -1 | 1) => void;
  appointmentId: string;
  userDetails?: IUser;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const updateAppointment = async (id: string) => {
    try {
      await apiService.put<AppointmentResponse>(
        `/appointments/update/${appointmentId}`,
        {
          sendEmailReceipt: true,
          email: userDetails?.email,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`,
          paymentId: id,
          paymentStatus: "completed",
          appointmentStatus: "waiting",
          paymentAmount: centsToLKR(amount),
        }
      );
    } catch {
      toast.error("An error occurred while updating the appointment.");
    } finally {
      setLoading(false);
      if (handleSetStep) {
        handleSetStep(1);
      } else {
        redirect(
          `/appointment-payment-success?appointmentId=${appointmentId}&userId=${userId}`
        );
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!stripe || !elements) {
        return;
      }
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message);
        setErrorMessage(submitError.message);
        setLoading(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: "if_required",
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_FE_DOMAIN_NAME}/channeling/channel-appointment?amount=${amount}&step=3&ref=${appointmentId}`,
        },
      });

      if (error) {
        toast.error(error.message);
        setErrorMessage(error.message);
      } else {
        toast.success("Payment successful!");
        updateAppointment(paymentIntent.id);
      }
    } catch {
      setLoading(false);
      toast.error("An error occurred while processing the payment.");
    }
  };

  useEffect(() => {
    try {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          appointmentId: appointmentId,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => {
          toast.error("Failed to fetch client secret");
          setErrorMessage("Failed to fetch client secret");
        });
    } catch {
      toast.error("Failed to fetch client secret");
    }
  }, [amount, appointmentId, currency]);

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleFormSubmit}>
      {clientSecret && <PaymentElement />}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
      <Button className="mt-2 w-full text-base" disabled={!stripe || loading}>
        <FaCreditCard />
        {!loading ? `Pay ${centsToLKR(amount)}` : "Processing..."}
      </Button>
    </form>
  );
}

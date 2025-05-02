"use client";

import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/channeling/widgets/checkout";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { IUser, UserApiResponse } from "@/types/users";
import { use, useEffect, useState } from "react";
import { apiService } from "@/libs/api";
import { AppointmentResponse, IAppointment } from "@/types/appointment";
import { lkrToCents } from "@/utils/common";

const sessionArr = ["Session 1", "Session 2", "Session 3"];

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = use(props.searchParams);
  const appointmentId = searchParams?.appointmentId as string;
  const userId = searchParams?.userId as string;
  const [appointmentDetails, setAppointmentDetails] = useState<IAppointment>();
  const amount = +(appointmentDetails?.paymentAmount || 560);
  const paymentInCent = lkrToCents(amount);
  const [userDetails, setUserDetails] = useState<IUser>();
  const currency = "lkr";

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
  );
  if (stripePromise === null) {
    throw new Error("Stripe promise is null");
  }
  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!userId) return;
      const response = await apiService.get<UserApiResponse>(
        `/users/${userId}`
      );
      setUserDetails(response.user);
    };
    fetchUserAppointments();
  }, [userId]);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!appointmentId) return;
      const response = await apiService.get<AppointmentResponse>(
        `/appointments/all/${appointmentId}`
      );
      setAppointmentDetails(response.appointment);
    };
    fetchUserAppointments();
  }, [appointmentId]);

  return (
    <div className="flex flex-col min-h-[488px] items-center justify-center gap-10">
      <div>
        <div className="flex flex-col  justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 text-center flex items-center gap-2 mb-1">
            Thank you for selecting
          </h1>
          <Image
            alt="logo"
            width={200}
            height={100}
            src="/assets/images/logo.svg"
            className="text-black mb-2 w-100"
          />
          <p className=" text-gray-800 text-center">
            Please pay <b>Rs.{amount}</b> to confirm your appointment.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        <div className="bg-white/90 shadow-md rounded-lg border-2 border-black flex-none  p-4 flex justify-center gap-4">
          <div className="flex flex-col  justify-between items-center">
            <div>
              <div>
                <b>Patient: </b>
                {userDetails?.firstName} {userDetails?.lastName}
              </div>
              <div>
                <b>Date: </b>
                {appointmentDetails?.channelingDate}
              </div>
              <div>
                <b>Time Slot: </b>
                {appointmentDetails && (
                  <>
                    {appointmentDetails.sessionNumber === 1
                      ? sessionArr[0]
                      : appointmentDetails.sessionNumber === 2
                        ? sessionArr[1]
                        : sessionArr[2]}{" "}
                    {"("}
                    {appointmentDetails.startingTime} {"-"}{" "}
                    {appointmentDetails.endingTime}
                    {")"}
                  </>
                )}
              </div>
              <div></div>
            </div>
            <div className="w-[300px] h-[200px]">
              <DotLottieReact
                src="/assets/images/payment.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              currency: currency,
              amount: paymentInCent,
              // paymentMethodTypes: ["card"],
            }}
          >
            <CheckoutPage
              amount={paymentInCent}
              currency={currency}
              appointmentId={appointmentId}
              userDetails={userDetails}
              userId={userId}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}

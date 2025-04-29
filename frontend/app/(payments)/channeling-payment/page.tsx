"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "@/components/layout/channeling/stripe/checkout";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Page() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
  );
  if (stripePromise === null) {
    throw new Error("Stripe promise is null");
  }
  const amount = 500; // 20 => 0.20 cents
  return (
    <div className="flex justify-center items-center px-4 pt-7 min-h-svh">
      <div className="bg-white/90 shadow-md rounded-lg border-2 border-black flex-none  p-4 flex justify-center flex-col items-center max-w-[400px]">
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
          Your next step is to pay, {amount}LKR
        </p>
        <div className="w-[300px] h-[200px]">
          <DotLottieReact src="/assets/images/payment.lottie" loop autoplay />
        </div>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            currency: "usd",
            amount: amount,
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </div>
    </div>
  );
}

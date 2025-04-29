import Link from "next/link";

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ amount: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          LKR{resolvedSearchParams.amount}
        </div>
      </div>
      <Link
        href={"/channeling/view-my-appointments"}
        className="bg-black text-white px-5 py-2 rounded-md"
      >
        Go Back
      </Link>
    </main>
  );
}

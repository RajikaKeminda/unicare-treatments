import FeatureCard from "@/components/layout/channeling/cards/FeatureCard";

import Image from "next/image";

export default function ChannelingPage() {
  return (
    <div className="min-h-screen bg-white border-t-2 border-black border-dashed">
      <div className="container mx-auto px-4 pt-4 pb-24">
        <div className="relative flex align-center justify-center mb-2">
          <Image
            src="/assets/images/uniform.jpg"
            width="200"
            height="300"
            alt="uniform"
          />
          <div className="absolute left-0 bottom-0  w-full h-[50px] bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome To Appointment Center
          </h1>
          <p className="mt-4 text-lg text-gray-600 text-balance">
            Experience world-class treatment with our comprehensive channeling
            services. Manage appointments, upload lab reports, and stay informed
            with real-time updates — all in one place.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
          <FeatureCard
            title="Make an Appointment"
            description="Connect seamlessly with top healthcare professionals."
            imageUrl="/assets/images/doctor.jpg"
            href="/channeling/channel-appointment"
          />
          <FeatureCard
            title="Upload LAB Reports"
            description="Easily upload and view your lab results online."
            imageUrl="/assets/images/lab.jpg"
            href="/channeling/upload-lab-reports"
          />
          <FeatureCard
            title="My Appointments"
            description="Manage and review your upcoming appointments."
            imageUrl="/assets/images/appointments.jpg"
            href="/channeling/view-my-appointments"
          />
          <FeatureCard
            title="Check Ongoing Number"
            description="Monitor your current queue status in real time."
            imageUrl="/assets/images/number.jpg"
            href="/channeling/check-ongoing-number"
          />
          <FeatureCard
            title="Locate Me"
            description="Monitor your current queue status in real time."
            imageUrl="/assets/images/location.jpg"
            href="/channeling/locate-me"
          />
          <FeatureCard
            title="My Treatments"
            description="Monitor your current queue status in real time."
            imageUrl="/assets/images/my-treatment.jpg"
            href="/channeling/upload-lab-reports"
          />
        </div>
      </div>
    </div>
  );
}

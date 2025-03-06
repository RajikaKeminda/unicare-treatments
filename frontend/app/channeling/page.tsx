"use client";

import FeatureCard from "@/components/ui/cards/FeatureCard";
import { useRouter } from 'next/navigation'



export default function ChannelingPage() {

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Welcome To Unicare Treatment
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Experience world-class treatment with our comprehensive channeling
            services. Manage appointments, upload lab reports, and stay informed
            with real-time updates—all in one place.
          </p>
        </header>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Channeling"
            description="Connect seamlessly with top healthcare professionals."
            onClick={() => router.push('/channeling/channel-appointment')}
          />
          <FeatureCard
            title="Upload LAB Reports"
            description="Easily upload and view your lab results online."
            onClick={() => router.push('/channeling/upload-lab-report')}
          />
          <FeatureCard
            title="My Appointments"
            description="Manage and review your upcoming appointments."
            onClick={() => router.push('/channeling/view-my-appointments')}
          />
          <FeatureCard
            title="Check Ongoing Number"
            description="Monitor your current queue status in real time."
            onClick={() => router.push('/channeling/check-ongoing-number')}
          />
        </div>
      </div>
    </div>
  );
}


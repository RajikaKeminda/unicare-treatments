'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Treatment {
  _id: string;
  patientName: string;
  treatment: string;
  diagnosis: string;
  status: string;
  startDate: string;
  endDate: string;
  medicines: string;
  yogaExercises: string;
  notes: string;
}

interface AvailableTreatment {
  title: string;
  description: string;
  benefits: string[];
}

const availableTreatments: AvailableTreatment[] = [
  {
    title: "Abhyanga (Ayurvedic Massage)",
    description: "Traditional full-body massage using warm herbal oils",
    benefits: [
      "Reduces stress and anxiety",
      "Improves blood circulation"
    ]
  },
  {
    title: "Shirodhara",
    description: "Continuous flow of warm oil on the forehead",
    benefits: [
      "Calms the mind",
      "Reduces stress"
    ]
  },
  {
    title: "Panchakarma",
    description: "Complete detoxification and rejuvenation therapy",
    benefits: [
      "Deep detoxification",
      "Restores body balance"
    ]
  },
  {
    title: "Nasya",
    description: "Nasal administration of herbal oils",
    benefits: [
      "Clears nasal passages",
      "Improves breathing"
    ]
  },
  {
    title: "Kati Basti",
    description: "Specialized treatment for lower back pain",
    benefits: [
      "Relieves back pain",
      "Reduces stiffness"
    ]
  },
  {
    title: "Udvartana",
    description: "Herbal powder massage for body toning",
    benefits: [
      "Improves skin texture",
      "Helps with weight management"
    ]
  },
  {
    title: "Padabhyanga (Foot Massage)",
    description: "Traditional Ayurvedic foot massage",
    benefits: [
      "Relieves foot fatigue",
      "Improves circulation"
    ]
  },
  {
    title: "Marma Therapy",
    description: "Energy point therapy",
    benefits: [
      "Balances energy flow",
      "Promotes healing"
    ]
  }
];

export default function TreatmentUpdates() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  // Get patient name from the first treatment if available
  const patientName = treatments[0]?.patientName || '';

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!userEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments/patient/${userEmail}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch treatments');
        return res.json();
      })
      .then(data => {
        setTreatments(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error fetching treatments');
        setLoading(false);
      });
  }, [userEmail, status]);

  // Show available treatments if user is not logged in
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Our Ayurvedic Treatments
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover our range of traditional Ayurvedic treatments for holistic wellness
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {availableTreatments.map((treatment, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-900 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4">
                  {index === 0 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img1.jpeg"
                        alt="Abhyanga Ayurvedic Massage"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 1 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img2.jpeg"
                        alt="Shirodhara Treatment"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img3.jpeg"
                        alt="Panchakarma Treatment"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 3 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img5.jpg"
                        alt="Nasya Treatment"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 4 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img4.jpeg"
                        alt="Kati Basti Treatment"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 5 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img6.jpg"
                        alt="Udvartana Treatment"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 6 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img8.jpeg"
                        alt="Padabhyanga Foot Massage"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  {index === 7 && (
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src="/images/img9.jpeg"
                        alt="Marma Therapy"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {treatment.title}
                  </h2>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {treatment.description}
                  </p>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1 text-sm">
                      Key Benefits
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      {treatment.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Show personal treatments if user is logged in
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="text-center space-y-8 p-8">
          <h2 className="text-2xl text-gray-800 dark:text-white">
            Welcome, {patientName}!
          </h2>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Your Treatment History
          </h1>
        </div>
        
        <div className="mt-4 p-6 bg-[#e7eaee] border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg w-full max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Current Treatments
          </h2>
          {treatments.length === 0 ? (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              You have no treatments yet.
            </p>
          ) : (
            <div className="space-y-4 mt-4">
              {treatments.map(t => (
                <div key={t._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <div className="font-bold text-lg">{t.treatment}</div>
                      <div className="text-gray-600 dark:text-gray-300">Diagnosis: {t.diagnosis}</div>
                      <div className="text-gray-600 dark:text-gray-300">Status: {t.status}</div>
                    </div>
                    <div className="text-gray-500 text-sm mt-2 md:mt-0">
                      {t.startDate && (
                        <span>
                          {new Date(t.startDate).toLocaleDateString()} - {t.endDate ? new Date(t.endDate).toLocaleDateString() : 'Ongoing'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-gray-700 dark:text-gray-200">
                    <div>Medicines: {t.medicines}</div>
                    <div>Yoga/Exercises: {t.yogaExercises}</div>
                    <div>Notes: {t.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
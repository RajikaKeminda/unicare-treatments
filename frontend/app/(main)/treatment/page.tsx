'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Treatment {
  _id: string;
  patientID: string;
  patientName: string;
  treatment: string;
  diagnosis: string;
  medicines: string;
  startDate: string;
  endDate: string;
  notes: string;
  status: string;
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
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center space-y-6 py-8">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-white">
            Welcome, {patientName}!
          </h2>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Your Treatment History
          </h1>
        </div>
        
        <div className="mt-4 p-8 bg-[#e7eaee] border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-xl w-full mx-auto shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Current Treatments
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total: {treatments.length}
            </div>
          </div>

          {treatments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You have no treatments yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {treatments.map(t => (
                <div 
                  key={t._id} 
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                    ${t.status === 'ongoing' ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'}`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                          {t.treatment}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Patient ID: {t.patientID}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${t.status === 'ongoing' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}
                      >
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Diagnosis</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{t.diagnosis}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Medicines/Oils</h4>
                        <div className="mt-1 bg-gray-50 dark:bg-gray-700 rounded p-3">
                          {t.medicines.split('\n').map((medicine, idx) => (
                            <p key={idx} className="text-gray-600 dark:text-gray-400 mb-1">
                              {medicine}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date</h4>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {new Date(t.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date</h4>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {t.endDate ? new Date(t.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Ongoing'}
                          </p>
                        </div>
                      </div>

                      {t.notes && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes</h4>
                          <div className="mt-1 text-gray-600 dark:text-gray-400 space-y-1">
                            {t.notes.split('\n').map((note, index) => (
                              <div key={index}>{note}</div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
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
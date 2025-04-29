'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

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

export default function TreatmentUpdates() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  // Get patient name from the first treatment if available
  const patientName = treatments[0]?.patientName || '';

  console.log('Session:', session);
  console.log('User Email:', userEmail);
  console.log('Session Status:', status);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!userEmail) {
      setError('Please log in to view your treatments');
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

  if (loading) return <div className="p-8 text-center">Loading treatments...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

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
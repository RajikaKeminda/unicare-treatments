import { FaStethoscope, FaPills, FaDumbbell, FaCalendarAlt, FaRegStickyNote, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function TreatmentUpdates() {
  const patientName = "John Doe"; // Dynamically fetched patient name

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-screen-lg mx-auto px-4">
        {/* Top Section: Welcome & Treatment Updates Title */}
        <div className="text-center space-y-8 p-8">
          <h2 className="text-2xl text-gray-800 dark:text-white">
            Welcome, {patientName}!
          </h2>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Your Treatment History
          </h1>
        </div>
        
        {/* Current Treatment Section */}
        <div className="mt-4 p-6 bg-[#e7eaee] border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg w-full max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Current Treatment
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <FaStethoscope className="mr-2 text-gray-600 dark:text-gray-300" />
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>Treatment Type:</strong> Physical Therapy</p>
            </div>
            <div className="flex items-center">
              <FaPills className="mr-2 text-gray-600 dark:text-gray-300" />
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>Medicines/Oils:</strong> Healing Oil (2x per day)</p>
            </div>
            <div className="flex items-center">
              <FaDumbbell className="mr-2 text-gray-600 dark:text-gray-300" />
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>Yoga/Exercises:</strong> Stretching exercises (10 minutes)</p>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>Start Date:</strong> 2025-03-10</p>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-600 dark:text-gray-300" />
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>End Date:</strong> 2025-03-24</p>
            </div>
            <div className="flex items-center">
              <FaRegStickyNote className="mr-2 text-gray-600 dark:text-gray-300" />
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>Doctor’s Notes:</strong> Continue with the treatment and exercises daily.</p>
            </div>
            <div className="flex items-center">
              {true ? (
                <FaCheckCircle className="mr-2 text-green-600 dark:text-green-400" />
              ) : (
                <FaClock className="mr-2 text-gray-600 dark:text-gray-300" />
              )}
              <p className="text-lg text-gray-600 dark:text-gray-300"><strong>Status:</strong> Ongoing</p>
            </div>
          </div>
        </div>

        {/* Previous Treatments Section */}
        <div className="mt-8 p-6 bg-[#e7eaee] border border-gray-300 dark:border-gray-600 rounded-lg w-full max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Previous Treatments
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            You have no previous treatments yet.
          </p>
          <div className="flex justify-center mt-4">
            <button className="px-6 py-3 bg-[#ec4444] text-white rounded-lg hover:bg-[#c22929] transition-colors">
              View Previous Treatments
            </button>
          </div>
        </div><br/><br/>
      </div>
    </div>
  );
}

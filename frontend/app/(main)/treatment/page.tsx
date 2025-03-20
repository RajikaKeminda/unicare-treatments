export default function TreatmentUpdates() {
  const patientName = "John Doe"; // Dynamically fetched patient name

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
        
        {/* Current Treatment Section */}
        <div className="mt-4 p-6 bg-[#e7eaee] border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg w-full max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Current Treatment
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            You have no current treatments yet.
          </p>
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
'use client'; // Marks this file as a client-side component

import React, { useState, useEffect } from 'react';
import ViewTreatment from './ViewTreatment'; // Update the path according to your folder structure
import AddTreatmentForm from './AddTreatmentForm'; // Update the path

export default function PatientList() {
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddTreatmentForm, setShowAddTreatmentForm] = useState(false);
  const [patients, setPatients] = useState([]); // State to hold patient data
  const [error, setError] = useState(null); // Error state for better error handling
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [ongoingCount, setOngoingCount] = useState(0); // State to hold ongoing patients count
  const [completedCount, setCompletedCount] = useState(0); // State to hold completed patients count

  // Function to refresh treatments
  const refreshTreatments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments`);
      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        setPatients(data.data);
        
        const ongoingPatients = data.data.filter(patient => patient.status === 'ongoing');
        const completedPatients = data.data.filter(patient => patient.status === 'completed');

        setOngoingCount(ongoingPatients.length);
        setCompletedCount(completedPatients.length);
      } else {
        console.error('Invalid data format:', data);
        setError('Error: Data format is incorrect.');
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Error: Failed to fetch patients.');
      setPatients([]);
    }
  };

  // Fetch patients from the API
  useEffect(() => {
    refreshTreatments();
  }, []);

  const handleViewTreatmentClick = (patient) => {
    setSelectedPatient(patient); // Set the selected patient to show the treatment details
    setShowTreatmentForm(true);  // Show the treatment form/modal
  };

  const handleAddTreatmentClick = () => {
    setShowAddTreatmentForm(true); // Show the add treatment form
  };

  const handleCloseModal = () => {
    setShowTreatmentForm(false);  // Close the view treatment form/modal
    setShowAddTreatmentForm(false); // Close the add treatment form
    setSelectedPatient(null); // Reset selected patient
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  const filteredPatients = patients.filter(patient => 
    patient.patientID.includes(searchQuery) || patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {!showAddTreatmentForm && !showTreatmentForm ? (
        <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">👨‍⚕️ Welcome, Dr. John Doe</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex justify-center gap-8 text-gray-700">
              <span className="flex items-center gap-2 text-lg">&#128203; Total Patients: <strong>{patients.length}</strong></span>
              <span className="flex items-center gap-2 text-lg">&#x267B; Ongoing: <strong>{ongoingCount}</strong></span>
              <span className="flex items-center gap-2 text-lg">&#128203; Completed: <strong>{completedCount}</strong></span>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <input
              type="text"
              placeholder="🔍 Search Patient ID or Name"
              className="border px-4 py-2 rounded w-64 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="px-6 py-2 rounded-md bg-[#FB923C] text-white hover:bg-[#F97316] transition-colors duration-200 flex items-center gap-2"
              onClick={handleAddTreatmentClick}
            >
              <span className="text-xl">+</span> Add Treatment
            </button>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#334155] text-white">
                  <th className="p-3 text-left font-semibold border-r border-gray-400">Patient ID</th>
                  <th className="p-3 text-left font-semibold border-r border-gray-400">Name</th>
                  <th className="p-3 text-center font-semibold">View Treatment</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="p-3 border text-gray-700">{patient.patientID}</td>
                      <td className="p-3 border text-gray-700">{patient.patientName}</td>
                      <td className="p-3 border text-center">
                        <button
                          className="px-8 py-2 bg-[#4B91F1] text-white rounded hover:bg-[#3B82F6] transition-colors duration-200 min-w-[120px]"
                          onClick={() => handleViewTreatmentClick(patient)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : showAddTreatmentForm ? (
        <AddTreatmentForm onClose={handleCloseModal} onTreatmentAdded={refreshTreatments} />
      ) : selectedPatient ? (
        <ViewTreatment 
          patient={selectedPatient} 
          onClose={handleCloseModal}
          onTreatmentUpdated={refreshTreatments}
          onTreatmentDeleted={refreshTreatments}
        />
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-700">No patient selected</p>
          <button
            onClick={handleCloseModal}
            className="mt-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
          >
            Back to List
          </button>
        </div>
      )}
    </div>
  );
}
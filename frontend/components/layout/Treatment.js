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

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments`); // Correct API endpoint
        const data = await response.json();

        console.log('API response:', data); // Log the response for debugging

        // Check if the data contains a 'data' array
        if (data && Array.isArray(data.data)) {
          // Set patients data from the 'data' array
          setPatients(data.data);

          // Log the status values for debugging
          data.data.forEach(patient => {
            console.log('Patient Status:', patient.status); // Log the status of each patient
          });

          // Update ongoing and completed counts
          const ongoingPatients = data.data.filter(patient => patient.status === 'ongoing');
          const completedPatients = data.data.filter(patient => patient.status === 'completed');

          setOngoingCount(ongoingPatients.length);
          setCompletedCount(completedPatients.length);
        } else {
          console.error('Invalid data format:', data);
          setError('Error: Data format is incorrect.'); // Set error state if data format is not as expected
          setPatients([]); // Default to an empty array if the data is not as expected
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Error: Failed to fetch patients.'); // Set error state for fetch failure
        setPatients([]); // Fallback to an empty array if there was an error
      }
    };

    fetchPatients(); // Call the function to fetch patients
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
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-black text-xl font-bold">👨‍⚕️ Welcome, Dr. John Doe</h1><br />
          <div className="flex justify-center gap-6 text-gray-700 mb-4">
            <span>&#128203; Total Patients: <strong>{patients.length}</strong></span> |
            <span>&#x267B; Ongoing: <strong>{ongoingCount}</strong></span> |
            <span>&#128203; Completed: <strong>{completedCount}</strong></span>
          </div><br /><br />
          
          <div className="flex justify-center gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search Patient ID or Name"
              className="border px-3 py-2 rounded"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="border px-4 py-2 rounded bg-gray-200"
              onClick={handleAddTreatmentClick}
            >
              ➕ Add Treatment
            </button>
          </div><br />

          {/* Error Handling Display */}
          {error && <p className="text-red-500">{error}</p>}

          <table className="w-full border-collapse border text-center">
            <thead className="bg-[#374151] text-white">
              <tr>
                <th className="p-2 border">Patient ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">View Treatment</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr key={index} className="bg-gray-100 text-sm">
                    <td className="p-2 border text-center">{patient.patientID}</td>
                    <td className="p-2 border text-center">{patient.patientName}</td>
                    <td className="p-2 border text-center">
                      <button
                        className="px-4 py-1 bg-gray-500 text-white rounded"
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
      ) : showAddTreatmentForm ? (
        <AddTreatmentForm onClose={handleCloseModal} />
      ) : (
        <ViewTreatment 
          patient={selectedPatient} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
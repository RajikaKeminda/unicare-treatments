'use client'; // Marks this file as a client-side component

import React, { useState } from 'react';
import ViewTreatment from './ViewTreatment'; // Update the path according to your folder structure
import AddTreatmentForm from './AddTreatmentForm'; // Update the path

export default function PatientList() {
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddTreatmentForm, setShowAddTreatmentForm] = useState(false); // New state for AddTreatment form

  const patients = [
    { id: "001", name: "John" },
    { id: "002", name: "Emily" },
    { id: "003", name: "Alex" },
    { id: "004", name: "Jane" },
    { id: "005", name: "Peter" },
    { id: "006", name: "Sophie" },
    { id: "007", name: "Michael" },
    { id: "008", name: "Liam" },
    { id: "009", name: "Olivia" },
    { id: "010", name: "Lucas" }
  ];

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

  return (
    <div>
      {!showAddTreatmentForm && !showTreatmentForm ? (
        // Patient list display
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-black text-xl font-bold">👨‍⚕️ Welcome, Dr. John Doe</h1><br />
          <div className="flex justify-center gap-6 text-gray-700 mb-4">
            <span>&#128203; Total Patients: <strong>150</strong></span> |
            <span>&#x267B; Ongoing: <strong>40</strong></span> |
            <span>&#128203; Completed: <strong>110</strong></span>
          </div><br /><br />
          
          <div className="flex justify-center gap-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search Patient ID"
              className="border px-3 py-2 rounded"
            />
            <button
              className="border px-4 py-2 rounded bg-gray-200"
              onClick={handleAddTreatmentClick} // Show AddTreatment form
            >
              ➕ Add Treatment
            </button>
          </div><br />

          <table className="w-full border-collapse border text-center">
            <thead className="bg-[#374151] text-white">
              <tr>
                <th className="p-2 border">Patient ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">View Treatment</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index} className="bg-gray-100 text-sm">
                  <td className="p-2 border text-center">{patient.id}</td>
                  <td className="p-2 border text-center">{patient.name}</td>
                  <td className="p-2 border text-center">
                    <button 
                      className="px-4 py-1 bg-gray-500 text-white rounded"
                      onClick={() => handleViewTreatmentClick(patient)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : showAddTreatmentForm ? (
        // Add treatment form/modal display
        <AddTreatmentForm onClose={handleCloseModal} />
      ) : (
        // Treatment form/modal display
        <ViewTreatment 
          patient={selectedPatient} 
          onClose={handleCloseModal} // Pass the close handler to the modal
        />
      )}
    </div>
  );
}

'use client'; // Marks this file as a client-side component

import React, { useState } from 'react';

export default function PatientList() {
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);

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

  const handleAddTreatmentClick = () => {
    setShowTreatmentForm(true); // Show the treatment form
  };

  return (
    <div>
      {!showTreatmentForm ? (
        // Patient list display
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-black text-xl font-bold">👨‍⚕️ Welcome, Dr. Jone Doe</h1><br />
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
              onClick={handleAddTreatmentClick}
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
                    <button className="px-4 py-1 bg-gray-500 text-white rounded">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Treatment form display
        <div className="p-6 max-w-3xl mx-auto text-left border border-gray-300 p-4">
          <h1 className="text-black text-2xl font-bold mb-4 text-center">Treatment Form</h1>
          <form>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Patient ID:</label>
              <input
                type="text"
                className="border px-3 py-2 rounded w-2/3"
                placeholder="Enter Patient ID"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Patient Name:</label>
              <input
                type="text"
                className="border px-3 py-2 rounded w-2/3"
                placeholder="Enter Patient Name"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Age:</label>
              <input
                type="number"
                className="border px-3 py-2 rounded w-2/3"
                placeholder="Enter Age"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Gender:</label>
              <div className="flex gap-6">
                <label>
                  <input type="radio" name="gender" value="male" /> Male
                </label>
                <label>
                  <input type="radio" name="gender" value="female" /> Female
                </label>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Diagnosis/Health Issue:</label>
              <textarea
                className="border px-3 py-2 rounded w-2/3 h-20"
                placeholder="Enter Diagnosis"
              ></textarea>
            </div>
            
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Treatment:</label>
              <select className="border px-3 py-2 rounded w-2/3">
                <option>Select Treatment</option>
                <option>Physical Therapy</option>
                <option>Massage</option>
                <option>Acupuncture</option>
                <option>Chiropractic</option>
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Medicines/Oils:</label>
              <textarea
                className="border px-3 py-2 rounded w-2/3 h-28"
                placeholder={"1.\n2.\n3.\n4."}
              ></textarea>
            </div>            
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Yoga/Exercises:</label>
              <textarea
                className="border px-3 py-2 rounded w-2/3"
                placeholder="Describe Yoga/Exercises if needed"
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
                <label className="block text-gray-700 w-1/3">Start Date:</label>
                <input
                  type="date"
                  className="border px-3 py-2 rounded w-1/3"
                />
              </div>
              <div className="mb-4 flex items-center">
                <label className="block text-gray-700 w-1/3">End Date:</label>
                <input
                  type="date"
                  className="border px-3 py-2 rounded w-1/3"
                />
              </div><br/>
            
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Notes:</label>
              <textarea
                className="border px-3 py-2 rounded w-2/3 h-20"
                placeholder="Enter Treatment Notes"
              ></textarea>
            </div><br/>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Status:</label>
              <div className="flex gap-6">
                <label>
                  <input type="radio" name="status" value="ongoing" /> Ongoing
                </label>
                <label>
                  <input type="radio" name="status" value="completed" /> Completed
                </label>
              </div>
            </div><br/>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-[#69d369] rounded w-1/4">Save</button>
              <button className="px-4 py-2 bg-[#60adcb] rounded w-1/4">Update</button>
              <button className="px-4 py-2 bg-[#dc5c50] rounded w-1/4">Delete</button>
            </div>


          </form>
        </div>
      )}
    </div>
  );
}

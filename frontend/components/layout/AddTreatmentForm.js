'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function AddTreatmentForm({ onClose }) {
  const [patientID, setPatientID] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState(""); // Initialize age with an empty string
  const [gender, setGender] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medicines, setMedicines] = useState("");
  const [yogaExercises, setYogaExercises] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  // Validation function
  const validateForm = () => {
    // Validate required fields
    if (!patientID.trim()) {
        toast.error('Patient ID is required.');
        return false;
    }
    if (!patientName.trim()) {
        toast.error('Patient Name is required.');
        return false;
    }
    if (!age.trim()) {
        toast.error('Age is required.');
        return false;
    }

    if (!age.trim()) {
        toast.error('Age is required.');
        return false;
    }

    if (isNaN(age) || parseInt(age) <= 0) {
        toast.error('Age must be a valid positive number.');
        return false;
    }

    if (parseInt(age) > 120) {
        toast.error('Age must be 120 or below.');
        return false;
    }

    if (!gender.trim()) {
        toast.error('Gender is required.');
        return false;
    }
    if (!diagnosis.trim()) {
        toast.error('Diagnosis is required.');
        return false;
    }
    
    if (!startDate) {
        toast.error('Start Date is required.');
        return false;
    }
    if (!endDate) {
        toast.error('End Date is required.');
        return false;
    }
    if (!status.trim()) {
        toast.error('Status is required.');
        return false;
    }

    // Validate that the start date is before or the same as the end date
    if (new Date(startDate) > new Date(endDate)) {
        toast.error('End Date cannot be before start date');
        return false;
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

    let start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Reset time to 00:00:00

    if (start < today) {
        toast.error('Start date cannot be earlier than today.');
        return false;
    }

    return true;
};


  const handleSave = async () => {
    if (!validateForm()) {
      return; // Exit if validation fails
    }

    const treatmentData = {
      patientID,
      patientName,
      age,
      gender,
      diagnosis,
      treatment,
      medicines,
      yogaExercises,
      startDate,
      endDate,
      notes,
      status,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments`, treatmentData);

      if (response.status === 200) {
        alert('Treatment form saved!');
        onClose(); // Close the form after saving
      } else {
        alert('Failed to save treatment form.');
      }
    } catch (error) {
      console.error('Error saving treatment form:', error);
      alert('Error saving treatment form.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-left border border-gray-300 p-4 relative" style={{ backgroundColor: '#f3f4f6' }}>
      <h1 className="text-black text-2xl font-bold mb-4 text-center">Treatment Form</h1><br />
      <form>
        {/* Form Fields */}
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Patient ID:</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-2/3"
            placeholder="Enter Patient ID"
            value={patientID}
            onChange={(e) => setPatientID(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Patient Name:</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-2/3"
            placeholder="Enter Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Age:</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-2/3"
            placeholder="Enter Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Gender:</label>
          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
              /> Female
            </label>
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Diagnosis/Health Issue:</label>
          <textarea
            className="border px-3 py-2 rounded w-2/3 h-20"
            placeholder="Enter Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4 flex items-center">
  <label className="block text-gray-700 w-1/3">Treatment:</label>
  <select
    className="border px-3 py-2 rounded w-1/3"
    value={treatment}
    onChange={(e) => setTreatment(e.target.value)}
  >
    <option>Select Treatment</option>
    <option>Physical Therapy</option>
    <option>Massage</option>
    <option>Acupuncture</option>
    <option>Chiropractic</option>
  </select>

        <button
        onClick={(e) => {
          e.preventDefault();  // Prevent form submission
          toast.info('Coming Soon');  // Display toast message
        }}
        className="bg-[#D3D3D3] text-white py-1 px-3 rounded text-sm flex items-center ml-2 hover:cursor-pointer"
        title="Coming Soon"
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/128/8915/8915520.png" 
          alt="Search Icon"
          className="w-4 h-4 mr-2" 
        />
        Treatment Suggestions
      </button>

     </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Medicines/Oils:</label>
          <textarea
            className="border px-3 py-2 rounded w-2/3 h-28"
            placeholder={"1.\n2.\n3.\n4."}
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
          ></textarea>
        </div>            
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Yoga/Exercises:</label>
          <textarea
            className="border px-3 py-2 rounded w-2/3"
            placeholder="Describe Yoga/Exercises if needed"
            value={yogaExercises}
            onChange={(e) => setYogaExercises(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Start Date:</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-1/3"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">End Date:</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-1/3"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div><br/>

        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Notes:</label>
          <textarea
            className="border px-3 py-2 rounded w-2/3 h-20"
            placeholder="Enter Treatment Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div><br/>
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 w-1/3">Status:</label>
          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                name="status"
                value="ongoing"
                checked={status === 'ongoing'}
                onChange={(e) => setStatus(e.target.value)}
              /> Ongoing
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="completed"
                checked={status === 'completed'}
                onChange={(e) => setStatus(e.target.value)}
              /> Completed
            </label>
          </div>
        </div><br/>

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-[#00C853] rounded"
            onClick={handleSave}  // Call handleSave when saving
          >
            Save
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
          onClick={onClose} // Close the modal
        >
          &#x2715;
        </button>
      </form>
    </div>
  );
}
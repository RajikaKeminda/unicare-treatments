'use client';

import React, { useState } from 'react';
import axios from 'axios';

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
    // Validate name (must not be empty)
    if (!patientName.trim()) {
      alert('Patient Name is required.');
      return false;
    }

    // Validate age (must be a number greater than 0)
    if (!age || age <= 0) {
      alert('Please enter a valid age.');
      return false;
    }

    // Validate that the start date is before or the same as the end date
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be later than End date.');
      return false;
    }

    if (notes && notes.trim().length === 0) {
      alert('Please enter Notes or leave it empty.');
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
            className="border px-3 py-2 rounded w-2/3"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          >
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
            className="px-4 py-2 bg-[#69d369] rounded"
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
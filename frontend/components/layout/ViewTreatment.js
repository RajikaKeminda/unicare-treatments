'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function ViewTreatment({ patient, onClose }) {
  const [editedPatient, setEditedPatient] = useState(patient);
  const [loading, setLoading] = useState(false);

  const { _id } = patient;

  useEffect(() => {
    // Ensure the initial state is set correctly when the patient changes
    setEditedPatient(patient);
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!_id) return;

    // Prevent updating patientID
    if (editedPatient.patientID !== patient.patientID) {
      // alert("Patient ID cannot be changed!");
      toast.error("Patient ID cannot be changed!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPatient), // Send updated patient data
      });

      const data = await response.json();

      if (response.ok) {
        // alert("Updated Successfully!");
        toast.success("Updated Successfully!");
        onClose(); // Close the modal after successful update
      } else {
        console.error(data.message || "Error updating treatment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!_id) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // alert('Deleted Successfully!');
        toast.success("Deleted Successfully!");
        onClose(); // Close the modal after successful delete
      } else {
        console.error(data.message || 'Error deleting treatment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = formattedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#eaeaf0]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative overflow-auto max-h-[80vh] absolute left-1/4 transform -translate-x-1/4 mt-20 pb-15 rounded-lg">
        <button
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          &#x2715;
        </button>

        <h1 className="text-black text-2xl font-bold mb-4 text-center">Treatment Form</h1>
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : (
          <form>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Patient ID:</label>
              <input
                type="text"
                name="patientID"
                className="border px-3 py-2 rounded w-2/3"
                value={editedPatient.patientID || ''}
                onChange={handleChange}
                readOnly // Patient ID cannot be changed
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Patient Name:</label>
              <input
                type="text"
                name="patientName"
                className="border px-3 py-2 rounded w-2/3"
                value={editedPatient.patientName || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Age:</label>
              <input
                type="text"
                name="age"
                className="border px-3 py-2 rounded w-2/3"
                value={editedPatient.age || ''}
                onChange={handleChange}
                placeholder="Enter Age"
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
                    checked={editedPatient.gender === 'male'}
                    onChange={handleChange}
                  /> Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={editedPatient.gender === 'female'}
                    onChange={handleChange}
                  /> Female
                </label>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Diagnosis/Health Issue:</label>
              <textarea
                name="diagnosis"
                className="border px-3 py-2 rounded w-2/3 h-20"
                value={editedPatient.diagnosis || ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Treatment:</label>
              <select
                name="treatment"
                className="border px-3 py-2 rounded w-2/3"
                value={editedPatient.treatment || ''}
                onChange={handleChange}
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
                name="medicines"
                className="border px-3 py-2 rounded w-2/3 h-28"
                value={editedPatient.medicines || ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Yoga/Exercises:</label>
              <textarea
                name="yogaExercises"
                className="border px-3 py-2 rounded w-2/3"
                value={editedPatient.yogaExercises || ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Start Date:</label>
              <input
                type="date"
                name="startDate"
                className="border px-3 py-2 rounded w-1/3"
                value={formatDate(editedPatient.startDate)}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">End Date:</label>
              <input
                type="date"
                name="endDate"
                className="border px-3 py-2 rounded w-1/3"
                value={formatDate(editedPatient.endDate)}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Notes:</label>
              <textarea
                name="notes"
                className="border px-3 py-2 rounded w-2/3 h-20"
                value={editedPatient.notes || ''}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Status:</label>
              <div className="flex gap-6">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="ongoing"
                    checked={editedPatient.status === 'ongoing'}
                    onChange={handleChange}
                  /> Ongoing
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="completed"
                    checked={editedPatient.status === 'completed'}
                    onChange={handleChange}
                  /> Completed
                </label>
              </div>
            </div><br/>

            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-[#60adcb] rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
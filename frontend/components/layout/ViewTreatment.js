'use client';

import React, { useState } from 'react';

export default function ViewTreatment({ patient, onClose }) {
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#eaeaf0]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative overflow-auto max-h-[80vh] absolute left-1/4 transform -translate-x-1/4 mt-20 pb-15 rounded-lg">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          &#x2715; {/* Close icon */}
        </button>

        <h1 className="text-black text-2xl font-bold mb-4 text-center">Treatment Form</h1>
        <form>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Patient ID:</label>
            <input
              type="text"
              name="id"
              className="border px-3 py-2 rounded w-2/3"
              value={editedPatient.id || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Patient Name:</label>
            <input
              type="text"
              name="name"
              className="border px-3 py-2 rounded w-2/3"
              value={editedPatient.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Age:</label>
            <input
              type="number"
              name="age"
              className="border px-3 py-2 rounded w-2/3"
              value={editedPatient.age || ''}
              onChange={handleChange}
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
              value={editedPatient.startDate || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">End Date:</label>
            <input
              type="date"
              name="endDate"
              className="border px-3 py-2 rounded w-1/3"
              value={editedPatient.endDate || ''}
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
          </div><br></br>
          
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-[#60adcb] rounded"
              onClick={() => {
                alert("Updated Successfully!");
                onClose();
              }}
            >
              Update
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#dc5c50] rounded"
              onClick={() => {
                alert("Deleted Successfully!");
                onClose();
              }}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

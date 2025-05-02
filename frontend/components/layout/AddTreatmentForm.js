'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the validation schema
const treatmentSchema = z.object({
  patientID: z.string().min(1, "Patient ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  age: z.string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "Age must be a valid positive number"
    })
    .refine((val) => parseInt(val) <= 120, {
      message: "Age must be 120 or below"
    }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender"
  }),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment: z.string().min(1, "Please select a treatment"),
  medicines: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
  status: z.enum(["ongoing", "completed"], {
    required_error: "Please select a status"
  })
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return startDate <= endDate;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"]
});

export default function AddTreatmentForm({ onClose, onTreatmentAdded }) {
  const [formData, setFormData] = useState({
    patientID: "",
    patientName: "",
    age: "",
    email: "",
    gender: "",
    diagnosis: "",
    treatment: "",
    medicines: [""],
    startDate: "",
    endDate: "",
    notes: [""],  // Initialize with one empty note
    status: "ongoing"
  });

  const [errors, setErrors] = useState({});

  // Function to generate a unique patient ID
  const generatePatientID = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PID${year}${month}${day}${random}`;
  };

  // Set the patient ID when the component mounts
  useEffect(() => {
    setFormData(prev => ({ ...prev, patientID: generatePatientID() }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('medicine-')) {
      // Handle medicine field changes
      const index = parseInt(name.split('-')[1]);
      const newMedicines = [...formData.medicines];
      newMedicines[index] = value;
      setFormData(prev => ({
        ...prev,
        medicines: newMedicines
      }));
    } else if (name.startsWith('note-')) {
      // Handle note field changes
      const index = parseInt(name.split('-')[1]);
      const newNotes = [...formData.notes];
      newNotes[index] = value;
      setFormData(prev => ({
        ...prev,
        notes: newNotes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addMedicineField = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, ""]
    }));
  };

  const removeMedicineField = (index) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const addNoteField = () => {
    setFormData(prev => ({
      ...prev,
      notes: [...prev.notes, ""]
    }));
  };

  const removeNoteField = (index) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const handleTreatmentSuggestions = async () => {
    if (!formData.diagnosis.trim()) {
      toast.error("Please enter a diagnosis to get suggestions.");
      return;
    }
  
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/suggestion/${encodeURIComponent(formData.diagnosis.trim())}`
      );
  
      if (response.data.data) {
        setFormData(prev => ({
          ...prev,
          treatment: response.data.data.treatment,
          medicines: Array.isArray(response.data.data.medicines) 
            ? response.data.data.medicines 
            : [response.data.data.medicines || ""]
        }));
        toast.success("Suggestions applied!");
      } else {
        toast.warning("No suggestions found for this diagnosis.");
      }
    } catch (error) {
      console.error("Suggestion error:", error);
      const errorMessage = error.response?.data?.message 
        ? error.response.data.message 
        : "Failed to fetch treatment suggestions. Please try again.";
      toast.error(errorMessage);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Combine medicines array into a string with numbered list
      const medicinesString = formData.medicines
        .filter(med => med.trim() !== '')
        .map((med, index) => `${index + 1}. ${med}`)
        .join('\n');

      // Combine notes array into a string with numbered list
      const notesString = formData.notes
        .filter(note => note.trim() !== '')
        .map((note, index) => `${index + 1}. ${note}`)
        .join('\n');

      const dataToSubmit = {
        ...formData,
        medicines: medicinesString,
        notes: notesString
      };
      
      // Validate the form data
      const validatedData = treatmentSchema.parse(dataToSubmit);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments`, validatedData);

      if (response.status === 200) {
        alert('Treatment form saved successfully!');
        onTreatmentAdded();
        onClose();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        
        // Show the first error in a toast
        if (error.errors[0]) {
          toast.error(error.errors[0].message);
        }
      } else {
        toast.error('Error saving treatment form. Please try again.');
      }
    }
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

        <h1 className="text-black text-2xl font-bold mb-4 text-center">Add Treatment</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Patient ID:</label>
            <input
              type="text"
              name="patientID"
              className="border px-3 py-2 rounded w-2/3 outline-none"
              value={formData.patientID}
              readOnly
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Patient Name:</label>
            <input
              type="text"
              name="patientName"
              className={`border px-3 py-2 rounded w-2/3 outline-none ${errors.patientName ? 'border-red-500' : ''}`}
              value={formData.patientName}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Age:</label>
            <input
              type="text"
              name="age"
              className={`border px-3 py-2 rounded w-2/3 outline-none ${errors.age ? 'border-red-500' : ''}`}
              value={formData.age}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Email:</label>
            <input
              type="email"
              name="email"
              className={`border px-3 py-2 rounded w-2/3 outline-none ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Gender:</label>
            <div className="flex gap-6">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="outline-none"
                /> Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="outline-none"
                /> Female
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
          <div className="mb-4 flex items-center">
  <label className="block text-gray-700 w-1/3">Diagnosis/Health Issue:</label>
  <textarea
    name="diagnosis"
    className={`border px-3 py-2 rounded w-2/3 h-16 outline-none ${errors.diagnosis ? 'border-red-500' : ''}`}
    value={formData.diagnosis}
    onChange={handleChange}
  ></textarea>
  {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>}
</div>

{/* Treatment Suggestions Button */}
<div className="mb-4 flex items-center justify-end w-2/3">
  <button
    type="button"
    onClick={() => handleTreatmentSuggestions()}
    className="flex items-center space-x-2 px-4 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
  >
    {/* Search Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="16" y1="16" x2="20" y2="20" />
    </svg>
    <span className="text-sm">Treatment Suggestions</span>
  </button>
</div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Treatment:</label>
            <select
              name="treatment"
              className={`border px-3 py-2 rounded w-2/3 outline-none ${errors.treatment ? 'border-red-500' : ''}`}
              value={formData.treatment}
              onChange={handleChange}
            >
              <option value="">Select Treatment</option>
              <option value="Abhyanga">Abhyanga (Ayurvedic Massage)</option>
              <option value="Shirodhara">Shirodhara</option>
              <option value="Panchakarma">Panchakarma</option>
              <option value="Nasya">Nasya</option>
              <option value="Kati Basti">Kati Basti</option>
              <option value="Udvartana">Udvartana</option>
              <option value="Padabhyanga">Padabhyanga (Foot Massage)</option>
              <option value="Marma Therapy">Marma Therapy</option>
            </select>
            {errors.treatment && <p className="text-red-500 text-sm mt-1">{errors.treatment}</p>}
          </div>
          <div className="mb-4 flex items-start">
            <label className="block text-gray-700 w-1/3">Medicines/Oils:</label>
            <div className="w-2/3">
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    name={`medicine-${index}`}
                    className="border px-3 py-2 rounded flex-1 outline-none"
                    value={medicine}
                    onChange={handleChange}
                    placeholder={`Medicine/Oil ${index + 1}`}
                  />
                  {index === formData.medicines.length - 1 && (
                    <button
                      type="button"
                      onClick={addMedicineField}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                    >
                      +
                    </button>
                  )}
                  {formData.medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineField(index)}
                      className="bg-gray-100 hover:bg-gray-200 text-red-500 hover:text-red-700 w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Start Date:</label>
            <input
              type="date"
              name="startDate"
              className={`border px-3 py-2 rounded w-1/3 outline-none ${errors.startDate ? 'border-red-500' : ''}`}
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">End Date:</label>
            <input
              type="date"
              name="endDate"
              className={`border px-3 py-2 rounded w-1/3 outline-none ${errors.endDate ? 'border-red-500' : ''}`}
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
          <div className="mb-4 flex items-start">
            <label className="block text-gray-700 w-1/3">Notes:</label>
            <div className="w-2/3">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <textarea
                    name={`note-${index}`}
                    className="border px-3 py-2 rounded flex-1 outline-none h-16"
                    value={note}
                    onChange={handleChange}
                    placeholder={index === 0 ? "Visit frequency for the treatment" : "Additional note"}
                  />
                  {index === formData.notes.length - 1 && (
                    <button
                      type="button"
                      onClick={addNoteField}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                    >
                      +
                    </button>
                  )}
                  {formData.notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNoteField(index)}
                      className="bg-gray-100 hover:bg-gray-200 text-red-500 hover:text-red-700 w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Status:</label>
            <div className="flex gap-6">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="ongoing"
                  checked={formData.status === 'ongoing'}
                  onChange={handleChange}
                  className="outline-none"
                /> Ongoing
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={formData.status === 'completed'}
                  onChange={handleChange}
                  className="outline-none"
                /> Completed
              </label>
            </div>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-[#22C55E] text-white rounded-md hover:bg-[#16A34A] transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
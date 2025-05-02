'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema for updating treatment
const updateTreatmentSchema = z.object({
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

export default function ViewTreatment({ patient = {}, onClose, onTreatmentUpdated, onTreatmentDeleted }) {
  const [editedPatient, setEditedPatient] = useState({
    ...patient,
    medicines: patient.medicines ? patient.medicines.split('\n').map(med => med.replace(/^\d+\.\s*/, '')) : [""],
    notes: patient.notes ? patient.notes.split('\n').map(note => note.replace(/^\d+\.\s*/, '')) : [""]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const _id = patient?._id;

  useEffect(() => {
    if (patient && Object.keys(patient).length > 0) {
      setEditedPatient({
        ...patient,
        medicines: patient.medicines ? patient.medicines.split('\n').map(med => med.replace(/^\d+\.\s*/, '')) : [""],
        notes: patient.notes ? patient.notes.split('\n').map(note => note.replace(/^\d+\.\s*/, '')) : [""]
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('medicine-')) {
      const index = parseInt(name.split('-')[1]);
      const newMedicines = [...editedPatient.medicines];
      newMedicines[index] = value;
      setEditedPatient(prev => ({
        ...prev,
        medicines: newMedicines
      }));
    } else if (name.startsWith('note-')) {
      const index = parseInt(name.split('-')[1]);
      const newNotes = [...editedPatient.notes];
      newNotes[index] = value;
      setEditedPatient(prev => ({
        ...prev,
        notes: newNotes
      }));
    } else {
      setEditedPatient(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addMedicineField = () => {
    setEditedPatient(prev => ({
      ...prev,
      medicines: [...prev.medicines, ""]
    }));
  };

  const removeMedicineField = (index) => {
    setEditedPatient(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const addNoteField = () => {
    setEditedPatient(prev => ({
      ...prev,
      notes: [...prev.notes, ""]
    }));
  };

  const removeNoteField = (index) => {
    setEditedPatient(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async () => {
    if (!_id) {
      toast.error('Invalid treatment ID');
      return;
    }

    try {
      const medicinesString = editedPatient.medicines
        .filter(med => med.trim() !== '')
        .map((med, index) => `${index + 1}. ${med}`)
        .join('\n');

      const notesString = editedPatient.notes
        .filter(note => note.trim() !== '')
        .map((note, index) => `${index + 1}. ${note}`)
        .join('\n');

      const dataToUpdate = {
        ...editedPatient,
        medicines: medicinesString,
        notes: notesString
      };

      updateTreatmentSchema.parse(dataToUpdate);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/treatments/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (response.ok) {
        alert('Treatment updated successfully!');
        onTreatmentUpdated();
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Error updating treatment.');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        toast.error('Validation error. Please check your inputs.');
      } else {
        console.error('Update error:', error);
        toast.error('Error updating treatment. Please try again.');
      }
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
        alert('Treatment deleted successfully!');
        onTreatmentDeleted();
        onClose();
      } else {
        toast.error(data.message || 'Error deleting treatment.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting treatment. Please try again.');
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

  const formatDateLong = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDF = async () => {
    try {
      // Show alert first
      alert(`Prescription generated for ${editedPatient.patientName}`);
      
      // Then generate PDF
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Format medicines with line breaks
      const formattedMedicines = editedPatient.medicines
        .filter(med => med.trim() !== '')
        .map((med, index) => `${index + 1}. ${med}`)
        .join('<br>');

      // Format notes with line breaks
      const formattedNotes = editedPatient.notes
        .filter(note => note.trim() !== '')
        .map((note, index) => `${index + 1}. ${note.replace(/Additional note:\s*/i, '')}`)
        .join('<br>');

      const content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #334155; margin-bottom: 5px; font-size: 24px;">UniCare Ayurveda Center</h1>
            <h2 style="color: #334155; margin-bottom: 5px; font-size: 18px;">Medical Prescription</h2>
            <p style="color: #64748b; font-size: 12px;">Generated on ${formatDateLong(new Date())}</p>
          </div>

          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px;">Patient Information</h2>
            <p style="margin: 5px 0;"><strong>Patient ID:</strong> ${editedPatient.patientID}</p>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${editedPatient.patientName}</p>
            <p style="margin: 5px 0;"><strong>Age:</strong> ${editedPatient.age}</p>
            <p style="margin: 5px 0;"><strong>Gender:</strong> ${editedPatient.gender}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${editedPatient.email || 'Not provided'}</p>
          </div>

          <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px;">Treatment Details</h2>
            <p style="margin: 5px 0;"><strong>Diagnosis:</strong> ${editedPatient.diagnosis}</p>
            <p style="margin: 5px 0;"><strong>Treatment:</strong> ${editedPatient.treatment}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${formatDateLong(editedPatient.startDate)} to ${formatDateLong(editedPatient.endDate)}</p>
          </div>

          ${editedPatient.medicines.length > 0 ? `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px;">Prescribed Medicines/Oils</h2>
              <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 10px; border-radius: 4px;">
                ${formattedMedicines}
              </div>
            </div>
          ` : ''}

          ${editedPatient.notes.length > 0 ? `
            <div style="margin-bottom: 20px; page-break-inside: avoid;">
              <h2 style="color: #334155; font-size: 16px; margin-bottom: 10px;">Notes</h2>
              <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 10px; border-radius: 4px;">
                ${formattedNotes}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid;">
            <p style="text-align: right; font-style: italic; color: #64748b; margin: 5px 0;">
              Doctor's Signature: _______________________<br>
              Date: ${formatDateLong(new Date())}
            </p>
            <p style="text-align: center; font-size: 10px; color: #64748b; margin-top: 15px;">
              This is a computer-generated prescription. No physical signature is required.
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${editedPatient.patientID}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(content).save();
      onClose(); // Close the modal after PDF is generated
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Error generating prescription. Please try again.');
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

        <h1 className="text-black text-2xl font-bold mb-4 text-center">Treatment Details</h1>
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : !patient || !_id ? (
          <div className="text-center text-gray-700">No treatment data available</div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Patient ID:</label>
              <input
                type="text"
                name="patientID"
                className="border px-3 py-2 rounded w-2/3 bg-gray-100"
                value={editedPatient.patientID || ''}
                readOnly
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Patient Name:</label>
              <input
                type="text"
                name="patientName"
                className={`border px-3 py-2 rounded w-2/3 bg-white ${errors.patientName ? 'border-red-500' : ''}`}
                value={editedPatient.patientName || ''}
                onChange={handleChange}
              />
              {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
            </div>

            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Age:</label>
              <input
                type="text"
                name="age"
                className={`border px-3 py-2 rounded w-2/3 bg-white ${errors.age ? 'border-red-500' : ''}`}
                value={editedPatient.age || ''}
                onChange={handleChange}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Email:</label>
              <input
                type="email"
                name="email"
                className={`border px-3 py-2 rounded w-2/3 bg-white ${errors.email ? 'border-red-500' : ''}`}
                value={editedPatient.email || ''}
                onChange={handleChange}
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
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Diagnosis/Health Issue:</label>
              <textarea
                name="diagnosis"
                className={`border px-3 py-2 rounded w-2/3 h-20 bg-white ${errors.diagnosis ? 'border-red-500' : ''}`}
                value={editedPatient.diagnosis || ''}
                onChange={handleChange}
              ></textarea>
              {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>}
            </div>

            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">Treatment:</label>
              <select
                name="treatment"
                className={`border px-3 py-2 rounded w-2/3 bg-white ${errors.treatment ? 'border-red-500' : ''}`}
                value={editedPatient.treatment || ''}
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
                {editedPatient.medicines.map((medicine, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      name={`medicine-${index}`}
                      className="border px-3 py-2 rounded flex-1 bg-white"
                      value={medicine}
                      onChange={handleChange}
                      placeholder={`Medicine/Oil ${index + 1}`}
                    />
                    {index === editedPatient.medicines.length - 1 && (
                      <button
                        type="button"
                        onClick={addMedicineField}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                      >
                        +
                      </button>
                    )}
                    {editedPatient.medicines.length > 1 && (
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
                className={`border px-3 py-2 rounded w-1/3 bg-white ${errors.startDate ? 'border-red-500' : ''}`}
                value={formatDate(editedPatient.startDate)}
                onChange={handleChange}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div className="mb-4 flex items-center">
              <label className="block text-gray-700 w-1/3">End Date:</label>
              <input
                type="date"
                name="endDate"
                className={`border px-3 py-2 rounded w-1/3 bg-white ${errors.endDate ? 'border-red-500' : ''}`}
                value={formatDate(editedPatient.endDate)}
                onChange={handleChange}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div className="mb-4 flex items-start">
              <label className="block text-gray-700 w-1/3">Notes:</label>
              <div className="w-2/3">
                {editedPatient.notes.map((note, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <textarea
                      name={`note-${index}`}
                      className="border px-3 py-2 rounded flex-1 bg-white"
                      value={note}
                      onChange={handleChange}
                      placeholder={`Note ${index + 1}`}
                    />
                    {index === editedPatient.notes.length - 1 && (
                      <button
                        type="button"
                        onClick={addNoteField}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 w-8 h-8 rounded flex items-center justify-center transition-colors duration-200"
                      >
                        +
                      </button>
                    )}
                    {editedPatient.notes.length > 1 && (
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
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                className="px-6 py-2 bg-[#22C55E] text-white rounded-md hover:bg-[#16A34A] transition-colors duration-200"
                onClick={generatePDF}
              >
                <div className="flex items-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/337/337946.png" 
                    alt="Document Icon"
                    className="w-5 h-5 mr-2" 
                  />
                  Prescription
                </div>
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-[#4B91F1] text-white rounded-md hover:bg-[#3B82F6] transition-colors duration-200"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
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
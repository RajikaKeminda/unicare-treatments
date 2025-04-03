import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  patientID: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: false },
  medicines: { type: String, required: false },
  yogaExercises: { type: String, required: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: { type: String, required: false },  
  status: { type: String, required: true },
});

const Treatment = mongoose.model('Treatment', treatmentSchema);

export default Treatment;
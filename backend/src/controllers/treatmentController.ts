import { Request, Response } from 'express';
import Treatment from '../models/treatmentModel.ts';
import TreatmentMapping from '../models/treatmentMapping.ts';

// Function to add treatment
export const addTreatment = async (req: Request, res: Response) => {
  try {
    const newTreatment = new Treatment(req.body);
    await newTreatment.save();
    res.status(200).json({
      message: 'Treatment added successfully',
      data: newTreatment
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error adding treatment',
      error: error.message
    });
  }
};

// Function to get all treatments
export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const treatments = await Treatment.find();
    res.status(200).json({
      message: 'Patients fetched successfully',
      data: treatments
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// Function to get a specific patient treatment by ID
export const getPatientTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const treatment = await Treatment.findById(id);

    if (!treatment) {
      res.status(404).json({ message: 'Patient treatment not found' });
      return;
    }

    res.status(200).json({
      message: 'Patient treatment fetched successfully',
      data: treatment
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching patient treatment',
      error: error.message
    });
  }
};

// Function to update treatment by ID
export const updateTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      patientName,
      age,
      email,
      gender,
      diagnosis,
      treatment,
      medicines,
      yogaExercises,
      startDate,
      endDate,
      notes,
      status,
    } = req.body;

    const existingTreatment = await Treatment.findById(id);

    if (!existingTreatment) {
      res.status(404).json({ message: 'Treatment not found' });
      return;
    }

    existingTreatment.patientName = patientName || existingTreatment.patientName;
    existingTreatment.age = age || existingTreatment.age;
    existingTreatment.email = email || existingTreatment.email;
    existingTreatment.gender = gender || existingTreatment.gender;
    existingTreatment.diagnosis = diagnosis || existingTreatment.diagnosis;
    existingTreatment.treatment = treatment || existingTreatment.treatment;
    existingTreatment.medicines = medicines || existingTreatment.medicines;
    existingTreatment.yogaExercises = yogaExercises || existingTreatment.yogaExercises;
    existingTreatment.startDate = startDate || existingTreatment.startDate;
    existingTreatment.endDate = endDate || existingTreatment.endDate;
    existingTreatment.notes = notes || existingTreatment.notes;
    existingTreatment.status = status || existingTreatment.status;

    await existingTreatment.save();

    res.status(200).json({
      message: 'Treatment updated successfully',
      data: existingTreatment
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error updating treatment',
      error: error.message
    });
  }
};

// Function to delete treatment by ID
export const deleteTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const treatment = await Treatment.findByIdAndDelete(id);

    if (!treatment) {
      res.status(404).json({ message: 'Treatment not found or already deleted' });
      return;
    }

    res.status(200).json({ message: 'Treatment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error deleting treatment',
      error: error.message
    });
  }
};

// Function to get treatments for a specific patient by email
export const getPatientTreatments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const treatments = await Treatment.find({ email });

    res.status(200).json({
      message: 'Treatments fetched successfully',
      data: treatments
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching treatments',
      error: error.message
    });
  }
};

// Function to add treatment mapping
export const addTreatmentMapping = async (req: Request, res: Response): Promise<void> => {
  try {
    const { diagnosis, keywords, treatment, medicines } = req.body;

    const newMapping = new TreatmentMapping({
      diagnosis,
      keywords,
      treatment,
      medicines
    });

    await newMapping.save();

    res.status(201).json({
      message: 'Treatment mapping added successfully',
      data: newMapping
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error adding treatment mapping',
      error: error.message
    });
  }
};

// Function to get all treatment mappings
export const getAllTreatmentMappings = async (req: Request, res: Response): Promise<void> => {
  try {
    const mappings = await TreatmentMapping.find();
    res.status(200).json({
      message: 'Treatment mappings fetched successfully',
      data: mappings
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching treatment mappings',
      error: error.message
    });
  }
};

/// ✅ Function to get suggestion by keyword (case-insensitive match)
export const getSuggestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { diagnosis } = req.params; // Now using params instead of query
    
    if (!diagnosis) {
      res.status(400).json({ message: 'Diagnosis is required' });
      return;
    }

    const diagnosisStr = String(diagnosis).toLowerCase();
    console.log('Searching for diagnosis:', diagnosisStr);

    const suggestion = await TreatmentMapping.findOne({
      $or: [
        { diagnosis: { $regex: diagnosisStr, $options: 'i' } },
        { keywords: { $in: [diagnosisStr] } }
      ]
    });

    if (!suggestion) {
      res.status(404).json({ message: 'No suggestion found' });
      return;
    }

    res.status(200).json({
      message: 'Suggestion found',
      data: {
        treatment: suggestion.treatment,
        medicines: suggestion.medicines
      }
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching suggestion',
      error: error.message
    });
  }
};
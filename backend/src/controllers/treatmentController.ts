import { Request, Response } from 'express';
import Treatment from '../models/treatmentModel.ts'; // Your treatment model

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

//Function to get all treatments 
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

//Function to get patient treatments
export const getPatientTreatment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Get patient ID from the route params
    const treatment = await Treatment.findById(id); // Find treatment by _id (patient ID)

    if (!treatment) {
      res.status(404).json({
        message: 'Patient treatment not found'
      });
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



// Function to update treatment data by ID
export const updateTreatment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Get treatment ID from the route params
    const {
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
    } = req.body; // Get updated data from request body

    // Find the treatment by ID
    const existingTreatment = await Treatment.findById(id);

    if (!existingTreatment) {
      res.status(404).json({
        message: 'Treatment not found'
      });
      return;
    }

    // Update the treatment fields
    existingTreatment.patientName = patientName || existingTreatment.patientName;
    existingTreatment.age = age || existingTreatment.age;
    existingTreatment.gender = gender || existingTreatment.gender;
    existingTreatment.diagnosis = diagnosis || existingTreatment.diagnosis;
    existingTreatment.treatment = treatment || existingTreatment.treatment;
    existingTreatment.medicines = medicines || existingTreatment.medicines;
    existingTreatment.yogaExercises = yogaExercises || existingTreatment.yogaExercises;
    existingTreatment.startDate = startDate || existingTreatment.startDate;
    existingTreatment.endDate = endDate || existingTreatment.endDate;
    existingTreatment.notes = notes || existingTreatment.notes;
    existingTreatment.status = status || existingTreatment.status;

    // Save the updated treatment data to the database
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


// Function to delete treatment data by ID

export const deleteTreatment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Get treatment ID from the route params

    const treatment = await Treatment.findByIdAndDelete(id); // Delete the treatment record by ID

    if (!treatment) {
      res.status(404).json({
        message: 'Treatment not found or already deleted'
      });
      return;
    }

    res.status(200).json({
      message: 'Treatment deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error deleting treatment',
      error: error.message
    });
  }
};
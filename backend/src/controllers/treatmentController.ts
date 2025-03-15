import { Request, Response } from 'express';
import Treatment from '../models/treatmentModel.ts';

export const addTreatment = async (req: Request, res: Response) => {
  try {
    const newTreatment = new Treatment(req.body);
    await newTreatment.save();
    res.status(200).json({ message: 'Treatment added successfully', data: newTreatment });
  } catch (error: any) { // Cast error to 'any'
    res.status(500).json({ message: 'Error adding treatment', error: error.message });
  }
};

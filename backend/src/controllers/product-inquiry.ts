import { Request, Response } from 'express';
import AdviceRequest, { IAdviceRequest } from '../models/product-inquiry.ts';

export const submitAdviceRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, concern, message } = req.body;

    const newRequest: IAdviceRequest = new AdviceRequest({
      name,
      email,
      concern,
      message,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Advice request submitted successfully!' });
  } catch (error) {
    console.error('Error submitting advice request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
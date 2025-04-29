// controllers/orderController.ts
import { Request, Response } from 'express';
import Order from '../models/orderModelProduct.ts'; 

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, name, address, quantity, paymentMethod, totalPrice } = req.body;

    const newOrder = new Order({
      productId,
      name,
      address,
      quantity,
      paymentMethod,
      totalPrice
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

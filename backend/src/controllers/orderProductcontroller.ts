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

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('productId', 'name price image') // Populate product details
      .sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('productId', 'name price image description');
      
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};
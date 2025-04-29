import { Request, Response, Router } from 'express';
import orderModelProduct from '@src/models/orderModelProduct.ts'; // adjust path as needed

const router = Router();

router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { productId, name, address, quantity, totalPrice, paymentMethod } = req.body;

    const order = new orderModelProduct({
      product: productId,
      customerName: name,
      address,
      quantity,
      totalPrice,
      paymentMethod
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;

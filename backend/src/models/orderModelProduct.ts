// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  quantity: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'cash_on_delivery'], required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

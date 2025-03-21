import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  ratings: { type: Number, required: true, min: 0, max: 5 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
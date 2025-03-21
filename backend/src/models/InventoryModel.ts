import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  perItemPrice: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
});

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;
import mongoose from 'mongoose';

const inventoryActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['add', 'delete', 'update', 'expire']
  },
  itemName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const InventoryActivityLog = mongoose.model('InventoryActivityLog', inventoryActivityLogSchema); 
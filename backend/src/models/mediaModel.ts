import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, required: true },
  postId: { type: String },
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

export default Media;


import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  likes: [{ type: String }],
  dislikes: [{ type: String }],
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;


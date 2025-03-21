import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/commentModel.js';

class CommentController {
  // Create a new comment
  async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content, postId, parentCommentId } = req.body;

      // Validate postId
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid post ID',
        });
        return;
      }

      // If parentCommentId is provided, validate it
      if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid parent comment ID',
        });
        return;
      }

      const comment = new Comment({
        content,
        author: req.user?._id,
        postId,
        parentCommentId,
      });

      await comment.save();

      // If this is a reply, add it to the parent comment's replies array
      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, {
          $push: { replies: comment._id },
        });
      }

      // Populate the author information
      await comment.populate('author', 'name email');

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Get comments for a post
  async getPostComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid post ID',
        });
        return;
      }

      const comments = await Comment.find({ postId, parentCommentId: null })
        .populate('author', 'name email')
        .populate({
          path: 'replies',
          populate: {
            path: 'author',
            select: 'name email',
          },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Comment.countDocuments({ postId, parentCommentId: null });

      res.status(200).json({
        success: true,
        data: {
          comments,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Get replies for a comment
  async getCommentReplies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid comment ID',
        });
        return;
      }

      const replies = await Comment.find({ parentCommentId: commentId })
        .populate('author', 'name email')
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Comment.countDocuments({ parentCommentId: commentId });

      res.status(200).json({
        success: true,
        data: {
          replies,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Update a comment
  async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid comment ID',
        });
        return;
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
        return;
      }

      // Check if user is the author
      if (comment.author.toString() !== req.user?._id) {
        res.status(403).json({
          success: false,
          error: 'Not authorized to update this comment',
        });
        return;
      }

      comment.content = content;
      await comment.save();

      await comment.populate('author', 'name email');

      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Delete a comment
  async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid comment ID',
        });
        return;
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
        return;
      }

      // Check if user is the author
      if (comment.author.toString() !== req.user?._id) {
        res.status(403).json({
          success: false,
          error: 'Not authorized to delete this comment',
        });
        return;
      }

      // If this is a reply, remove it from the parent comment's replies array
      if (comment.parentCommentId) {
        await Comment.findByIdAndUpdate(comment.parentCommentId, {
          $pull: { replies: comment._id },
        });
      }

      // Delete all replies to this comment
      await Comment.deleteMany({ parentCommentId: commentId });

      // Delete the comment itself
      await comment.deleteOne();

      res.status(200).json({
        success: true,
        data: { message: 'Comment deleted successfully' },
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Toggle like on a comment
  async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid comment ID',
        });
        return;
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
        return;
      }

      const userObjectId = req.user?._id || '';
      const likeIndex = comment.likes.findIndex(like => like === userObjectId);
      
      if (likeIndex === -1) {
        comment.likes.push(userObjectId);
      } else {
        comment.likes.splice(likeIndex, 1);
      }

      await comment.save();
      await comment.populate('author', 'name email');

      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Toggle dislike on a comment
  async toggleDislike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid comment ID',
        });
        return;
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          error: 'Comment not found',
        });
        return;
      }

      const userObjectId = req.user?._id || '';
      const dislikeIndex = comment.dislikes.findIndex(dislike => dislike === userObjectId);
      
      if (dislikeIndex === -1) {
        comment.dislikes.push(userObjectId);
      } else {
        comment.dislikes.splice(dislikeIndex, 1);
      }

      await comment.save();
      await comment.populate('author', 'name email');

      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new CommentController();

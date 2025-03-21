import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

// Validation schemas
const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment is too long'),
  postId: z.string().min(1, 'Post ID is required'),
  parentCommentId: z.string().optional(),
});

const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment is too long'),
});

class CommentService {
  // Create a new comment
  async createComment(commentData: any, userId: string) {
    try {
      // Validate input data
      const validatedData = createCommentSchema.parse(commentData);

      // Check if post exists
      const post = await Post.findById(validatedData.postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // If this is a reply, check if parent comment exists
      if (validatedData.parentCommentId) {
        const parentComment = await Comment.findById(validatedData.parentCommentId);
        if (!parentComment) {
          throw new Error('Parent comment not found');
        }
      }

      // Create new comment
      const comment = new Comment({
        content: validatedData.content,
        author: new Types.ObjectId(userId),
        postId: new Types.ObjectId(validatedData.postId),
        parentCommentId: validatedData.parentCommentId ? new Types.ObjectId(validatedData.parentCommentId) : undefined,
      });

      await comment.save();

      // Update post's comments array
      post.comments.push(comment._id);
      await post.save();

      // If this is a reply, update parent comment's replies array
      if (validatedData.parentCommentId) {
        await Comment.findByIdAndUpdate(
          validatedData.parentCommentId,
          { $push: { replies: comment._id } }
        );
      }

      return comment;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error('Failed to create comment');
    }
  }

  // Get comments for a post with pagination
  async getPostComments(postId: string, page: number = 1, limit: number = 10) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const comments = await Comment.find({ 
        postId: new Types.ObjectId(postId),
        parentCommentId: null // Only get top-level comments
      })
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

      const total = await Comment.countDocuments({ 
        postId: new Types.ObjectId(postId),
        parentCommentId: null 
      });

      return {
        comments,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch comments');
    }
  }

  // Get replies for a comment
  async getCommentReplies(commentId: string, page: number = 1, limit: number = 10) {
    try {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid comment ID');
      }

      const replies = await Comment.find({ 
        parentCommentId: new Types.ObjectId(commentId)
      })
        .populate('author', 'name email')
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Comment.countDocuments({ 
        parentCommentId: new Types.ObjectId(commentId)
      });

      return {
        replies,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch replies');
    }
  }

  // Update a comment
  async updateComment(commentId: string, updateData: any, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid comment ID');
      }

      // Validate update data
      const validatedData = updateCommentSchema.parse(updateData);

      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new Error('Comment not found');
      }

      // Check if user is the author
      if (comment.author && comment.author.toString() !== userId) {
        throw new Error('Unauthorized to update this comment');
      }

      // Update comment
      comment.content = validatedData.content;
      await comment.save();

      return comment;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error('Failed to update comment');
    }
  }

  // Delete a comment
  async deleteComment(commentId: string, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid comment ID');
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new Error('Comment not found');
      }

      // Check if user is the author
      if (comment.author && comment.author.toString() !== userId) {
        throw new Error('Unauthorized to delete this comment');
      }

      // Remove comment from post's comments array
      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: comment._id } }
      );

      // If this is a reply, remove it from parent comment's replies array
      if (comment.parentCommentId) {
        await Comment.findByIdAndUpdate(
          comment.parentCommentId,
          { $pull: { replies: comment._id } }
        );
      }

      // Delete the comment
      await comment.deleteOne();

      return { message: 'Comment deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete comment');
    }
  }

  // Like/Unlike a comment
  async toggleLike(commentId: string, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid comment ID');
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new Error('Comment not found');
      }

      const userObjectId = userId;
      const likeIndex = comment.likes.findIndex(like => like === userObjectId);
      
      if (likeIndex === -1) {
        comment.likes.push(userObjectId);
      } else {
        comment.likes.splice(likeIndex, 1);
      }

      await comment.save();
      return comment;
    } catch (error) {
      throw new Error('Failed to toggle like');
    }
  }

  // Dislike/Undislike a comment
  async toggleDislike(commentId: string, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error('Invalid comment ID');
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new Error('Comment not found');
      }

      const userObjectId = userId;
      const dislikeIndex = comment.dislikes.findIndex(dislike => dislike === userObjectId);
      
      if (dislikeIndex === -1) {
        comment.dislikes.push(userObjectId);
      } else {
        comment.dislikes.splice(dislikeIndex, 1);
      }

      await comment.save();
      return comment;
    } catch (error) {
      throw new Error('Failed to toggle dislike');
    }
  }
}

export default new CommentService();

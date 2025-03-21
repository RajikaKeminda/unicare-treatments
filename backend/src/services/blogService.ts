import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import Media from '../models/mediaModel.js';
import Post from '../models/postModel.js';

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  category: z.string().min(1, 'Category is required'),
  isPublished: z.boolean().optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  isPublished: z.boolean().optional(),
});

class BlogService {
  // Create a new post
  async createPost(postData: any, userId: string) {
    try {
      // Validate input data
      const validatedData = createPostSchema.parse(postData);

      // Create new post
      const post = new Post({
        ...validatedData,
        author: userId,
      });

      await post.save();
      return post;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error('Failed to create post');
    }
  }

  // Get all posts with pagination and filters
  async getAllPosts(page: number = 1, limit: number = 10, filters: any = {}) {
    try {
      const query: any = {};
      
      // Apply filters
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.isPublished !== undefined) {
        query.isPublished = filters.isPublished;
      }
      if (filters.author) {
        query.author = new Types.ObjectId(filters.author);
      }

      const posts = await Post.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Post.countDocuments(query);

      return {
        posts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch posts');
    }
  }

  // Get a single post by ID
  async getPostById(postId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId)
        .populate('author', 'name email')
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            select: 'name email',
          },
        });

      if (!post) {
        throw new Error('Post not found');
      }

      // Increment view count
      post.views += 1;
      await post.save();

      return post;
    } catch (error) {
      throw new Error('Failed to fetch post');
    }
  }

  // Update a post
  async updatePost(postId: string, updateData: any, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      // Validate update data
      const validatedData = updatePostSchema.parse(updateData);

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user is the author
      if (post.author && post.author !== userId) {
        throw new Error('Unauthorized to update this post');
      }

      // Update post
      Object.assign(post, validatedData);
      await post.save();

      return post;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error('Failed to update post');
    }
  }

  // Delete a post
  async deletePost(postId: string, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user is the author
      if (post.author && post.author.toString() !== userId) {
        throw new Error('Unauthorized to delete this post');
      }

      // Delete associated media
      await Media.deleteMany({ postId: new Types.ObjectId(postId) });

      // Delete the post
      await post.deleteOne();

      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  }

  // Like/Unlike a post
  async toggleLike(postId: string, userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      const userObjectId = userId;
      const likeIndex = post.likes.findIndex(like => like === userObjectId);
      
      if (likeIndex === -1) {
        post.likes.push(userObjectId);
      } else {
        post.likes.splice(likeIndex, 1);
      }

      await post.save();
      return post;
    } catch (error) {
      throw new Error('Failed to toggle like');
    }
  }
}

export default new BlogService();

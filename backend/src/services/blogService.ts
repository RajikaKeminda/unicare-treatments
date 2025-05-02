import mongoose, { Types } from 'mongoose';
import { z } from 'zod';
import Media from '../models/mediaModel.js';
import Post from '../models/postModel.js';
import contentSimilarityService from './contentSimilarityService.ts';
import Product from '../models/productModel.ts';
import mediaService from './mediaService.ts';
import PDFDocument from 'pdfkit';

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  isPublished: z.boolean().optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  thumbnail: z.string().optional().nullable(),
  category: z.string().min(1, 'Category is required').optional(),
  isPublished: z.boolean().optional(),
});

class BlogService {
  // Create a new post
  async createPost(postData: any, userId: string) {
    try {
      // Validate input data
      const validatedData = createPostSchema.parse(postData);

      //remove thumbnail if it is null
      if (validatedData.thumbnail === null) {
        delete validatedData.thumbnail;
      }

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
      if(filters.search) {
        query.title = filters.search;
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
    console.log(updateData, postId, userId)
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
      if (validatedData.title) {
        post.title = validatedData.title;
      }
      if (validatedData.content) {
        post.content = validatedData.content;
      }
      if (validatedData.category) {
        post.category = validatedData.category;
      }
      if (validatedData.thumbnail) {
        post.thumbnail = validatedData.thumbnail;
      }
      if (validatedData.isPublished) {
        post.isPublished = validatedData.isPublished;
      }
      await post.save();

      return post;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      console.log(error)
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

  async getSimilarPosts(postId: string) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const allPosts = await Post.find({});

      const similarPosts = await contentSimilarityService.findSimilarPosts({ id: post._id.toString(), title: post.title, content: post.content }, allPosts.map(p => ({ id: p._id.toString(), title: p.title, content: p.content })));
      
      const data = [];
      for (const post of similarPosts) {
        const p = await Post.findById(post.post.id);
        if (p) {
          data.push(p);
        }
      }
      return data;
    } catch (error) {
      throw new Error('Failed to get similar posts');
    }
  }

  async getPostRecommendations(postId: string) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const allProducts = await Product.find({});
      const similarProducts = await contentSimilarityService.findSimilarPosts({ id: post._id.toString(), title: post.title, content: post.content }, allProducts.map(p => ({ id: p._id.toString(), title: p.name, content: p.description })));
      
      const data = [];
      for (const post of similarProducts) {
        const p = await Product.findById(post.post.id);
        if(p?.s3Key) {
          const url = await mediaService.generateViewUrl(Buffer.from(p.s3Key).toString('base64'));
          p.s3Key = url;
        }
        if (p) {
          data.push(p);
        }
      }
      return data;
    } catch (error) {
      throw new Error('Failed to get post recommendations');
    }
  }

  async generateReport() {
    try {
      // Get all posts
      const posts = await Post.find({})
        .populate('author', 'name email')
        .populate('comments');

      // Calculate insights
      const totalPosts = posts.length;
      const totalComments = posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0);
      const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
      const totalLikes = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
      
      // Get category distribution
      const categoryDistribution = posts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get top posts by views
      const topPostsByViews = [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      // Create PDF document
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));

      // Add content to PDF
      doc.fontSize(25).text('Blog Analytics Report', { align: 'center' });
      doc.moveDown();

      // Overview section
      doc.fontSize(16).text('Overview');
      doc.fontSize(12).text(`Total Posts: ${totalPosts}`);
      doc.text(`Total Comments: ${totalComments}`);
      doc.text(`Total Views: ${totalViews}`);
      doc.text(`Total Likes: ${totalLikes}`);
      doc.moveDown();

      // Category distribution
      doc.fontSize(16).text('Category Distribution');
      Object.entries(categoryDistribution).forEach(([category, count]) => {
        doc.fontSize(12).text(`${category}: ${count} posts`);
      });
      doc.moveDown();

      // Top posts
      doc.fontSize(16).text('Top Posts by Views');
      topPostsByViews.forEach((post, index) => {
        doc.fontSize(12).text(`${index + 1}. ${post.title}`);
        doc.fontSize(10).text(`Views: ${post.views || 0} | Comments: ${post.comments?.length || 0} | Likes: ${post.likes?.length || 0}`);
        doc.moveDown(0.5);
      });

      // Finalize PDF
      doc.end();

      // Return PDF buffer
      return new Promise<Buffer>((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      });
    } catch (error) {
      throw new Error('Failed to generate report');
    }
  }
}

export default new BlogService();

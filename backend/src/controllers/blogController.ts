import { Request, Response } from 'express';
import blogService from '../services/blogService.js';


class BlogController {
  // Create a new blog post
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const post = await blogService.createPost(req.body, req.user?._id || '');
      res.status(201).json({
        success: true,
        data: post,
      });
      return;
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
      return;
    }
  }

  // Get all blog posts with pagination and filters
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      // Apply filters from query parameters
      if (req.query.category) {
        filters.category = req.query.category;
      }
      if (req.query.search) {
        filters.search = { $regex: req.query.search, $options: 'i' };
      }

      const result = await blogService.getAllPosts(page, limit, filters);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get a single blog post by ID
  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const post = await blogService.getPostById(req.params.id);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Update a blog post
  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const post = await blogService.updatePost(req.params.id, req.body, req.user?._id || '');
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Delete a blog post
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const result = await blogService.deletePost(req.params.id, req.user?._id || '');
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Toggle like on a blog post
  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const post = await blogService.toggleLike(req.params.id, req.user?._id || '');
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getSimilarPosts(req: Request, res: Response): Promise<void> {
    try {
      const similarPosts = await blogService.getSimilarPosts(req.params.id);
      res.status(200).json({
        success: true,
        data: similarPosts,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getPostRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const postRecommendations = await blogService.getPostRecommendations(req.params.id);
      res.status(200).json({
        success: true,
        data: postRecommendations,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const pdfBuffer = await blogService.generateReport();
      
      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=blog-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Send the PDF buffer
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new BlogController();

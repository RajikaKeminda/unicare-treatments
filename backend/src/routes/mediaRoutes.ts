import express from 'express';
import {
  generateUploadUrl,
  generateViewUrl,
  deleteMedia,
  getMediaById,
  getMediaByPostId,
  getAllMedia,
} from '../controllers/mediaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all media
router.get('/', getAllMedia);

// Generate upload URL
router.post('/upload-url', generateUploadUrl);

// Generate view URL
router.get('/view-url/:key', generateViewUrl);

// Delete media
router.delete('/:mediaId', deleteMedia);

// Get media by ID
router.get('/:mediaId', getMediaById);

// Get all media for a post
router.get('/post/:postId', getMediaByPostId);

export default router; 
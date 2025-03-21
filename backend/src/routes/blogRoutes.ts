import express from 'express';
import blogController from '../controllers/blogController.ts';
import { authenticateToken } from '../middleware/auth.ts';


const router = express.Router();

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);

// Protected routes (require authentication)
router.post('/', authenticateToken, blogController.createPost);
router.put('/:id', authenticateToken, blogController.updatePost);
router.delete('/:id', authenticateToken, blogController.deletePost);
router.post('/:id/like', authenticateToken, blogController.toggleLike);

export default router;

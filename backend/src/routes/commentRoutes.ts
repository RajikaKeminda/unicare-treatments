import express from 'express';
import commentController from '../controllers/commectController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router = express.Router();

// Public routes
router.get('/post/:postId', commentController.getPostComments);
router.get('/:commentId/replies', commentController.getCommentReplies);

// Protected routes (require authentication)
router.post('/', authenticateToken, commentController.createComment);
router.put('/:commentId', authenticateToken, commentController.updateComment);
router.delete('/:commentId', authenticateToken, commentController.deleteComment);
router.post('/:commentId/like', authenticateToken, commentController.toggleLike);
router.post('/:commentId/dislike', authenticateToken, commentController.toggleDislike);

export default router; 
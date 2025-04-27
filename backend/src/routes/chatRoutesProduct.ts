import express from 'express';
import { processMessage } from '../controllers/chatController.ts';

const router = express.Router();

router.post('/chat', processMessage);

export default router;
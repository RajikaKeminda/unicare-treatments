import express from 'express';
import { processMessage } from '../controllers/chatController.ts';
import { getMessageHistory } from '../controllers/chatController.ts';


const router = express.Router();

router.post('/chat', processMessage);

router.get('/history/:userId', getMessageHistory);

export default router;
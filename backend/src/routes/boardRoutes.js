import { Router } from 'express';
import { analyzeBoard } from '../controllers/boardController.js';
import { uploadBoardImage } from '../middleware/upload.js';

const router = Router();

router.post('/analyze-board', uploadBoardImage.single('image'), analyzeBoard);

export default router;

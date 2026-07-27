import { Router } from 'express';
import { analyzeBoard, getBoardConfig } from '../controllers/boardController.js';
import { uploadBoardImage } from '../middleware/upload.js';

const router = Router();

router.get('/config', getBoardConfig);
router.post('/analyze-board', uploadBoardImage.single('image'), analyzeBoard);

export default router;

import { Router } from 'express';
import {
  analyzeBoard,
  getBoardConfig,
  listBoardAnalyses,
  registerUser,
} from '../controllers/boardController.js';
import { uploadBoardImage } from '../middleware/upload.js';

const router = Router();

router.get('/config', getBoardConfig);
router.get('/analyses', listBoardAnalyses);
router.post('/users/register', registerUser);
router.post('/analyze-board', uploadBoardImage.single('image'), analyzeBoard);

export default router;

import { Router } from 'express';
import {
  getCurrentUser,
  logout,
  signIn,
  signUp,
} from '../controllers/authController.js';

const router = Router();

router.get('/me', getCurrentUser);
router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/logout', logout);

export default router;

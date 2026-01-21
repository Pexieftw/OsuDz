import express from 'express';
import {
  getClientToken,
  exchangeCodeForToken,
  refreshUserToken,
  getCurrentUser,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/token', getClientToken);
router.post('/callback', exchangeCodeForToken);
router.post('/refresh', refreshUserToken);
router.get('/me', getCurrentUser);

export default router;
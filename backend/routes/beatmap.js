import express from 'express';
import {
  getBeatmapset,
  calculateDifficulty,
} from '../controllers/beatmapController.js';

const router = express.Router();

router.get('/beatmapsets/:id', getBeatmapset);
router.post('/calculate-difficulty', calculateDifficulty);

export default router;
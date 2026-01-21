import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import beatmapRoutes from './routes/beatmap.js';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', beatmapRoutes);

app.listen(PORT, () => {
  console.log(`[.] Backend server running on http://localhost:${PORT}`);
});
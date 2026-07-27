import cors from 'cors';
import express from 'express';
import boardRoutes from './routes/boardRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') ?? 'http://localhost:5173',
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', boardRoutes);

app.use((err, _req, res, _next) => {
  const statusCode =
    err.statusCode || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500);

  res.status(statusCode).json({
    message:
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image size must be under 8MB.'
        : statusCode === 500
        ? 'Something went wrong while analyzing the board.'
        : err.message,
  });
});

export default app;

import cors from 'cors';
import express from 'express';
import boardRoutes from './routes/boardRoutes.js';

const app = express();

const configuredOrigins =
  process.env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()) ?? [];

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        configuredOrigins.includes(origin) ||
        origin === 'http://localhost:5173' ||
        origin === 'http://127.0.0.1:5173' ||
        origin.endsWith('.onrender.com')
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('This origin is not allowed by CORS.'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'Multimodal Track API',
    status: 'ok',
    health: '/health',
  });
});

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

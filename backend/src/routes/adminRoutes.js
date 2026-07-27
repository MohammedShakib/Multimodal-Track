import express from 'express';
import {
  getDatabaseStatus,
  getAdminStats,
  getAllUsers,
  deleteUser,
  addUser,
} from '../services/databaseService.js';

const router = express.Router();

// Simple super-admin auth middleware
function requireSuperAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== 'sadmin-secret-token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// GET /api/v1/admin/health - database + server status
router.get('/health', requireSuperAdmin, async (_req, res) => {
  const database = await getDatabaseStatus();
  res.json({
    status: 'ok',
    database,
    serverTime: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
});

// GET /api/v1/admin/stats - total users, total analyses, etc.
router.get('/stats', requireSuperAdmin, async (_req, res) => {
  const stats = await getAdminStats();
  res.json(stats);
});

// GET /api/v1/admin/users - list all unique users
router.get('/users', requireSuperAdmin, async (_req, res) => {
  const users = await getAllUsers();
  res.json({ users });
});

// DELETE /api/v1/admin/users/:email
router.delete('/users/:email', requireSuperAdmin, async (req, res) => {
  const { email } = req.params;
  const deleted = await deleteUser(email);
  res.json({ success: deleted, email });
});

// POST /api/v1/admin/users - manually add a user record
router.post('/users', requireSuperAdmin, async (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await addUser({ name: name || email.split('@')[0], email });
  res.json({ success: true, user });
});

export default router;

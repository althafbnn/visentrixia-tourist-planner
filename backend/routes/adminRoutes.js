import { Router } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/audit-logs', authenticate, requireAdmin, async (req, res) => {
  try {
    const count = await AuditLog.countDocuments();
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    return res.json({ success: true, count, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
});

export default router;

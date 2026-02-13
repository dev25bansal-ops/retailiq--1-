import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth as authenticateToken } from '../middleware/auth';

const router = Router();

// GET / - Get user alerts
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { limit = 20, offset = 0, type, read } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM price_alerts WHERE user_id = ?';
    const params: any[] = [userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (read !== undefined) {
      query += ' AND is_active = ?';
      params.push(read === 'true' ? 0 : 1);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const alerts = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM price_alerts WHERE user_id = ?').get(userId) as any;

    res.json({ success: true, alerts, total: total.count });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST / - Create alert
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId, targetPrice, percentageDrop } = req.body;
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO price_alerts (user_id, product_id, target_price, percentage_drop, is_active, created_at)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run(userId, productId, targetPrice || null, percentageDrop || null, new Date().toISOString());

    res.json({ success: true, alertId: result.lastInsertRowid });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /:id/read - Mark as read (toggle active)
router.patch('/:id/read', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const db = getDb();

    db.prepare('UPDATE price_alerts SET is_active = 0 WHERE id = ? AND user_id = ?').run(id, userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /read-all - Mark all as read
router.patch('/read-all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    const result = db.prepare('UPDATE price_alerts SET is_active = 0 WHERE user_id = ?').run(userId);
    res.json({ success: true, updated: result.changes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /:id - Delete alert
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const db = getDb();

    const result = db.prepare('DELETE FROM price_alerts WHERE id = ? AND user_id = ?').run(id, userId);
    res.json({ success: true, deleted: result.changes > 0 });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

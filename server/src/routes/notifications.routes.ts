import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth as authenticateToken } from '../middleware/auth';
import { notificationService } from '../services/notification.service';
import { sseService } from '../services/sse.service';

const router = Router();

// GET / - Get notifications
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { limit = 20, offset = 0, unreadOnly, type } = req.query;

    const result = notificationService.getNotifications(userId, {
      limit: Number(limit),
      offset: Number(offset),
      unreadOnly: unreadOnly === 'true',
      type: type as string
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /sse - SSE stream
router.get('/sse', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  sseService.addClient(userId, res);
});

// PATCH /:id/read - Mark as read
router.patch('/:id/read', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const success = notificationService.markAsRead(id, userId);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /:id - Delete notification
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const success = notificationService.deleteNotification(id, userId);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /preferences - Get notification preferences
router.get('/preferences', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const preferences = notificationService.getUserPreferences(userId);
    res.json({ success: true, preferences });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /preferences - Update preferences
router.put('/preferences', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    const prefs = req.body;
    db.prepare(`
      INSERT OR REPLACE INTO notification_preferences
      (user_id, email_enabled, sms_enabled, whatsapp_enabled, push_enabled, quiet_hours_start, quiet_hours_end, max_per_day)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      prefs.emailEnabled ? 1 : 0,
      prefs.smsEnabled ? 1 : 0,
      prefs.whatsappEnabled ? 1 : 0,
      prefs.pushEnabled ? 1 : 0,
      prefs.quietHoursStart || null,
      prefs.quietHoursEnd || null,
      prefs.maxPerDay || 20
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

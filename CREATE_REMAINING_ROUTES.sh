#!/bin/bash

# Script to create all remaining route files for RetailIQ
# Run this from the server directory: bash CREATE_REMAINING_ROUTES.sh

ROUTES_DIR="src/routes"

echo "Creating remaining route files..."

# Create alerts.routes.ts
cat > "$ROUTES_DIR/alerts.routes.ts" << 'EOF'
import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { authenticateToken } from '../middleware/auth.middleware';

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
EOF

# Create notifications.routes.ts
cat > "$ROUTES_DIR/notifications.routes.ts" << 'EOF'
import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { authenticateToken } from '../middleware/auth.middleware';
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
EOF

# Create predictions.routes.ts
cat > "$ROUTES_DIR/predictions.routes.ts" << 'EOF'
import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { predictPrices } from '../ml/forecasting';
import { generateBuyRecommendation } from '../ml/recommendations';
import { forecastDemand } from '../ml/demand';

const router = Router();

// GET /product/:id - Price predictions
router.get('/product/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    const db = getDb();

    // Get price history
    const history = db.prepare(`
      SELECT DATE(recorded_at) as date, AVG(price) as price
      FROM price_history
      WHERE product_id = ? AND recorded_at >= datetime('now', '-90 days')
      GROUP BY DATE(recorded_at)
      ORDER BY date ASC
    `).all(id) as any[];

    const predictions = predictPrices(history, Number(days));

    res.json({ success: true, predictions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /best-time/:id - Best time to buy
router.get('/best-time/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const history = db.prepare(`
      SELECT DATE(recorded_at) as date, AVG(price) as price
      FROM price_history
      WHERE product_id = ?
      ORDER BY date ASC
    `).all(id) as any[];

    const predictions = predictPrices(history, 30);
    const bestPrediction = predictions.reduce((best, curr) =>
      curr.predictedPrice < best.predictedPrice ? curr : best
    );

    res.json({ success: true, bestTime: bestPrediction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /buy-or-wait/:id - Buy or wait recommendation
router.get('/buy-or-wait/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    const history = db.prepare(`
      SELECT DATE(recorded_at) as date, AVG(price) as price
      FROM price_history
      WHERE product_id = ?
      ORDER BY date ASC
    `).all(id) as any[];

    const predictions = predictPrices(history, 30);
    const recommendation = generateBuyRecommendation(id, history, predictions, product.category);

    res.json({ success: true, recommendation });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /demand/:category - Demand forecast
router.get('/demand/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { days = 30 } = req.query;

    // Mock historical demand data
    const historicalData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      demand: 100 + Math.random() * 50,
      category
    }));

    const forecasts = forecastDemand(category, historicalData, Number(days));

    res.json({ success: true, forecasts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
EOF

echo "✅ Created alerts.routes.ts"
echo "✅ Created notifications.routes.ts"
echo "✅ Created predictions.routes.ts"
echo ""
echo "Remaining routes to create manually:"
echo "  - festivals.routes.ts"
echo "  - deals.routes.ts"
echo "  - chat.routes.ts"
echo "  - msme.routes.ts"
echo "  - subscriptions.routes.ts"
echo "  - payments.routes.ts"
echo "  - analytics.routes.ts"
echo "  - health.routes.ts"
echo "  - index.ts (master router)"
echo ""
echo "Follow the same pattern as the created files!"

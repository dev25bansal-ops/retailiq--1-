/**
 * Watchlist Routes
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth as authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET / - Get user's watchlist with product details
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    const watchlist = db
      .prepare(
        `
      SELECT
        w.*,
        p.*,
        (SELECT MIN(price) FROM platform_prices WHERE product_id = w.product_id AND stock_status = 'in_stock') as best_price,
        (SELECT platform FROM platform_prices WHERE product_id = w.product_id AND stock_status = 'in_stock' ORDER BY price ASC LIMIT 1) as best_platform,
        (SELECT COUNT(*) FROM price_alerts WHERE product_id = w.product_id AND user_id = ?) as alerts_count
      FROM watchlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `
      )
      .all(userId, userId) as any[];

    res.json({
      success: true,
      watchlist: watchlist.map(item => ({
        productId: item.product_id,
        name: item.name,
        category: item.category,
        brand: item.brand,
        imageUrl: item.image_url,
        targetPrice: item.target_price,
        bestPrice: item.best_price,
        bestPlatform: item.best_platform,
        alertsCount: item.alerts_count,
        addedAt: item.created_at
      }))
    });
  } catch (error: any) {
    console.error('Error getting watchlist:', error);
    res.status(500).json({ success: false, error: 'Failed to get watchlist' });
  }
});

/**
 * POST / - Add product to watchlist
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId, targetPrice } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    const db = getDb();

    // Check if already in watchlist
    const existing = db
      .prepare('SELECT * FROM watchlist WHERE user_id = ? AND product_id = ?')
      .get(userId, productId);

    if (existing) {
      return res.status(400).json({ success: false, error: 'Product already in watchlist' });
    }

    // Add to watchlist
    db.prepare(
      `
      INSERT INTO watchlist (user_id, product_id, target_price, created_at)
      VALUES (?, ?, ?, ?)
    `
    ).run(userId, productId, targetPrice || null, new Date().toISOString());

    return res.json({ success: true, message: 'Product added to watchlist' });
  } catch (error: any) {
    console.error('Error adding to watchlist:', error);
    return res.status(500).json({ success: false, error: 'Failed to add to watchlist' });
  }
});

/**
 * DELETE /:productId - Remove from watchlist
 */
router.delete('/:productId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.params;

    const db = getDb();

    const result = db
      .prepare('DELETE FROM watchlist WHERE user_id = ? AND product_id = ?')
      .run(userId, productId);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Product not in watchlist' });
    }

    return res.json({ success: true, message: 'Product removed from watchlist' });
  } catch (error: any) {
    console.error('Error removing from watchlist:', error);
    return res.status(500).json({ success: false, error: 'Failed to remove from watchlist' });
  }
});

export default router;

/**
 * Festival Routes
 * Manages festival listings and details
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';

const router = Router();

/**
 * GET / - List all festivals
 * @access Public
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = getDb();

    const festivals = db
      .prepare(
        `
        SELECT *
        FROM festivals
        WHERE is_active = 1
        ORDER BY start_date ASC
        `
      )
      .all();

    res.json({
      success: true,
      festivals
    });
  } catch (error: any) {
    console.error('Error getting festivals:', error);
    res.status(500).json({ success: false, error: 'Failed to get festivals' });
  }
});

/**
 * GET /upcoming - Get upcoming festivals (next 60 days)
 * @access Public
 */
router.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    const sixtyDaysLater = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

    const festivals = db
      .prepare(
        `
        SELECT *
        FROM festivals
        WHERE is_active = 1
          AND start_date >= ?
          AND start_date <= ?
        ORDER BY start_date ASC
        `
      )
      .all(now, sixtyDaysLater);

    res.json({
      success: true,
      festivals
    });
  } catch (error: any) {
    console.error('Error getting upcoming festivals:', error);
    res.status(500).json({ success: false, error: 'Failed to get upcoming festivals' });
  }
});

/**
 * GET /:id - Get festival details by ID
 * @access Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const festival = db
      .prepare(
        `
        SELECT *
        FROM festivals
        WHERE id = ? AND is_active = 1
        `
      )
      .get(id);

    if (!festival) {
      return res.status(404).json({
        success: false,
        error: 'Festival not found'
      });
    }

    return res.json({
      success: true,
      festival
    });
  } catch (error: any) {
    console.error('Error getting festival details:', error);
    return res.status(500).json({ success: false, error: 'Failed to get festival details' });
  }
});

export default router;

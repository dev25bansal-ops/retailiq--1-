/**
 * Analytics Routes
 */

import { Router, Request, Response } from 'express';
import { requireAuth as authenticateToken } from '../middleware/auth';
import { analyticsService } from '../services/analytics.service';

const router = Router();

/**
 * POST /event - Track event
 */
router.post('/event', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { sessionId, eventType, properties } = req.body;

    if (!eventType) {
      return res.status(400).json({ success: false, error: 'Event type is required' });
    }

    const eventId = await analyticsService.trackEvent({
      userId,
      sessionId,
      eventType,
      properties
    });

    return res.json({ success: true, eventId });
  } catch (error: any) {
    console.error('Error tracking event:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /dashboard - Get dashboard metrics
 */
router.get('/dashboard', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { startDate, endDate } = req.query;

    let dateRange;
    if (startDate && endDate) {
      dateRange = {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      };
    }

    const metrics = analyticsService.getDashboardMetrics(userId, dateRange);

    res.json({ success: true, metrics });
  } catch (error: any) {
    console.error('Error getting dashboard metrics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /export - Export user data
 */
router.get('/export', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { format = 'csv' } = req.query;

    const data = analyticsService.exportData(userId, format as 'csv' | 'json');

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="retailiq-data-${userId}.json"`);
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="retailiq-data-${userId}.csv"`);
    }

    res.send(data);
  } catch (error: any) {
    console.error('Error exporting data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /top-products - Get top products
 */
router.get('/top-products', async (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;
    const products = analyticsService.getTopProducts(Number(limit));

    res.json({ success: true, products });
  } catch (error: any) {
    console.error('Error getting top products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /trending - Get trending searches
 */
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    const searches = analyticsService.getTrendingSearches(Number(limit));

    res.json({ success: true, searches });
  } catch (error: any) {
    console.error('Error getting trending searches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /engagement - Get user engagement
 */
router.get('/engagement', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { days = 30 } = req.query;

    const engagement = analyticsService.getUserEngagement(userId, Number(days));

    res.json({ success: true, engagement });
  } catch (error: any) {
    console.error('Error getting engagement:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /platform-stats - Get platform-wide statistics
 */
router.get('/platform-stats', async (_req: Request, res: Response) => {
  try {
    const stats = analyticsService.getPlatformStats();
    res.json({ success: true, stats });
  } catch (error: any) {
    console.error('Error getting platform stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

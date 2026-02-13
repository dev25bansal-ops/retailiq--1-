/**
 * Health Check Routes
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';

const router = Router();

const startTime = Date.now();

/**
 * GET / - Health check
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = getDb();

    // Test database connectivity
    let dbStatus = 'healthy';
    let dbError = null;

    try {
      db.prepare('SELECT 1').get();
    } catch (error: any) {
      dbStatus = 'unhealthy';
      dbError = error.message;
    }

    // Calculate uptime
    const uptime = Math.floor((Date.now() - startTime) / 1000);

    // Get version from package.json (mock)
    const version = process.env.npm_package_version || '1.0.0';

    res.json({
      success: true,
      status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime)
      },
      version,
      database: {
        status: dbStatus,
        error: dbError
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export default router;

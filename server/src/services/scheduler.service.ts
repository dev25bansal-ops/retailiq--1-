/**
 * Scheduler Service
 * Manages all cron jobs for periodic tasks
 */

import cron from 'node-cron';
import { getDb } from '../config/database';
import { updatePriceBatch } from './scraper.service';
import { predictPrices } from '../ml/forecasting';
import { notificationService } from './notification.service';

let isInitialized = false;
const jobs: cron.ScheduledTask[] = [];

/**
 * Check price alerts and notify users
 */
async function checkPriceAlerts(): Promise<void> {
  const db = getDb();

  console.log('[Scheduler] Checking price alerts...');

  // Get all active price alerts
  const alerts = db
    .prepare(
      `
    SELECT
      pa.*,
      p.name as product_name,
      p.image_url,
      p.category,
      u.email,
      u.phone
    FROM price_alerts pa
    JOIN products p ON pa.product_id = p.id
    JOIN users u ON pa.user_id = u.id
    WHERE pa.is_active = 1
  `
    )
    .all() as any[];

  let triggered = 0;

  for (const alert of alerts) {
    // Get current best price
    const bestPrice = db
      .prepare(
        `
      SELECT MIN(price) as min_price, platform
      FROM platform_prices
      WHERE product_id = ? AND stock_status = 'in_stock'
      GROUP BY product_id
      ORDER BY min_price ASC
      LIMIT 1
    `
      )
      .get(alert.product_id) as any;

    if (!bestPrice) continue;

    let shouldTrigger = false;
    let reason = '';

    // Check if target price is met
    if (alert.target_price && bestPrice.min_price <= alert.target_price) {
      shouldTrigger = true;
      reason = `Price dropped to ₹${bestPrice.min_price} (Target: ₹${alert.target_price})`;
    }

    // Check if percentage drop threshold is met
    if (alert.percentage_drop) {
      const priceHistory = db
        .prepare(
          `
        SELECT price
        FROM price_history
        WHERE product_id = ? AND platform = ?
        ORDER BY recorded_at DESC
        LIMIT 1 OFFSET 1
      `
        )
        .get(alert.product_id, bestPrice.platform) as any;

      if (priceHistory) {
        const dropPercent =
          ((priceHistory.price - bestPrice.min_price) / priceHistory.price) * 100;

        if (dropPercent >= alert.percentage_drop) {
          shouldTrigger = true;
          reason = `Price dropped by ${Math.round(dropPercent)}% (Threshold: ${
            alert.percentage_drop
          }%)`;
        }
      }
    }

    if (shouldTrigger) {
      // Create notification
      const notification = {
        userId: alert.user_id,
        type: 'price_alert',
        title: `Price Alert: ${alert.product_name}`,
        message: reason,
        data: {
          productId: alert.product_id,
          currentPrice: bestPrice.min_price,
          platform: bestPrice.platform,
          targetPrice: alert.target_price,
          productName: alert.product_name,
          imageUrl: alert.image_url
        },
        priority: 'high' as const
      };

      // Get user notification preferences
      const preferences = db
        .prepare(
          `
        SELECT * FROM notification_preferences
        WHERE user_id = ?
      `
        )
        .get(alert.user_id) as any;

      const channels: ('push' | 'email' | 'sms' | 'whatsapp')[] = ['push'];

      if (preferences) {
        if (preferences.email_enabled) channels.push('email');
        if (preferences.sms_enabled) channels.push('sms');
        if (preferences.whatsapp_enabled) channels.push('whatsapp');
      }

      await notificationService.sendNotification(alert.user_id, notification, channels);

      // Update alert last_triggered
      db.prepare(
        `
        UPDATE price_alerts
        SET last_triggered = ?,
            trigger_count = trigger_count + 1
        WHERE id = ?
      `
      ).run(new Date().toISOString(), alert.id);

      triggered++;
    }
  }

  console.log(`[Scheduler] Triggered ${triggered} price alerts`);
}

/**
 * Generate predictions for top products
 */
async function generatePredictions(): Promise<void> {
  const db = getDb();

  console.log('[Scheduler] Generating price predictions...');

  // Get top tracked products
  const topProducts = db
    .prepare(
      `
    SELECT p.id, p.name, p.category, COUNT(w.product_id) as watchers
    FROM products p
    LEFT JOIN watchlist w ON p.id = w.product_id
    GROUP BY p.id
    ORDER BY watchers DESC
    LIMIT 50
  `
    )
    .all() as any[];

  let generated = 0;

  for (const product of topProducts) {
    try {
      // Get price history (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const priceHistory = db
        .prepare(
          `
        SELECT
          DATE(recorded_at) as date,
          AVG(price) as price
        FROM price_history
        WHERE product_id = ? AND recorded_at >= ?
        GROUP BY DATE(recorded_at)
        ORDER BY date ASC
      `
        )
        .all(product.id, ninetyDaysAgo.toISOString()) as any[];

      if (priceHistory.length < 7) continue; // Need at least 7 days of data

      // Generate 30-day predictions
      const predictions = predictPrices(priceHistory, 30);

      // Store predictions in database (clear old ones first)
      db.prepare(
        `
        DELETE FROM price_predictions
        WHERE product_id = ? AND predicted_date <= ?
      `
      ).run(product.id, new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString());

      const insertStmt = db.prepare(`
        INSERT INTO price_predictions
        (product_id, predicted_date, predicted_price, confidence, lower_bound, upper_bound)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const pred of predictions) {
        insertStmt.run(
          product.id,
          pred.date,
          pred.predictedPrice,
          pred.confidence,
          pred.lowerBound,
          pred.upperBound
        );
      }

      generated++;
    } catch (error) {
      console.error(`Error generating predictions for ${product.id}:`, error);
    }
  }

  console.log(`[Scheduler] Generated predictions for ${generated} products`);
}

/**
 * Run repricing engine for MSME users
 */
async function runRepricingEngine(): Promise<void> {
  const db = getDb();

  console.log('[Scheduler] Running repricing engine...');

  // Get all active repricing rules
  const rules = db
    .prepare(
      `
    SELECT rr.*, u.id as user_id
    FROM repricing_rules rr
    JOIN users u ON rr.msme_id = u.id
    WHERE rr.is_active = 1
  `
    )
    .all() as any[];

  let repriced = 0;

  for (const rule of rules) {
    try {
      // Get inventory items matching rule
      const items = db
        .prepare(
          `
        SELECT * FROM inventory
        WHERE msme_id = ? AND category = ? AND quantity > 0
      `
        )
        .all(rule.msme_id, rule.category) as any[];

      for (const item of items) {
        // Get competitor prices
        const competitorPrices = db
          .prepare(
            `
          SELECT MIN(price) as min_price, MAX(price) as max_price, AVG(price) as avg_price
          FROM platform_prices pp
          JOIN products p ON pp.product_id = p.id
          WHERE p.category = ? AND pp.stock_status = 'in_stock'
        `
          )
          .get(rule.category) as any;

        if (!competitorPrices) continue;

        let newPrice = item.price;

        // Apply repricing strategy
        switch (rule.strategy) {
          case 'match_lowest':
            newPrice = competitorPrices.min_price;
            break;

          case 'undercut_lowest':
            newPrice = competitorPrices.min_price * (1 - rule.adjustment_percent / 100);
            break;

          case 'above_market':
            newPrice = competitorPrices.avg_price * (1 + rule.adjustment_percent / 100);
            break;

          case 'match_average':
            newPrice = competitorPrices.avg_price;
            break;
        }

        // Apply min/max price bounds
        if (rule.min_price && newPrice < rule.min_price) {
          newPrice = rule.min_price;
        }
        if (rule.max_price && newPrice > rule.max_price) {
          newPrice = rule.max_price;
        }

        // Update price if changed significantly (>1%)
        const changePercent = Math.abs((newPrice - item.price) / item.price) * 100;

        if (changePercent > 1) {
          db.prepare(
            `
            UPDATE inventory
            SET price = ?, updated_at = ?
            WHERE id = ?
          `
          ).run(Math.round(newPrice), new Date().toISOString(), item.id);

          // Log price change
          db.prepare(
            `
            INSERT INTO repricing_logs
            (msme_id, inventory_id, old_price, new_price, reason, rule_id)
            VALUES (?, ?, ?, ?, ?, ?)
          `
          ).run(
            rule.msme_id,
            item.id,
            item.price,
            Math.round(newPrice),
            `Applied ${rule.strategy} strategy`,
            rule.id
          );

          repriced++;
        }
      }
    } catch (error) {
      console.error(`Error processing repricing rule ${rule.id}:`, error);
    }
  }

  console.log(`[Scheduler] Repriced ${repriced} items`);
}

/**
 * Clean up old data
 */
async function cleanupOldData(): Promise<void> {
  const db = getDb();

  console.log('[Scheduler] Cleaning up old data...');

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Delete old price history (keep last 6 months)
  const deletedHistory = db
    .prepare(
      `
    DELETE FROM price_history
    WHERE recorded_at < ?
  `
    )
    .run(sixMonthsAgo.toISOString());

  // Delete old notifications (keep last 3 months)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const deletedNotifications = db
    .prepare(
      `
    DELETE FROM notifications
    WHERE created_at < ? AND is_read = 1
  `
    )
    .run(threeMonthsAgo.toISOString());

  // Delete old analytics events (keep last 6 months)
  const deletedEvents = db
    .prepare(
      `
    DELETE FROM analytics_events
    WHERE created_at < ?
  `
    )
    .run(sixMonthsAgo.toISOString());

  console.log(
    `[Scheduler] Cleaned up: ${deletedHistory.changes} price history, ${deletedNotifications.changes} notifications, ${deletedEvents.changes} events`
  );
}

/**
 * Initialize scheduler with all cron jobs
 */
export function initScheduler(): void {
  if (isInitialized) {
    console.log('[Scheduler] Already initialized');
    return;
  }

  console.log('[Scheduler] Initializing...');

  // Every 3 minutes: Update prices for a batch of products
  const priceUpdateJob = cron.schedule('*/3 * * * *', async () => {
    try {
      const result = await updatePriceBatch(50);
      console.log(`[Scheduler] Updated ${result.updated} prices (${result.errors} errors)`);
    } catch (error) {
      console.error('[Scheduler] Error updating prices:', error);
    }
  });

  // Every 30 minutes: Check price alerts
  const alertCheckJob = cron.schedule('*/30 * * * *', async () => {
    try {
      await checkPriceAlerts();
    } catch (error) {
      console.error('[Scheduler] Error checking alerts:', error);
    }
  });

  // Every hour: Generate predictions
  const predictionJob = cron.schedule('0 * * * *', async () => {
    try {
      await generatePredictions();
    } catch (error) {
      console.error('[Scheduler] Error generating predictions:', error);
    }
  });

  // Every 6 hours: Run repricing engine
  const repricingJob = cron.schedule('0 */6 * * *', async () => {
    try {
      await runRepricingEngine();
    } catch (error) {
      console.error('[Scheduler] Error running repricing:', error);
    }
  });

  // Every day at 3 AM: Clean up old data
  const cleanupJob = cron.schedule('0 3 * * *', async () => {
    try {
      await cleanupOldData();
    } catch (error) {
      console.error('[Scheduler] Error cleaning up:', error);
    }
  });

  jobs.push(priceUpdateJob, alertCheckJob, predictionJob, repricingJob, cleanupJob);

  isInitialized = true;
  console.log('[Scheduler] Initialized with 5 cron jobs');
}

/**
 * Stop all scheduled jobs
 */
export function stopScheduler(): void {
  console.log('[Scheduler] Stopping all jobs...');

  for (const job of jobs) {
    job.stop();
  }

  jobs.length = 0;
  isInitialized = false;

  console.log('[Scheduler] Stopped');
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): {
  initialized: boolean;
  jobCount: number;
} {
  return {
    initialized: isInitialized,
    jobCount: jobs.length
  };
}

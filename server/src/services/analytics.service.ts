/**
 * Analytics Service
 * Tracks user events and generates insights
 */

import { getDb } from '../config/database';

export type EventType =
  | 'page_view'
  | 'product_view'
  | 'product_search'
  | 'price_alert_created'
  | 'watchlist_add'
  | 'watchlist_remove'
  | 'deal_view'
  | 'deal_vote'
  | 'affiliate_click'
  | 'purchase_intent'
  | 'share'
  | 'app_install'
  | 'subscription_started'
  | 'feature_used';

interface AnalyticsEvent {
  userId?: string;
  sessionId?: string;
  eventType: EventType;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class AnalyticsService {
  /**
   * Track an event
   */
  async trackEvent(event: AnalyticsEvent): Promise<string> {
    const db = getDb();

    try {
      const result = db
        .prepare(
          `
        INSERT INTO analytics_events
        (user_id, session_id, event_type, properties, created_at)
        VALUES (?, ?, ?, ?, ?)
      `
        )
        .run(
          event.userId || null,
          event.sessionId || null,
          event.eventType,
          JSON.stringify(event.properties || {}),
          (event.timestamp || new Date()).toISOString()
        );

      return result.lastInsertRowid.toString();
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  /**
   * Track multiple events in batch
   */
  async trackBatch(events: AnalyticsEvent[]): Promise<number> {
    const db = getDb();
    let tracked = 0;

    const stmt = db.prepare(`
      INSERT INTO analytics_events
      (user_id, session_id, event_type, properties, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const event of events) {
      try {
        stmt.run(
          event.userId || null,
          event.sessionId || null,
          event.eventType,
          JSON.stringify(event.properties || {}),
          (event.timestamp || new Date()).toISOString()
        );
        tracked++;
      } catch (error) {
        console.error('Error tracking event in batch:', error);
      }
    }

    return tracked;
  }

  /**
   * Get dashboard metrics for user
   */
  getDashboardMetrics(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): {
    overview: {
      totalProductsTracked: number;
      totalPriceAlerts: number;
      totalDealsFound: number;
      totalSavings: number;
      avgSavingsPercent: number;
    };
    activity: {
      productViews: number;
      searches: number;
      watchlistChanges: number;
      dealInteractions: number;
    };
    topProducts: Array<{
      productId: string;
      productName: string;
      views: number;
      currentPrice: number;
      lowestPrice: number;
      savings: number;
    }>;
    recentActivity: any[];
  } {
    const db = getDb();

    try {
      let dateFilter = '';
      const params: any[] = [userId];

      if (dateRange) {
        dateFilter = ' AND created_at >= ? AND created_at <= ?';
        params.push(dateRange.start.toISOString(), dateRange.end.toISOString());
      }

      // Overview metrics
      const watchlistCount = db
        .prepare('SELECT COUNT(*) as count FROM watchlist WHERE user_id = ?')
        .get(userId) as any;

      const alertsCount = db
        .prepare('SELECT COUNT(*) as count FROM price_alerts WHERE user_id = ? AND is_active = 1')
        .get(userId) as any;

      const dealsResult = db
        .prepare('SELECT COUNT(*) as count FROM deals WHERE user_id = ?')
        .get(userId) as any;

      // Calculate savings from triggered alerts
      const savingsResult = db
        .prepare(
          `
        SELECT
          COUNT(*) as alerts_triggered,
          AVG(
            CASE
              WHEN target_price IS NOT NULL
              THEN ((SELECT MIN(price) FROM platform_prices WHERE product_id = pa.product_id) - target_price)
              ELSE 0
            END
          ) as avg_savings
        FROM price_alerts pa
        WHERE user_id = ? AND trigger_count > 0
      `
        )
        .get(userId) as any;

      const overview = {
        totalProductsTracked: watchlistCount.count,
        totalPriceAlerts: alertsCount.count,
        totalDealsFound: dealsResult.count,
        totalSavings: Math.max(0, Math.round((savingsResult.avg_savings || 0) * savingsResult.alerts_triggered)),
        avgSavingsPercent: 12 // Mock value - would calculate from actual data
      };

      // Activity metrics
      const activityParams = dateFilter ? [...params, ...params.slice(1)] : [userId];

      const productViewsResult = db
        .prepare(
          `
        SELECT COUNT(*) as count FROM analytics_events
        WHERE user_id = ? AND event_type = 'product_view'${dateFilter}
      `
        )
        .get(...activityParams) as any;

      const searchesResult = db
        .prepare(
          `
        SELECT COUNT(*) as count FROM analytics_events
        WHERE user_id = ? AND event_type = 'product_search'${dateFilter}
      `
        )
        .get(...activityParams) as any;

      const watchlistChangesResult = db
        .prepare(
          `
        SELECT COUNT(*) as count FROM analytics_events
        WHERE user_id = ? AND event_type IN ('watchlist_add', 'watchlist_remove')${dateFilter}
      `
        )
        .get(...activityParams) as any;

      const dealInteractionsResult = db
        .prepare(
          `
        SELECT COUNT(*) as count FROM analytics_events
        WHERE user_id = ? AND event_type IN ('deal_view', 'deal_vote')${dateFilter}
      `
        )
        .get(...activityParams) as any;

      const activity = {
        productViews: productViewsResult.count,
        searches: searchesResult.count,
        watchlistChanges: watchlistChangesResult.count,
        dealInteractions: dealInteractionsResult.count
      };

      // Top products
      const topProducts = db
        .prepare(
          `
        SELECT
          p.id as product_id,
          p.name as product_name,
          COUNT(ae.id) as views,
          (SELECT MIN(price) FROM platform_prices WHERE product_id = p.id) as current_price,
          (SELECT MIN(price) FROM price_history WHERE product_id = p.id) as lowest_price
        FROM products p
        JOIN analytics_events ae ON json_extract(ae.properties, '$.productId') = p.id
        WHERE ae.user_id = ? AND ae.event_type = 'product_view'
        GROUP BY p.id
        ORDER BY views DESC
        LIMIT 5
      `
        )
        .all(userId) as any[];

      const topProductsWithSavings = topProducts.map(p => ({
        ...p,
        savings: p.current_price && p.lowest_price ? p.current_price - p.lowest_price : 0
      }));

      // Recent activity
      const recentActivity = db
        .prepare(
          `
        SELECT * FROM analytics_events
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 20
      `
        )
        .all(userId) as any[];

      return {
        overview,
        activity,
        topProducts: topProductsWithSavings,
        recentActivity: recentActivity.map(a => ({
          ...a,
          properties: a.properties ? JSON.parse(a.properties) : null
        }))
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return {
        overview: {
          totalProductsTracked: 0,
          totalPriceAlerts: 0,
          totalDealsFound: 0,
          totalSavings: 0,
          avgSavingsPercent: 0
        },
        activity: {
          productViews: 0,
          searches: 0,
          watchlistChanges: 0,
          dealInteractions: 0
        },
        topProducts: [],
        recentActivity: []
      };
    }
  }

  /**
   * Get top products across all users
   */
  getTopProducts(limit: number = 20): Array<{
    productId: string;
    productName: string;
    category: string;
    views: number;
    watchers: number;
    alertsSet: number;
    popularity: number;
  }> {
    const db = getDb();

    try {
      const products = db
        .prepare(
          `
        SELECT
          p.id as product_id,
          p.name as product_name,
          p.category,
          COUNT(DISTINCT ae.id) as views,
          COUNT(DISTINCT w.user_id) as watchers,
          COUNT(DISTINCT pa.id) as alerts_set
        FROM products p
        LEFT JOIN analytics_events ae ON json_extract(ae.properties, '$.productId') = p.id AND ae.event_type = 'product_view'
        LEFT JOIN watchlist w ON p.id = w.product_id
        LEFT JOIN price_alerts pa ON p.id = pa.product_id
        GROUP BY p.id
        HAVING views > 0 OR watchers > 0
        ORDER BY (views + watchers * 5 + alerts_set * 10) DESC
        LIMIT ?
      `
        )
        .all(limit) as any[];

      return products.map(p => ({
        ...p,
        popularity: p.views + p.watchers * 5 + p.alerts_set * 10
      }));
    } catch (error) {
      console.error('Error getting top products:', error);
      return [];
    }
  }

  /**
   * Get trending searches
   */
  getTrendingSearches(limit: number = 10): Array<{
    query: string;
    count: number;
    trend: 'rising' | 'stable' | 'falling';
  }> {
    const db = getDb();

    try {
      const searches = db
        .prepare(
          `
        SELECT
          json_extract(properties, '$.query') as query,
          COUNT(*) as count
        FROM analytics_events
        WHERE event_type = 'product_search'
          AND created_at >= datetime('now', '-7 days')
          AND json_extract(properties, '$.query') IS NOT NULL
        GROUP BY query
        ORDER BY count DESC
        LIMIT ?
      `
        )
        .all(limit) as any[];

      // Mock trend calculation
      return searches.map((s, i) => ({
        query: s.query,
        count: s.count,
        trend: (i % 3 === 0 ? 'rising' : i % 3 === 1 ? 'stable' : 'falling') as 'rising' | 'stable' | 'falling'
      }));
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  }

  /**
   * Get user engagement metrics
   */
  getUserEngagement(userId: string, days: number = 30): {
    dailyActiveStatus: boolean[];
    totalSessions: number;
    avgSessionDuration: number;
    mostActiveHour: number;
    engagementScore: number;
  } {
    const db = getDb();

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Daily activity
      const dailyActivity = db
        .prepare(
          `
        SELECT DATE(created_at) as date, COUNT(*) as events
        FROM analytics_events
        WHERE user_id = ? AND created_at >= ?
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `
        )
        .all(userId, startDate.toISOString()) as any[];

      const dailyActiveStatus = Array(days).fill(false);
      dailyActivity.forEach(day => {
        const dayIndex = Math.floor(
          (new Date().getTime() - new Date(day.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayIndex < days) {
          dailyActiveStatus[days - 1 - dayIndex] = true;
        }
      });

      // Session count
      const sessions = db
        .prepare(
          `
        SELECT COUNT(DISTINCT session_id) as count
        FROM analytics_events
        WHERE user_id = ? AND created_at >= ? AND session_id IS NOT NULL
      `
        )
        .get(userId, startDate.toISOString()) as any;

      // Most active hour
      const hourActivity = db
        .prepare(
          `
        SELECT CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as events
        FROM analytics_events
        WHERE user_id = ? AND created_at >= ?
        GROUP BY hour
        ORDER BY events DESC
        LIMIT 1
      `
        )
        .get(userId, startDate.toISOString()) as any;

      // Calculate engagement score (0-100)
      const activeDays = dailyActiveStatus.filter(Boolean).length;
      const engagementScore = Math.min(100, Math.round((activeDays / days) * 100 + sessions.count * 2));

      return {
        dailyActiveStatus,
        totalSessions: sessions.count,
        avgSessionDuration: 180, // Mock: 3 minutes
        mostActiveHour: hourActivity?.hour || 14,
        engagementScore
      };
    } catch (error) {
      console.error('Error getting user engagement:', error);
      return {
        dailyActiveStatus: Array(days).fill(false),
        totalSessions: 0,
        avgSessionDuration: 0,
        mostActiveHour: 0,
        engagementScore: 0
      };
    }
  }

  /**
   * Export user data as CSV
   */
  exportData(userId: string, format: 'csv' | 'json' = 'csv'): string {
    const db = getDb();

    try {
      // Get all user data
      const watchlist = db.prepare('SELECT * FROM watchlist WHERE user_id = ?').all(userId) as any[];
      const alerts = db.prepare('SELECT * FROM price_alerts WHERE user_id = ?').all(userId) as any[];
      const events = db.prepare('SELECT * FROM analytics_events WHERE user_id = ? ORDER BY created_at DESC').all(userId) as any[];

      if (format === 'json') {
        return JSON.stringify(
          {
            watchlist,
            alerts,
            events: events.map(e => ({
              ...e,
              properties: e.properties ? JSON.parse(e.properties) : null
            }))
          },
          null,
          2
        );
      }

      // CSV format
      let csv = 'Data Export for User: ' + userId + '\n\n';

      // Watchlist
      csv += 'WATCHLIST\n';
      csv += 'Product ID,Target Price,Added At\n';
      watchlist.forEach(w => {
        csv += `${w.product_id},${w.target_price || 'N/A'},${w.created_at}\n`;
      });

      csv += '\n\nPRICE ALERTS\n';
      csv += 'Product ID,Target Price,Percentage Drop,Active,Triggered Count\n';
      alerts.forEach(a => {
        csv += `${a.product_id},${a.target_price || 'N/A'},${a.percentage_drop || 'N/A'},${a.is_active},${a.trigger_count}\n`;
      });

      csv += '\n\nRECENT ACTIVITY\n';
      csv += 'Event Type,Timestamp,Properties\n';
      events.slice(0, 100).forEach(e => {
        csv += `${e.event_type},${e.created_at},"${e.properties || '{}'}"\n`;
      });

      return csv;
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  /**
   * Get platform-wide statistics
   */
  getPlatformStats(): {
    totalUsers: number;
    totalProducts: number;
    totalPriceChecks: number;
    totalAlerts: number;
    totalSavings: number;
    activeUsers24h: number;
    topCategories: Array<{ category: string; count: number }>;
  } {
    const db = getDb();

    try {
      const usersResult = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
      const productsResult = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
      const priceHistoryResult = db.prepare('SELECT COUNT(*) as count FROM price_history').get() as any;
      const alertsResult = db.prepare('SELECT COUNT(*) as count FROM price_alerts WHERE is_active = 1').get() as any;

      const activeUsersResult = db
        .prepare(
          `
        SELECT COUNT(DISTINCT user_id) as count
        FROM analytics_events
        WHERE created_at >= datetime('now', '-1 day')
      `
        )
        .get() as any;

      const topCategories = db
        .prepare(
          `
        SELECT p.category, COUNT(*) as count
        FROM watchlist w
        JOIN products p ON w.product_id = p.id
        GROUP BY p.category
        ORDER BY count DESC
        LIMIT 5
      `
        )
        .all() as any[];

      return {
        totalUsers: usersResult.count,
        totalProducts: productsResult.count,
        totalPriceChecks: priceHistoryResult.count,
        totalAlerts: alertsResult.count,
        totalSavings: 50000, // Mock value
        activeUsers24h: activeUsersResult.count,
        topCategories
      };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalPriceChecks: 0,
        totalAlerts: 0,
        totalSavings: 0,
        activeUsers24h: 0,
        topCategories: []
      };
    }
  }

  /**
   * Get cohort analysis (users by signup date)
   */
  getCohortAnalysis(months: number = 6): Array<{
    cohort: string;
    totalUsers: number;
    activeUsers: number;
    retentionRate: number;
  }> {
    const db = getDb();

    try {
      const cohorts = db
        .prepare(
          `
        SELECT
          strftime('%Y-%m', created_at) as cohort,
          COUNT(*) as total_users,
          COUNT(CASE
            WHEN id IN (
              SELECT DISTINCT user_id
              FROM analytics_events
              WHERE created_at >= datetime('now', '-30 days')
            )
            THEN 1
          END) as active_users
        FROM users
        WHERE created_at >= datetime('now', '-${months} months')
        GROUP BY cohort
        ORDER BY cohort DESC
      `
        )
        .all() as any[];

      return cohorts.map(c => ({
        cohort: c.cohort,
        totalUsers: c.total_users,
        activeUsers: c.active_users,
        retentionRate: Math.round((c.active_users / c.total_users) * 100)
      }));
    } catch (error) {
      console.error('Error getting cohort analysis:', error);
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();

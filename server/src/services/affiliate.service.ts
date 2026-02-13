/**
 * Affiliate Link Service
 * Manages affiliate tracking and commission calculations
 */

import crypto from 'crypto';
import { getDb } from '../config/database';

interface AffiliateCommissionRates {
  [platform: string]: number; // Commission percentage
}

const COMMISSION_RATES: AffiliateCommissionRates = {
  amazon: 3,
  flipkart: 4,
  myntra: 5,
  ajio: 4,
  meesho: 2,
  snapdeal: 3,
  tatacliq: 4,
  reliance: 3,
  default: 2.5
};

class AffiliateService {
  private trackingDomain: string = process.env.TRACKING_DOMAIN || 'retailiq.app';

  /**
   * Generate affiliate link with tracking
   */
  generateAffiliateLink(
    productUrl: string,
    platform: string,
    userId?: string,
    source: string = 'web'
  ): {
    affiliateUrl: string;
    trackingId: string;
    shortUrl: string;
  } {
    // Generate unique tracking ID
    const trackingId = `RIQ_${crypto.randomBytes(8).toString('hex')}`;

    // Parse original URL
    const url = new URL(productUrl);

    // Add UTM parameters
    url.searchParams.set('utm_source', 'retailiq');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', source);
    url.searchParams.set('rid', trackingId); // RetailIQ tracking ID

    // Add platform-specific affiliate tags
    switch (platform.toLowerCase()) {
      case 'amazon':
        url.searchParams.set('tag', process.env.AMAZON_AFFILIATE_TAG || 'retailiq-21');
        break;
      case 'flipkart':
        url.searchParams.set('affid', process.env.FLIPKART_AFFILIATE_ID || 'retailiq');
        break;
      case 'myntra':
        url.searchParams.set('sourceId', process.env.MYNTRA_SOURCE_ID || 'retailiq');
        break;
      default:
        url.searchParams.set('ref', 'retailiq');
    }

    const affiliateUrl = url.toString();
    const shortUrl = `https://${this.trackingDomain}/go/${trackingId}`;

    // Store tracking link in database
    if (userId) {
      this.storeAffiliateLink(trackingId, userId, productUrl, platform, affiliateUrl);
    }

    return {
      affiliateUrl,
      trackingId,
      shortUrl
    };
  }

  /**
   * Store affiliate link in database
   */
  private storeAffiliateLink(
    trackingId: string,
    userId: string,
    originalUrl: string,
    platform: string,
    affiliateUrl: string
  ): void {
    const db = getDb();

    try {
      db.prepare(
        `
        INSERT INTO affiliate_links
        (tracking_id, user_id, original_url, platform, affiliate_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `
      ).run(trackingId, userId, originalUrl, platform, affiliateUrl, new Date().toISOString());
    } catch (error) {
      console.error('Error storing affiliate link:', error);
    }
  }

  /**
   * Track click on affiliate link
   */
  async trackClick(
    trackingId: string,
    clickData: {
      ipAddress?: string;
      userAgent?: string;
      referer?: string;
      device?: string;
    }
  ): Promise<string> {
    const db = getDb();

    try {
      const result = db
        .prepare(
          `
        INSERT INTO affiliate_clicks
        (tracking_id, ip_address, user_agent, referer, device, clicked_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          trackingId,
          clickData.ipAddress || null,
          clickData.userAgent || null,
          clickData.referer || null,
          clickData.device || 'unknown',
          new Date().toISOString()
        );

      console.log(`[Affiliate] Tracked click: ${trackingId}`);

      return result.lastInsertRowid.toString();
    } catch (error) {
      console.error('Error tracking click:', error);
      throw error;
    }
  }

  /**
   * Record conversion (purchase)
   */
  async recordConversion(
    clickId: string,
    orderValue: number,
    orderId?: string,
    metadata?: any
  ): Promise<{
    conversionId: string;
    commission: number;
    commissionRate: number;
  }> {
    const db = getDb();

    try {
      // Get click details
      const click = db
        .prepare(
          `
        SELECT ac.*, al.user_id, al.platform
        FROM affiliate_clicks ac
        JOIN affiliate_links al ON ac.tracking_id = al.tracking_id
        WHERE ac.id = ?
      `
        )
        .get(clickId) as any;

      if (!click) {
        throw new Error('Click not found');
      }

      // Calculate commission
      const commissionRate = COMMISSION_RATES[click.platform.toLowerCase()] || COMMISSION_RATES.default;
      const commission = (orderValue * commissionRate) / 100;

      // Record conversion
      const result = db
        .prepare(
          `
        INSERT INTO affiliate_conversions
        (click_id, tracking_id, user_id, order_id, order_value, commission, commission_rate, metadata, converted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          clickId,
          click.tracking_id,
          click.user_id,
          orderId || null,
          orderValue,
          commission,
          commissionRate,
          JSON.stringify(metadata || {}),
          new Date().toISOString()
        );

      const conversionId = result.lastInsertRowid.toString();

      console.log(`[Affiliate] Recorded conversion: ${conversionId}, commission: ₹${commission}`);

      return {
        conversionId,
        commission,
        commissionRate
      };
    } catch (error) {
      console.error('Error recording conversion:', error);
      throw error;
    }
  }

  /**
   * Get earnings for a user
   */
  getEarnings(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): {
    totalClicks: number;
    totalConversions: number;
    totalOrderValue: number;
    totalCommission: number;
    conversionRate: number;
    platformBreakdown: Array<{
      platform: string;
      clicks: number;
      conversions: number;
      commission: number;
    }>;
    recentConversions: any[];
  } {
    const db = getDb();

    try {
      let dateFilter = '';
      const params: any[] = [userId];

      if (dateRange) {
        dateFilter = ' AND converted_at >= ? AND converted_at <= ?';
        params.push(dateRange.start.toISOString(), dateRange.end.toISOString());
      }

      // Get total clicks
      const clicksResult = db
        .prepare(
          `
        SELECT COUNT(*) as count
        FROM affiliate_clicks ac
        JOIN affiliate_links al ON ac.tracking_id = al.tracking_id
        WHERE al.user_id = ?${dateFilter.replace('converted_at', 'clicked_at')}
      `
        )
        .get(...params) as any;

      const totalClicks = clicksResult.count;

      // Get conversions summary
      const conversionsResult = db
        .prepare(
          `
        SELECT
          COUNT(*) as count,
          SUM(order_value) as total_value,
          SUM(commission) as total_commission
        FROM affiliate_conversions
        WHERE user_id = ?${dateFilter}
      `
        )
        .get(...params) as any;

      const totalConversions = conversionsResult.count || 0;
      const totalOrderValue = conversionsResult.total_value || 0;
      const totalCommission = conversionsResult.total_commission || 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      // Get platform breakdown
      const platformBreakdown = db
        .prepare(
          `
        SELECT
          al.platform,
          COUNT(DISTINCT ac.id) as clicks,
          COUNT(DISTINCT conv.id) as conversions,
          COALESCE(SUM(conv.commission), 0) as commission
        FROM affiliate_links al
        LEFT JOIN affiliate_clicks ac ON al.tracking_id = ac.tracking_id
        LEFT JOIN affiliate_conversions conv ON ac.id = conv.click_id
        WHERE al.user_id = ?${dateFilter.replace('converted_at', 'COALESCE(conv.converted_at, ac.clicked_at)')}
        GROUP BY al.platform
      `
        )
        .all(...params) as any[];

      // Get recent conversions
      const recentConversions = db
        .prepare(
          `
        SELECT
          ac.*,
          al.platform,
          al.original_url
        FROM affiliate_conversions ac
        JOIN affiliate_links al ON ac.tracking_id = al.tracking_id
        WHERE ac.user_id = ?
        ORDER BY ac.converted_at DESC
        LIMIT 10
      `
        )
        .all(userId) as any[];

      return {
        totalClicks,
        totalConversions,
        totalOrderValue: Math.round(totalOrderValue * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        platformBreakdown: platformBreakdown.map(pb => ({
          platform: pb.platform,
          clicks: pb.clicks,
          conversions: pb.conversions,
          commission: Math.round(pb.commission * 100) / 100
        })),
        recentConversions: recentConversions.map(c => ({
          ...c,
          metadata: c.metadata ? JSON.parse(c.metadata) : null
        }))
      };
    } catch (error) {
      console.error('Error getting earnings:', error);
      return {
        totalClicks: 0,
        totalConversions: 0,
        totalOrderValue: 0,
        totalCommission: 0,
        conversionRate: 0,
        platformBreakdown: [],
        recentConversions: []
      };
    }
  }

  /**
   * Get top performers (users with highest earnings)
   */
  getTopPerformers(limit: number = 10): Array<{
    userId: string;
    userName: string;
    totalCommission: number;
    totalConversions: number;
    totalClicks: number;
    conversionRate: number;
  }> {
    const db = getDb();

    try {
      const performers = db
        .prepare(
          `
        SELECT
          u.id as user_id,
          u.name as user_name,
          COUNT(DISTINCT ac.id) as total_clicks,
          COUNT(DISTINCT conv.id) as total_conversions,
          COALESCE(SUM(conv.commission), 0) as total_commission
        FROM users u
        JOIN affiliate_links al ON u.id = al.user_id
        LEFT JOIN affiliate_clicks ac ON al.tracking_id = ac.tracking_id
        LEFT JOIN affiliate_conversions conv ON ac.id = conv.click_id
        GROUP BY u.id
        HAVING total_commission > 0
        ORDER BY total_commission DESC
        LIMIT ?
      `
        )
        .all(limit) as any[];

      return performers.map(p => ({
        userId: p.user_id,
        userName: p.user_name,
        totalCommission: Math.round(p.total_commission * 100) / 100,
        totalConversions: p.total_conversions,
        totalClicks: p.total_clicks,
        conversionRate:
          p.total_clicks > 0
            ? Math.round((p.total_conversions / p.total_clicks) * 10000) / 100
            : 0
      }));
    } catch (error) {
      console.error('Error getting top performers:', error);
      return [];
    }
  }

  /**
   * Get commission rate for platform
   */
  getCommissionRate(platform: string): number {
    return COMMISSION_RATES[platform.toLowerCase()] || COMMISSION_RATES.default;
  }

  /**
   * Calculate potential earnings
   */
  calculatePotentialEarnings(
    orderValue: number,
    platform: string
  ): {
    orderValue: number;
    commissionRate: number;
    estimatedCommission: number;
  } {
    const commissionRate = this.getCommissionRate(platform);
    const estimatedCommission = (orderValue * commissionRate) / 100;

    return {
      orderValue,
      commissionRate,
      estimatedCommission: Math.round(estimatedCommission * 100) / 100
    };
  }

  /**
   * Get click analytics
   */
  getClickAnalytics(
    userId: string,
    days: number = 30
  ): {
    dailyClicks: Array<{ date: string; clicks: number }>;
    deviceBreakdown: Array<{ device: string; count: number }>;
    topReferrers: Array<{ referer: string; count: number }>;
  } {
    const db = getDb();

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Daily clicks
      const dailyClicks = db
        .prepare(
          `
        SELECT
          DATE(ac.clicked_at) as date,
          COUNT(*) as clicks
        FROM affiliate_clicks ac
        JOIN affiliate_links al ON ac.tracking_id = al.tracking_id
        WHERE al.user_id = ? AND ac.clicked_at >= ?
        GROUP BY DATE(ac.clicked_at)
        ORDER BY date ASC
      `
        )
        .all(userId, startDate.toISOString()) as any[];

      // Device breakdown
      const deviceBreakdown = db
        .prepare(
          `
        SELECT
          ac.device,
          COUNT(*) as count
        FROM affiliate_clicks ac
        JOIN affiliate_links al ON ac.tracking_id = al.tracking_id
        WHERE al.user_id = ? AND ac.clicked_at >= ?
        GROUP BY ac.device
        ORDER BY count DESC
      `
        )
        .all(userId, startDate.toISOString()) as any[];

      // Top referrers
      const topReferrers = db
        .prepare(
          `
        SELECT
          ac.referer,
          COUNT(*) as count
        FROM affiliate_clicks ac
        JOIN affiliate_links al ON ac.tracking_id = al.tracking_id
        WHERE al.user_id = ? AND ac.clicked_at >= ? AND ac.referer IS NOT NULL
        GROUP BY ac.referer
        ORDER BY count DESC
        LIMIT 10
      `
        )
        .all(userId, startDate.toISOString()) as any[];

      return {
        dailyClicks,
        deviceBreakdown,
        topReferrers
      };
    } catch (error) {
      console.error('Error getting click analytics:', error);
      return {
        dailyClicks: [],
        deviceBreakdown: [],
        topReferrers: []
      };
    }
  }

  /**
   * Redirect through tracking link
   */
  async redirectAndTrack(
    trackingId: string,
    clickData: {
      ipAddress?: string;
      userAgent?: string;
      referer?: string;
      device?: string;
    }
  ): Promise<string | null> {
    const db = getDb();

    try {
      // Get affiliate link
      const link = db
        .prepare(
          `
        SELECT affiliate_url
        FROM affiliate_links
        WHERE tracking_id = ?
      `
        )
        .get(trackingId) as any;

      if (!link) {
        return null;
      }

      // Track click
      await this.trackClick(trackingId, clickData);

      return link.affiliate_url;
    } catch (error) {
      console.error('Error redirecting:', error);
      return null;
    }
  }
}

export const affiliateService = new AffiliateService();

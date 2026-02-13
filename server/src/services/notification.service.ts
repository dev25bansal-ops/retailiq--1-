/**
 * Multi-channel Notification Service
 * Manages sending notifications through various channels
 */

import { getDb } from '../config/database';
import { emailService } from './email.service';
import { smsService } from './sms.service';
import { whatsappService } from './whatsapp.service';
import { sseService } from './sse.service';

export type NotificationChannel = 'push' | 'email' | 'sms' | 'whatsapp';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority?: NotificationPriority;
  actionUrl?: string;
}

class NotificationService {
  /**
   * Send notification through multiple channels
   */
  async sendNotification(
    userId: string,
    notification: NotificationPayload,
    channels: NotificationChannel[] = ['push']
  ): Promise<{
    success: boolean;
    notificationId: string;
    channelsUsed: NotificationChannel[];
    errors: string[];
  }> {
    const db = getDb();

    try {
      // Get user details
      const user = db
        .prepare(
          `
        SELECT id, email, phone, name
        FROM users
        WHERE id = ?
      `
        )
        .get(userId) as any;

      if (!user) {
        return {
          success: false,
          notificationId: '',
          channelsUsed: [],
          errors: ['User not found']
        };
      }

      // Check user preferences
      const preferences = this.getUserPreferences(userId);

      if (!this.shouldSendNotification(preferences, notification.priority || 'medium', userId)) {
        return {
          success: false,
          notificationId: '',
          channelsUsed: [],
          errors: ['Notification blocked by user preferences (quiet hours or frequency limit)']
        };
      }

      // Create notification record
      const now = new Date().toISOString();
      const result = db
        .prepare(
          `
        INSERT INTO notifications
        (user_id, type, title, message, data, priority, action_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          userId,
          notification.type,
          notification.title,
          notification.message,
          JSON.stringify(notification.data || {}),
          notification.priority || 'medium',
          notification.actionUrl || null,
          now
        );

      const notificationId = result.lastInsertRowid.toString();

      const channelsUsed: NotificationChannel[] = [];
      const errors: string[] = [];

      // Send through each channel
      for (const channel of channels) {
        try {
          switch (channel) {
            case 'push':
              // Send via SSE to connected clients
              sseService.sendToUser(userId, {
                type: 'notification',
                data: {
                  id: notificationId,
                  ...notification
                }
              });
              channelsUsed.push('push');
              break;

            case 'email':
              if (preferences.emailEnabled && user.email) {
                await emailService.sendNotificationEmail(
                  user.email,
                  user.name,
                  notification.title,
                  notification.message,
                  notification.actionUrl
                );
                channelsUsed.push('email');
              }
              break;

            case 'sms':
              if (preferences.smsEnabled && user.phone) {
                await smsService.sendSMS(
                  user.phone,
                  `${notification.title}\n\n${notification.message}`
                );
                channelsUsed.push('sms');
              }
              break;

            case 'whatsapp':
              if (preferences.whatsappEnabled && user.phone) {
                await whatsappService.sendWhatsApp(
                  user.phone,
                  `*${notification.title}*\n\n${notification.message}`
                );
                channelsUsed.push('whatsapp');
              }
              break;
          }
        } catch (error: any) {
          errors.push(`${channel}: ${error.message}`);
        }
      }

      // Log notification send
      for (const channel of channelsUsed) {
        db.prepare(
          `
          INSERT INTO notification_log
          (notification_id, user_id, channel, status, sent_at)
          VALUES (?, ?, ?, 'sent', ?)
        `
        ).run(notificationId, userId, channel, now);
      }

      return {
        success: channelsUsed.length > 0,
        notificationId,
        channelsUsed,
        errors
      };
    } catch (error: any) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        notificationId: '',
        channelsUsed: [],
        errors: [error.message]
      };
    }
  }

  /**
   * Get user notification preferences
   */
  getUserPreferences(userId: string): {
    emailEnabled: boolean;
    smsEnabled: boolean;
    whatsappEnabled: boolean;
    pushEnabled: boolean;
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
    maxPerDay: number;
  } {
    const db = getDb();

    const prefs = db
      .prepare(
        `
      SELECT * FROM notification_preferences
      WHERE user_id = ?
    `
      )
      .get(userId) as any;

    if (!prefs) {
      // Default preferences
      return {
        emailEnabled: true,
        smsEnabled: false,
        whatsappEnabled: false,
        pushEnabled: true,
        quietHoursStart: null,
        quietHoursEnd: null,
        maxPerDay: 20
      };
    }

    return {
      emailEnabled: prefs.email_enabled === 1,
      smsEnabled: prefs.sms_enabled === 1,
      whatsappEnabled: prefs.whatsapp_enabled === 1,
      pushEnabled: prefs.push_enabled === 1,
      quietHoursStart: prefs.quiet_hours_start,
      quietHoursEnd: prefs.quiet_hours_end,
      maxPerDay: prefs.max_per_day
    };
  }

  /**
   * Check if notification should be sent based on preferences
   */
  shouldSendNotification(
    preferences: ReturnType<typeof this.getUserPreferences>,
    priority: NotificationPriority,
    userId?: string
  ): boolean {
    // High priority notifications always go through
    if (priority === 'high') {
      return true;
    }

    // Check quiet hours
    if (preferences.quietHoursStart && preferences.quietHoursEnd) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinutes;

      const [startHour, startMin] = preferences.quietHoursStart.split(':').map(Number);
      const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
      const quietStart = startHour * 60 + startMin;
      const quietEnd = endHour * 60 + endMin;

      if (quietStart < quietEnd) {
        // Same day range (e.g., 22:00 - 08:00 next day)
        if (currentTime >= quietStart && currentTime < quietEnd) {
          return false;
        }
      } else {
        // Spans midnight (e.g., 22:00 - 08:00)
        if (currentTime >= quietStart || currentTime < quietEnd) {
          return false;
        }
      }
    }

    // Check daily limit (only for low/medium priority)
    if ((priority === 'low' || priority === 'medium') && preferences.maxPerDay > 0 && userId) {
      const db = getDb();
      const today = new Date().toISOString().split('T')[0];

      const count = db
        .prepare(
          `
        SELECT COUNT(*) as count
        FROM notification_log
        WHERE user_id = ? AND DATE(sent_at) = ?
      `
        )
        .get(userId, today) as any;

      if (count && count.count >= preferences.maxPerDay) {
        return false;
      }
    }

    return true;
  }

  /**
   * Send bulk notifications to multiple users
   */
  async sendBulkNotifications(
    userIds: string[],
    notification: NotificationPayload,
    channels: NotificationChannel[] = ['push']
  ): Promise<{
    sent: number;
    failed: number;
  }> {
    let sent = 0;
    let failed = 0;

    for (const userId of userIds) {
      const result = await this.sendNotification(
        userId,
        { ...notification, userId },
        channels
      );

      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed };
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string, userId: string): boolean {
    const db = getDb();

    try {
      db.prepare(
        `
        UPDATE notifications
        SET is_read = 1, read_at = ?
        WHERE id = ? AND user_id = ?
      `
      ).run(new Date().toISOString(), notificationId, userId);

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for user
   */
  markAllAsRead(userId: string): number {
    const db = getDb();

    try {
      const result = db
        .prepare(
          `
        UPDATE notifications
        SET is_read = 1, read_at = ?
        WHERE user_id = ? AND is_read = 0
      `
        )
        .run(new Date().toISOString(), userId);

      return result.changes;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return 0;
    }
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string, userId: string): boolean {
    const db = getDb();

    try {
      db.prepare(
        `
        DELETE FROM notifications
        WHERE id = ? AND user_id = ?
      `
      ).run(notificationId, userId);

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get user notifications
   */
  getNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      type?: string;
    } = {}
  ): {
    notifications: any[];
    total: number;
    unread: number;
  } {
    const db = getDb();

    const { limit = 20, offset = 0, unreadOnly = false, type } = options;

    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `;
    const params: any[] = [userId];

    if (unreadOnly) {
      query += ` AND is_read = 0`;
    }

    if (type) {
      query += ` AND type = ?`;
      params.push(type);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const notifications = db.prepare(query).all(...params) as any[];

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ?
    `;
    const countParams: any[] = [userId];

    if (type) {
      countQuery += ` AND type = ?`;
      countParams.push(type);
    }

    const totalResult = db.prepare(countQuery).get(...countParams) as any;
    const total = totalResult.count;

    // Get unread count
    const unreadResult = db
      .prepare(
        `
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ? AND is_read = 0
    `
      )
      .get(userId) as any;
    const unread = unreadResult.count;

    return {
      notifications: notifications.map(n => ({
        ...n,
        data: n.data ? JSON.parse(n.data) : null
      })),
      total,
      unread
    };
  }
}

export const notificationService = new NotificationService();

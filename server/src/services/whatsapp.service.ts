/**
 * WhatsApp Service (Mock Implementation)
 * In production, integrate with WhatsApp Business API or Twilio
 */

import { getDb } from '../config/database';

class WhatsAppService {
  /**
   * Send WhatsApp message (mock implementation)
   */
  async sendWhatsApp(to: string, message: string): Promise<boolean> {
    console.log('=== WHATSAPP MESSAGE SENT ===');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('=============================\n');

    // Log to database
    const db = getDb();
    try {
      db.prepare(
        `
        INSERT INTO notification_log
        (user_id, channel, status, metadata, sent_at)
        VALUES (?, 'whatsapp', 'sent', ?, ?)
      `
      ).run(
        null, // User ID would be looked up in production
        JSON.stringify({ to, length: message.length }),
        new Date().toISOString()
      );
    } catch (error) {
      console.error('Error logging WhatsApp message:', error);
    }

    return true;
  }

  /**
   * Send price alert via WhatsApp
   */
  async sendPriceAlert(
    to: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    platform: string,
    productUrl?: string
  ): Promise<boolean> {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    const savings = oldPrice - newPrice;

    let message = `🎉 *Price Drop Alert!*\n\n`;
    message += `*${productName}*\n`;
    message += `Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}\n\n`;
    message += `~~₹${oldPrice.toLocaleString('en-IN')}~~ → *₹${newPrice.toLocaleString('en-IN')}*\n`;
    message += `💰 Save ₹${savings.toLocaleString('en-IN')} (${discount}% off)\n`;

    if (productUrl) {
      message += `\n🔗 View: ${productUrl}`;
    }

    message += `\n\n_Act fast! Prices may change at any time._`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send daily price summary via WhatsApp
   */
  async sendPriceSummary(
    to: string,
    products: Array<{
      name: string;
      currentPrice: number;
      yesterdayPrice: number;
      change: number;
      platform: string;
    }>
  ): Promise<boolean> {
    let message = `📊 *Daily Price Summary*\n\n`;
    message += `Here are today's updates for your tracked products:\n\n`;

    products.forEach((product, index) => {
      const emoji = product.change < 0 ? '📉' : product.change > 0 ? '📈' : '➖';
      message += `${index + 1}. *${product.name}*\n`;
      message += `   ${emoji} ₹${product.currentPrice.toLocaleString('en-IN')} (${
        product.change > 0 ? '+' : ''
      }${product.change.toFixed(1)}%)\n`;
      message += `   Platform: ${product.platform}\n\n`;
    });

    message += `_Check RetailIQ for more details!_`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send buy recommendation via WhatsApp
   */
  async sendBuyRecommendation(
    to: string,
    productName: string,
    action: 'buy_now' | 'wait' | 'set_alert',
    reasoning: string,
    confidence: number
  ): Promise<boolean> {
    const actionEmoji = action === 'buy_now' ? '✅' : action === 'wait' ? '⏳' : '🔔';
    const actionText = action === 'buy_now' ? 'BUY NOW' : action === 'wait' ? 'WAIT' : 'SET ALERT';

    let message = `${actionEmoji} *Smart Buy Recommendation*\n\n`;
    message += `Product: *${productName}*\n\n`;
    message += `Action: *${actionText}*\n`;
    message += `Confidence: ${Math.round(confidence * 100)}%\n\n`;
    message += `${reasoning}\n\n`;
    message += `_AI-powered recommendation by RetailIQ_`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send festival deal alert via WhatsApp
   */
  async sendFestivalAlert(
    to: string,
    festivalName: string,
    daysUntil: number,
    expectedDiscount: number,
    category: string
  ): Promise<boolean> {
    let message = `🎊 *Festival Sale Alert!*\n\n`;
    message += `*${festivalName}* is coming in ${daysUntil} days!\n\n`;
    message += `Expected discounts in ${category}:\n`;
    message += `Up to *${expectedDiscount}% OFF*\n\n`;
    message += `🛍️ Prepare your wishlist now!\n\n`;
    message += `_Stay tuned for the best deals on RetailIQ_`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send order confirmation via WhatsApp
   */
  async sendOrderConfirmation(
    to: string,
    orderId: string,
    productName: string,
    amount: number,
    platform: string
  ): Promise<boolean> {
    let message = `✅ *Order Tracked Successfully!*\n\n`;
    message += `Order ID: ${orderId}\n`;
    message += `Product: *${productName}*\n`;
    message += `Amount: ₹${amount.toLocaleString('en-IN')}\n`;
    message += `Platform: ${platform}\n\n`;
    message += `We'll notify you about price drops and delivery updates!\n\n`;
    message += `_Thank you for using RetailIQ_`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send subscription notification via WhatsApp
   */
  async sendSubscriptionNotification(
    to: string,
    planName: string,
    action: 'activated' | 'expiring' | 'expired',
    details?: string
  ): Promise<boolean> {
    let message = '';

    switch (action) {
      case 'activated':
        message = `🎉 *Subscription Activated!*\n\n`;
        message += `Your *${planName}* plan is now active.\n`;
        message += `Enjoy all premium features!\n\n`;
        message += `${details || ''}\n\n`;
        message += `_Thank you for upgrading!_`;
        break;

      case 'expiring':
        message = `⚠️ *Subscription Expiring Soon*\n\n`;
        message += `Your *${planName}* plan expires soon.\n`;
        message += `${details || ''}\n\n`;
        message += `Renew now to continue enjoying premium features!\n\n`;
        message += `_Visit RetailIQ to renew_`;
        break;

      case 'expired':
        message = `❌ *Subscription Expired*\n\n`;
        message += `Your *${planName}* plan has expired.\n`;
        message += `${details || ''}\n\n`;
        message += `Renew to regain access to premium features.\n\n`;
        message += `_Visit RetailIQ to renew_`;
        break;
    }

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send MSME inventory alert via WhatsApp
   */
  async sendInventoryAlert(
    to: string,
    productName: string,
    currentStock: number,
    threshold: number
  ): Promise<boolean> {
    let message = `⚠️ *Low Stock Alert*\n\n`;
    message += `Product: *${productName}*\n`;
    message += `Current Stock: ${currentStock}\n`;
    message += `Threshold: ${threshold}\n\n`;
    message += `Time to reorder! 📦\n\n`;
    message += `_Inventory alert from RetailIQ_`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send MSME repricing notification via WhatsApp
   */
  async sendRepricingNotification(
    to: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    reason: string
  ): Promise<boolean> {
    const change = ((newPrice - oldPrice) / oldPrice) * 100;
    const emoji = change < 0 ? '📉' : '📈';

    let message = `${emoji} *Price Updated*\n\n`;
    message += `Product: *${productName}*\n`;
    message += `Old Price: ₹${oldPrice.toLocaleString('en-IN')}\n`;
    message += `New Price: *₹${newPrice.toLocaleString('en-IN')}*\n`;
    message += `Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}%\n\n`;
    message += `Reason: ${reason}\n\n`;
    message += `_Automated repricing by RetailIQ_`;

    return this.sendWhatsApp(to, message);
  }

  /**
   * Send template message with buttons (mock)
   */
  async sendTemplateMessage(
    to: string,
    templateId: string,
    parameters: Record<string, string>,
    buttons?: Array<{ text: string; url?: string }>
  ): Promise<boolean> {
    console.log('=== WHATSAPP TEMPLATE MESSAGE ===');
    console.log(`To: ${to}`);
    console.log(`Template: ${templateId}`);
    console.log(`Parameters:`, parameters);
    console.log(`Buttons:`, buttons);
    console.log('=================================\n');

    return true;
  }

  /**
   * Send media message (image, document, etc.) - mock
   */
  async sendMedia(
    to: string,
    mediaUrl: string,
    caption?: string,
    mediaType: 'image' | 'document' | 'video' = 'image'
  ): Promise<boolean> {
    console.log('=== WHATSAPP MEDIA MESSAGE ===');
    console.log(`To: ${to}`);
    console.log(`Type: ${mediaType}`);
    console.log(`URL: ${mediaUrl}`);
    console.log(`Caption: ${caption || 'N/A'}`);
    console.log('==============================\n');

    return true;
  }

  /**
   * Get message delivery status (mock)
   */
  async getMessageStatus(_messageId: string): Promise<{
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
  }> {
    return {
      status: 'delivered',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Send bulk WhatsApp messages
   */
  async sendBulkMessages(
    recipients: Array<{ phone: string; message: string }>
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await this.sendWhatsApp(recipient.phone, recipient.message);
        sent++;
        // Rate limiting: 1 message per 100ms to avoid spam detection
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send WhatsApp to ${recipient.phone}:`, error);
        failed++;
      }
    }

    console.log(`Bulk WhatsApp: ${sent} sent, ${failed} failed`);

    return { sent, failed };
  }

  /**
   * Opt-in user to WhatsApp notifications (mock)
   */
  async optInUser(userId: string, phone: string): Promise<boolean> {
    const db = getDb();

    try {
      // Update user preferences
      db.prepare(
        `
        UPDATE notification_preferences
        SET whatsapp_enabled = 1
        WHERE user_id = ?
      `
      ).run(userId);

      // Send welcome message
      await this.sendWhatsApp(
        phone,
        `✅ *WhatsApp Notifications Enabled!*\n\nYou'll now receive price alerts and updates via WhatsApp.\n\n_Reply STOP to unsubscribe_`
      );

      return true;
    } catch (error) {
      console.error('Error opting in user:', error);
      return false;
    }
  }

  /**
   * Opt-out user from WhatsApp notifications (mock)
   */
  async optOutUser(userId: string, phone: string): Promise<boolean> {
    const db = getDb();

    try {
      // Update user preferences
      db.prepare(
        `
        UPDATE notification_preferences
        SET whatsapp_enabled = 0
        WHERE user_id = ?
      `
      ).run(userId);

      // Send goodbye message
      await this.sendWhatsApp(
        phone,
        `👋 *WhatsApp Notifications Disabled*\n\nYou won't receive notifications via WhatsApp anymore.\n\n_Reply START to re-subscribe_`
      );

      return true;
    } catch (error) {
      console.error('Error opting out user:', error);
      return false;
    }
  }
}

export const whatsappService = new WhatsAppService();

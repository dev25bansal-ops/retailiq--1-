/**
 * Server-Sent Events (SSE) Service
 * Manages real-time push notifications to connected clients
 */

import { Response } from 'express';

interface SSEClient {
  userId: string;
  response: Response;
  connectedAt: Date;
}

class SSEService {
  private clients: Map<string, SSEClient[]> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start heartbeat to keep connections alive
    this.startHeartbeat();
  }

  /**
   * Add a new SSE client
   */
  addClient(userId: string, res: Response): void {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    const client: SSEClient = {
      userId,
      response: res,
      connectedAt: new Date()
    };

    // Add to clients map
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId)!.push(client);

    console.log(`[SSE] Client connected: ${userId} (Total: ${this.getTotalClients()})`);

    // Send initial connection message
    this.sendEvent(res, {
      type: 'connected',
      data: {
        message: 'Connected to RetailIQ real-time updates',
        timestamp: new Date().toISOString()
      }
    });

    // Handle client disconnect
    res.on('close', () => {
      this.removeClient(userId, res);
    });
  }

  /**
   * Remove a client
   */
  removeClient(userId: string, res: Response): void {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const index = userClients.findIndex(client => client.response === res);
      if (index !== -1) {
        userClients.splice(index, 1);
        if (userClients.length === 0) {
          this.clients.delete(userId);
        }
      }
    }

    console.log(`[SSE] Client disconnected: ${userId} (Total: ${this.getTotalClients()})`);
  }

  /**
   * Send event to a specific user
   */
  sendToUser(userId: string, event: { type: string; data: any }): boolean {
    const userClients = this.clients.get(userId);

    if (!userClients || userClients.length === 0) {
      return false;
    }

    let sent = 0;
    for (const client of userClients) {
      try {
        this.sendEvent(client.response, event);
        sent++;
      } catch (error) {
        console.error(`[SSE] Error sending to client:`, error);
        this.removeClient(userId, client.response);
      }
    }

    return sent > 0;
  }

  /**
   * Broadcast event to all connected clients
   */
  broadcast(event: { type: string; data: any }): number {
    let sent = 0;

    for (const [userId, clients] of this.clients.entries()) {
      for (const client of clients) {
        try {
          this.sendEvent(client.response, event);
          sent++;
        } catch (error) {
          console.error(`[SSE] Error broadcasting to ${userId}:`, error);
          this.removeClient(userId, client.response);
        }
      }
    }

    console.log(`[SSE] Broadcast sent to ${sent} clients`);
    return sent;
  }

  /**
   * Send event to response
   */
  private sendEvent(res: Response, event: { type: string; data: any }): void {
    const eventData = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
    res.write(eventData);
  }

  /**
   * Send heartbeat to all clients
   */
  private sendHeartbeat(): void {
    const heartbeatEvent = {
      type: 'heartbeat',
      data: {
        timestamp: new Date().toISOString()
      }
    };

    let active = 0;
    let failed = 0;

    for (const [userId, clients] of this.clients.entries()) {
      for (const client of clients) {
        try {
          this.sendEvent(client.response, heartbeatEvent);
          active++;
        } catch (error) {
          failed++;
          this.removeClient(userId, client.response);
        }
      }
    }

    if (active > 0 || failed > 0) {
      console.log(`[SSE] Heartbeat: ${active} active, ${failed} failed`);
    }
  }

  /**
   * Start heartbeat interval
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      return;
    }

    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000);

    console.log('[SSE] Heartbeat started (30s interval)');
  }

  /**
   * Stop heartbeat interval
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('[SSE] Heartbeat stopped');
    }
  }

  /**
   * Get total number of connected clients
   */
  getTotalClients(): number {
    let total = 0;
    for (const clients of this.clients.values()) {
      total += clients.length;
    }
    return total;
  }

  /**
   * Get number of unique users connected
   */
  getUniqueUsers(): number {
    return this.clients.size;
  }

  /**
   * Get connection status for a user
   */
  isUserConnected(userId: string): boolean {
    const clients = this.clients.get(userId);
    return clients !== undefined && clients.length > 0;
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Get connection stats
   */
  getStats(): {
    totalClients: number;
    uniqueUsers: number;
    connections: Array<{
      userId: string;
      clientCount: number;
      connectedAt: Date;
    }>;
  } {
    const connections: Array<{
      userId: string;
      clientCount: number;
      connectedAt: Date;
    }> = [];

    for (const [userId, clients] of this.clients.entries()) {
      if (clients.length > 0) {
        connections.push({
          userId,
          clientCount: clients.length,
          connectedAt: clients[0].connectedAt
        });
      }
    }

    return {
      totalClients: this.getTotalClients(),
      uniqueUsers: this.getUniqueUsers(),
      connections
    };
  }

  /**
   * Disconnect all clients for a user
   */
  disconnectUser(userId: string): void {
    const clients = this.clients.get(userId);
    if (clients) {
      for (const client of clients) {
        try {
          client.response.end();
        } catch (error) {
          console.error(`[SSE] Error disconnecting client:`, error);
        }
      }
      this.clients.delete(userId);
      console.log(`[SSE] Disconnected all clients for user: ${userId}`);
    }
  }

  /**
   * Disconnect all clients
   */
  disconnectAll(): void {
    for (const [_userId, clients] of this.clients.entries()) {
      for (const client of clients) {
        try {
          client.response.end();
        } catch (error) {
          console.error(`[SSE] Error disconnecting client:`, error);
        }
      }
    }

    this.clients.clear();
    console.log('[SSE] Disconnected all clients');
  }

  /**
   * Send notification event to user
   */
  sendNotification(userId: string, notification: any): boolean {
    return this.sendToUser(userId, {
      type: 'notification',
      data: notification
    });
  }

  /**
   * Send price update event to user
   */
  sendPriceUpdate(
    userId: string,
    priceUpdate: {
      productId: string;
      productName: string;
      oldPrice: number;
      newPrice: number;
      platform: string;
      change: number;
    }
  ): boolean {
    return this.sendToUser(userId, {
      type: 'price_update',
      data: priceUpdate
    });
  }

  /**
   * Send deal alert to user
   */
  sendDealAlert(
    userId: string,
    deal: {
      dealId: string;
      productName: string;
      discount: number;
      platform: string;
    }
  ): boolean {
    return this.sendToUser(userId, {
      type: 'deal_alert',
      data: deal
    });
  }

  /**
   * Broadcast system announcement
   */
  broadcastAnnouncement(message: string, priority: 'low' | 'medium' | 'high' = 'medium'): number {
    return this.broadcast({
      type: 'announcement',
      data: {
        message,
        priority,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Export singleton instance
export const sseService = new SSEService();

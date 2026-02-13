/**
 * Chat Routes
 * Manages AI chat sessions and messages
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * Generate a simple AI response based on keywords in the message
 */
function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Price-related queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
    return "I can help you find the best prices! I analyze prices across multiple platforms including Amazon, Flipkart, and others. Would you like me to compare prices for a specific product? Just share the product name or category you're interested in.";
  }

  // Compare queries
  if (lowerMessage.includes('compare') || lowerMessage.includes('versus') || lowerMessage.includes('vs')) {
    return "I can help you compare products! I'll analyze features, prices, ratings, and availability across platforms. Which products would you like me to compare? Please provide the product names or links.";
  }

  // Deal-related queries
  if (lowerMessage.includes('deal') || lowerMessage.includes('discount') || lowerMessage.includes('offer')) {
    return "Looking for deals? I track the best deals and discounts across platforms. I can also alert you when prices drop on products you're watching. Would you like me to show you today's top deals or set up price alerts?";
  }

  // Festival queries
  if (lowerMessage.includes('festival') || lowerMessage.includes('sale') || lowerMessage.includes('diwali') || lowerMessage.includes('christmas')) {
    return "Festival sales offer great discounts! I can notify you about upcoming festival sales and the best deals during these periods. Would you like to know about upcoming festivals or see historical price trends during past sales?";
  }

  // Product recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
    return "I can recommend products based on your preferences! I consider factors like price, ratings, features, and current deals. What category are you interested in? (e.g., electronics, fashion, home appliances)";
  }

  // MSME queries
  if (lowerMessage.includes('msme') || lowerMessage.includes('business') || lowerMessage.includes('seller') || lowerMessage.includes('inventory')) {
    return "For MSME businesses, I offer inventory management, automated repricing, market intelligence, and GST calculations. I help you stay competitive by analyzing competitor prices and optimizing your pricing strategy. How can I assist your business today?";
  }

  // Watchlist queries
  if (lowerMessage.includes('watch') || lowerMessage.includes('track') || lowerMessage.includes('alert')) {
    return "You can add products to your watchlist, and I'll monitor prices for you! I'll send alerts when prices drop or when products go back in stock. Would you like help setting up price alerts or managing your watchlist?";
  }

  // Greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your RetailIQ AI assistant. I help you find the best prices, track deals, compare products, and manage your shopping efficiently. How can I help you today?";
  }

  // Default response
  return "I'm your RetailIQ AI assistant! I can help you with:\n\n• Finding and comparing product prices\n• Tracking deals and discounts\n• Setting up price alerts\n• Product recommendations\n• Festival sale information\n• MSME business tools\n\nWhat would you like to know?";
}

/**
 * POST /message - Send a message and get AI response
 * @access Private
 */
router.post('/message', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty'
      });
    }

    const db = getDb();
    let activeSessionId = sessionId;

    // Create new session if not provided
    if (!activeSessionId) {
      activeSessionId = randomUUID();
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');

      db.prepare(
        `
        INSERT INTO chat_sessions (id, user_id, title, is_active, created_at, updated_at)
        VALUES (?, ?, ?, 1, ?, ?)
        `
      ).run(activeSessionId, userId, title, new Date().toISOString(), new Date().toISOString());
    } else {
      // Verify session belongs to user
      const session = db
        .prepare('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?')
        .get(activeSessionId, userId);

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      // Update session timestamp
      db.prepare('UPDATE chat_sessions SET updated_at = ? WHERE id = ?')
        .run(new Date().toISOString(), activeSessionId);
    }

    // Save user message
    const userMessageId = randomUUID();
    db.prepare(
      `
      INSERT INTO chat_messages (id, session_id, role, content, created_at)
      VALUES (?, ?, 'user', ?, ?)
      `
    ).run(userMessageId, activeSessionId, message.trim(), new Date().toISOString());

    // Generate AI response
    const aiResponse = generateAIResponse(message);

    // Save AI response
    const aiMessageId = randomUUID();
    db.prepare(
      `
      INSERT INTO chat_messages (id, session_id, role, content, created_at)
      VALUES (?, ?, 'assistant', ?, ?)
      `
    ).run(aiMessageId, activeSessionId, aiResponse, new Date().toISOString());

    return res.json({
      success: true,
      sessionId: activeSessionId,
      response: aiResponse,
      messageId: aiMessageId
    });
  } catch (error: any) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

/**
 * GET /sessions - Get user's chat sessions
 * @access Private
 */
router.get('/sessions', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { limit = 20, offset = 0 } = req.query;
    const db = getDb();

    const sessions = db
      .prepare(
        `
        SELECT s.*,
               (SELECT COUNT(*) FROM chat_messages WHERE session_id = s.id) as message_count,
               (SELECT content FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM chat_sessions s
        WHERE s.user_id = ?
        ORDER BY s.updated_at DESC
        LIMIT ? OFFSET ?
        `
      )
      .all(userId, Number(limit), Number(offset));

    const total = db
      .prepare('SELECT COUNT(*) as count FROM chat_sessions WHERE user_id = ?')
      .get(userId) as any;

    res.json({
      success: true,
      sessions,
      total: total.count
    });
  } catch (error: any) {
    console.error('Error getting chat sessions:', error);
    res.status(500).json({ success: false, error: 'Failed to get chat sessions' });
  }
});

/**
 * GET /sessions/:id - Get messages for a specific session
 * @access Private
 */
router.get('/sessions/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const db = getDb();

    // Verify session belongs to user
    const session = db
      .prepare('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?')
      .get(id, userId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    const messages = db
      .prepare(
        `
        SELECT *
        FROM chat_messages
        WHERE session_id = ?
        ORDER BY created_at ASC
        `
      )
      .all(id);

    return res.json({
      success: true,
      session,
      messages
    });
  } catch (error: any) {
    console.error('Error getting session messages:', error);
    return res.status(500).json({ success: false, error: 'Failed to get session messages' });
  }
});

export default router;

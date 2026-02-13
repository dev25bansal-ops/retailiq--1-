/**
 * Deals Routes
 * Manages deal listings, voting, and comments
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * GET / - List deals with pagination and sorting
 * @access Public (optional auth)
 */
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const {
      limit = 20,
      offset = 0,
      sort = 'new',
      category,
      platform,
      status = 'approved'
    } = req.query;

    const db = getDb();
    let query = `
      SELECT d.*,
             p.name as product_name,
             p.image_url as product_image,
             u.name as submitted_by_name,
             (d.upvotes - d.downvotes) as score
      FROM deals d
      LEFT JOIN products p ON d.product_id = p.id
      LEFT JOIN users u ON d.submitted_by = u.id
      WHERE d.status = ?
    `;
    const params: any[] = [status];

    if (category) {
      query += ' AND d.category = ?';
      params.push(category);
    }

    if (platform) {
      query += ' AND d.platform = ?';
      params.push(platform);
    }

    // Sorting
    if (sort === 'popular') {
      query += ' ORDER BY score DESC, d.created_at DESC';
    } else if (sort === 'price_drop') {
      query += ' ORDER BY d.discount_percentage DESC, d.created_at DESC';
    } else {
      query += ' ORDER BY d.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const deals = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM deals WHERE status = ?';
    const countParams: any[] = [status];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (platform) {
      countQuery += ' AND platform = ?';
      countParams.push(platform);
    }

    const total = db.prepare(countQuery).get(...countParams) as any;

    res.json({
      success: true,
      deals,
      total: total.count,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error: any) {
    console.error('Error getting deals:', error);
    res.status(500).json({ success: false, error: 'Failed to get deals' });
  }
});

/**
 * POST / - Create a new deal
 * @access Private
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      title,
      description,
      productId,
      platform,
      originalPrice,
      dealPrice,
      couponCode,
      dealUrl,
      imageUrl,
      startDate,
      endDate,
      category
    } = req.body;

    if (!title || !description || !productId || !platform || !originalPrice || !dealPrice || !dealUrl || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const discountPercentage = ((originalPrice - dealPrice) / originalPrice) * 100;
    const db = getDb();
    const dealId = randomUUID();

    db.prepare(
      `
      INSERT INTO deals (
        id, title, description, product_id, platform,
        original_price, deal_price, discount_percentage, coupon_code,
        deal_url, image_url, start_date, end_date, category,
        status, submitted_by, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
      `
    ).run(
      dealId,
      title,
      description,
      productId,
      platform,
      originalPrice,
      dealPrice,
      discountPercentage,
      couponCode || null,
      dealUrl,
      imageUrl || null,
      startDate,
      endDate,
      category || null,
      userId,
      new Date().toISOString(),
      new Date().toISOString()
    );

    return res.json({
      success: true,
      dealId,
      message: 'Deal submitted for approval'
    });
  } catch (error: any) {
    console.error('Error creating deal:', error);
    return res.status(500).json({ success: false, error: 'Failed to create deal' });
  }
});

/**
 * GET /:id - Get deal details
 * @access Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const deal = db
      .prepare(
        `
        SELECT d.*,
               p.name as product_name,
               p.description as product_description,
               p.image_url as product_image,
               u.name as submitted_by_name,
               (d.upvotes - d.downvotes) as score
        FROM deals d
        LEFT JOIN products p ON d.product_id = p.id
        LEFT JOIN users u ON d.submitted_by = u.id
        WHERE d.id = ?
        `
      )
      .get(id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    // Increment view count
    db.prepare('UPDATE deals SET views = views + 1 WHERE id = ?').run(id);

    return res.json({
      success: true,
      deal
    });
  } catch (error: any) {
    console.error('Error getting deal:', error);
    return res.status(500).json({ success: false, error: 'Failed to get deal' });
  }
});

/**
 * POST /:id/vote - Vote on a deal (upvote/downvote)
 * @access Private
 */
router.post('/:id/vote', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { voteType } = req.body;

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type. Must be "upvote" or "downvote"'
      });
    }

    const db = getDb();

    // Check if deal exists
    const deal = db.prepare('SELECT id FROM deals WHERE id = ?').get(id);
    if (!deal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    // Check for existing vote
    const existingVote = db
      .prepare('SELECT * FROM deal_votes WHERE deal_id = ? AND user_id = ?')
      .get(id, userId) as any;

    if (existingVote) {
      // Update vote if different
      if (existingVote.vote_type !== voteType) {
        // Remove old vote count
        if (existingVote.vote_type === 'upvote') {
          db.prepare('UPDATE deals SET upvotes = upvotes - 1 WHERE id = ?').run(id);
        } else {
          db.prepare('UPDATE deals SET downvotes = downvotes - 1 WHERE id = ?').run(id);
        }

        // Update vote type
        db.prepare('UPDATE deal_votes SET vote_type = ? WHERE deal_id = ? AND user_id = ?')
          .run(voteType, id, userId);

        // Add new vote count
        if (voteType === 'upvote') {
          db.prepare('UPDATE deals SET upvotes = upvotes + 1 WHERE id = ?').run(id);
        } else {
          db.prepare('UPDATE deals SET downvotes = downvotes + 1 WHERE id = ?').run(id);
        }
      }
    } else {
      // Create new vote
      const voteId = randomUUID();
      db.prepare(
        `
        INSERT INTO deal_votes (id, deal_id, user_id, vote_type, created_at)
        VALUES (?, ?, ?, ?, ?)
        `
      ).run(voteId, id, userId, voteType, new Date().toISOString());

      // Update vote count
      if (voteType === 'upvote') {
        db.prepare('UPDATE deals SET upvotes = upvotes + 1 WHERE id = ?').run(id);
      } else {
        db.prepare('UPDATE deals SET downvotes = downvotes + 1 WHERE id = ?').run(id);
      }
    }

    return res.json({
      success: true,
      message: 'Vote recorded'
    });
  } catch (error: any) {
    console.error('Error voting on deal:', error);
    return res.status(500).json({ success: false, error: 'Failed to vote on deal' });
  }
});

/**
 * GET /:id/comments - Get comments for a deal
 * @access Public
 */
router.get('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const comments = db
      .prepare(
        `
        SELECT c.*, u.name as user_name
        FROM deal_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.deal_id = ?
        ORDER BY c.created_at DESC
        `
      )
      .all(id);

    res.json({
      success: true,
      comments
    });
  } catch (error: any) {
    console.error('Error getting comments:', error);
    res.status(500).json({ success: false, error: 'Failed to get comments' });
  }
});

/**
 * POST /:id/comments - Add a comment to a deal
 * @access Private
 */
router.post('/:id/comments', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { comment, parentCommentId } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Comment cannot be empty'
      });
    }

    const db = getDb();

    // Check if deal exists
    const deal = db.prepare('SELECT id FROM deals WHERE id = ?').get(id);
    if (!deal) {
      return res.status(404).json({
        success: false,
        error: 'Deal not found'
      });
    }

    const commentId = randomUUID();
    db.prepare(
      `
      INSERT INTO deal_comments (
        id, deal_id, user_id, comment, parent_comment_id, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `
    ).run(
      commentId,
      id,
      userId,
      comment.trim(),
      parentCommentId || null,
      new Date().toISOString(),
      new Date().toISOString()
    );

    return res.json({
      success: true,
      commentId,
      message: 'Comment added'
    });
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
});

export default router;

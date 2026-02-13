/**
 * MSME Routes
 * Manages inventory, repricing, GST calculations, market intelligence, and WhatsApp integration
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

// ==================== INVENTORY ROUTES ====================

/**
 * GET /inventory - List user's inventory
 * @access Private
 */
router.get('/inventory', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { limit = 50, offset = 0, isActive } = req.query;
    const db = getDb();

    let query = `
      SELECT i.*,
             p.name as product_name,
             p.category as product_category,
             p.image_url as product_image
      FROM msme_inventory i
      LEFT JOIN products p ON i.product_id = p.id
      WHERE i.user_id = ?
    `;
    const params: any[] = [userId];

    if (isActive !== undefined) {
      query += ' AND i.is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }

    query += ' ORDER BY i.updated_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const inventory = db.prepare(query).all(...params);

    const total = db
      .prepare('SELECT COUNT(*) as count FROM msme_inventory WHERE user_id = ?')
      .get(userId) as any;

    res.json({
      success: true,
      inventory,
      total: total.count
    });
  } catch (error: any) {
    console.error('Error getting inventory:', error);
    res.status(500).json({ success: false, error: 'Failed to get inventory' });
  }
});

/**
 * POST /inventory - Add inventory item
 * @access Private
 */
router.post('/inventory', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      productId,
      sku,
      quantity,
      costPrice,
      sellingPrice,
      minPrice,
      maxPrice,
      warehouseLocation,
      reorderLevel
    } = req.body;

    if (!productId || !sku || !costPrice || !sellingPrice || !minPrice || !maxPrice) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const db = getDb();
    const inventoryId = randomUUID();

    db.prepare(
      `
      INSERT INTO msme_inventory (
        id, user_id, product_id, sku, quantity, cost_price,
        selling_price, min_price, max_price, warehouse_location,
        reorder_level, is_active, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `
    ).run(
      inventoryId,
      userId,
      productId,
      sku,
      quantity || 0,
      costPrice,
      sellingPrice,
      minPrice,
      maxPrice,
      warehouseLocation || null,
      reorderLevel || null,
      new Date().toISOString(),
      new Date().toISOString()
    );

    return res.json({
      success: true,
      inventoryId,
      message: 'Inventory item added'
    });
  } catch (error: any) {
    console.error('Error adding inventory item:', error);
    return res.status(500).json({ success: false, error: 'Failed to add inventory item' });
  }
});

/**
 * PUT /inventory/:id - Update inventory item
 * @access Private
 */
router.put('/inventory/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const {
      quantity,
      costPrice,
      sellingPrice,
      minPrice,
      maxPrice,
      warehouseLocation,
      reorderLevel,
      isActive
    } = req.body;

    const db = getDb();

    // Verify ownership
    const item = db
      .prepare('SELECT * FROM msme_inventory WHERE id = ? AND user_id = ?')
      .get(id, userId);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (quantity !== undefined) {
      updates.push('quantity = ?');
      params.push(quantity);
    }
    if (costPrice !== undefined) {
      updates.push('cost_price = ?');
      params.push(costPrice);
    }
    if (sellingPrice !== undefined) {
      updates.push('selling_price = ?');
      params.push(sellingPrice);
    }
    if (minPrice !== undefined) {
      updates.push('min_price = ?');
      params.push(minPrice);
    }
    if (maxPrice !== undefined) {
      updates.push('max_price = ?');
      params.push(maxPrice);
    }
    if (warehouseLocation !== undefined) {
      updates.push('warehouse_location = ?');
      params.push(warehouseLocation);
    }
    if (reorderLevel !== undefined) {
      updates.push('reorder_level = ?');
      params.push(reorderLevel);
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id, userId);

    db.prepare(
      `UPDATE msme_inventory SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
    ).run(...params);

    return res.json({
      success: true,
      message: 'Inventory item updated'
    });
  } catch (error: any) {
    console.error('Error updating inventory item:', error);
    return res.status(500).json({ success: false, error: 'Failed to update inventory item' });
  }
});

/**
 * DELETE /inventory/:id - Delete inventory item
 * @access Private
 */
router.delete('/inventory/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const db = getDb();

    const result = db
      .prepare('DELETE FROM msme_inventory WHERE id = ? AND user_id = ?')
      .run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    return res.json({
      success: true,
      message: 'Inventory item deleted'
    });
  } catch (error: any) {
    console.error('Error deleting inventory item:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete inventory item' });
  }
});

// ==================== REPRICING ROUTES ====================

/**
 * GET /repricing/rules - List repricing rules
 * @access Private
 */
router.get('/repricing/rules', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    const rules = db
      .prepare(
        `
        SELECT r.*,
               i.sku,
               i.selling_price,
               p.name as product_name
        FROM repricing_rules r
        LEFT JOIN msme_inventory i ON r.inventory_id = i.id
        LEFT JOIN products p ON i.product_id = p.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        `
      )
      .all(userId);

    res.json({
      success: true,
      rules
    });
  } catch (error: any) {
    console.error('Error getting repricing rules:', error);
    res.status(500).json({ success: false, error: 'Failed to get repricing rules' });
  }
});

/**
 * POST /repricing/rules - Create repricing rule
 * @access Private
 */
router.post('/repricing/rules', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      inventoryId,
      strategy,
      minMarginPercentage,
      maxDiscountPercentage,
      competitorPlatforms
    } = req.body;

    if (!inventoryId || !strategy) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const db = getDb();

    // Verify inventory ownership
    const inventory = db
      .prepare('SELECT * FROM msme_inventory WHERE id = ? AND user_id = ?')
      .get(inventoryId, userId);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    const ruleId = randomUUID();
    db.prepare(
      `
      INSERT INTO repricing_rules (
        id, user_id, inventory_id, strategy, min_margin_percentage,
        max_discount_percentage, competitor_platforms, is_active,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `
    ).run(
      ruleId,
      userId,
      inventoryId,
      strategy,
      minMarginPercentage || 10.0,
      maxDiscountPercentage || 50.0,
      JSON.stringify(competitorPlatforms || []),
      new Date().toISOString(),
      new Date().toISOString()
    );

    return res.json({
      success: true,
      ruleId,
      message: 'Repricing rule created'
    });
  } catch (error: any) {
    console.error('Error creating repricing rule:', error);
    return res.status(500).json({ success: false, error: 'Failed to create repricing rule' });
  }
});

/**
 * PUT /repricing/rules/:id - Update repricing rule
 * @access Private
 */
router.put('/repricing/rules/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const {
      strategy,
      minMarginPercentage,
      maxDiscountPercentage,
      competitorPlatforms,
      isActive
    } = req.body;

    const db = getDb();

    // Verify ownership
    const rule = db
      .prepare('SELECT * FROM repricing_rules WHERE id = ? AND user_id = ?')
      .get(id, userId);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Repricing rule not found'
      });
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (strategy) {
      updates.push('strategy = ?');
      params.push(strategy);
    }
    if (minMarginPercentage !== undefined) {
      updates.push('min_margin_percentage = ?');
      params.push(minMarginPercentage);
    }
    if (maxDiscountPercentage !== undefined) {
      updates.push('max_discount_percentage = ?');
      params.push(maxDiscountPercentage);
    }
    if (competitorPlatforms) {
      updates.push('competitor_platforms = ?');
      params.push(JSON.stringify(competitorPlatforms));
    }
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id, userId);

    db.prepare(
      `UPDATE repricing_rules SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
    ).run(...params);

    return res.json({
      success: true,
      message: 'Repricing rule updated'
    });
  } catch (error: any) {
    console.error('Error updating repricing rule:', error);
    return res.status(500).json({ success: false, error: 'Failed to update repricing rule' });
  }
});

/**
 * DELETE /repricing/rules/:id - Delete repricing rule
 * @access Private
 */
router.delete('/repricing/rules/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const db = getDb();

    const result = db
      .prepare('DELETE FROM repricing_rules WHERE id = ? AND user_id = ?')
      .run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Repricing rule not found'
      });
    }

    return res.json({
      success: true,
      message: 'Repricing rule deleted'
    });
  } catch (error: any) {
    console.error('Error deleting repricing rule:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete repricing rule' });
  }
});

/**
 * POST /repricing/execute - Execute repricing for user's inventory
 * @access Private
 */
router.post('/repricing/execute', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { inventoryId } = req.body;
    const db = getDb();

    // Get active rules (for specific inventory or all)
    let rulesQuery = `
      SELECT r.*, i.cost_price, i.selling_price, i.min_price, i.max_price
      FROM repricing_rules r
      JOIN msme_inventory i ON r.inventory_id = i.id
      WHERE r.user_id = ? AND r.is_active = 1 AND i.is_active = 1
    `;
    const params: any[] = [userId];

    if (inventoryId) {
      rulesQuery += ' AND r.inventory_id = ?';
      params.push(inventoryId);
    }

    const rules = db.prepare(rulesQuery).all(...params) as any[];

    if (rules.length === 0) {
      return res.json({
        success: true,
        message: 'No active repricing rules found',
        updated: 0
      });
    }

    const updates: any[] = [];

    // Execute repricing for each rule
    for (const rule of rules) {
      let newPrice = rule.selling_price;
      let reason = '';

      // Simple repricing logic based on strategy
      switch (rule.strategy) {
        case 'match_lowest':
          // In real scenario, fetch competitor prices
          // For now, reduce by 5%
          newPrice = rule.selling_price * 0.95;
          reason = 'Matched lowest competitor price';
          break;

        case 'beat_lowest':
          // Beat competitor by 2%
          newPrice = rule.selling_price * 0.93;
          reason = 'Beat lowest competitor price by 2%';
          break;

        case 'maximize_margin':
          // Increase towards max price
          newPrice = Math.min(rule.max_price, rule.selling_price * 1.05);
          reason = 'Maximizing profit margin';
          break;

        case 'stay_competitive':
          // Stay within 5% of market average
          newPrice = rule.selling_price * 0.98;
          reason = 'Staying competitive with market';
          break;

        case 'dynamic_demand':
          // Adjust based on demand (simplified)
          newPrice = rule.selling_price * 1.02;
          reason = 'Dynamic pricing based on demand';
          break;
      }

      // Apply constraints
      const minMargin = rule.cost_price * (1 + rule.min_margin_percentage / 100);
      const maxDiscount = rule.cost_price * (1 + rule.max_discount_percentage / 100);

      newPrice = Math.max(rule.min_price, Math.min(rule.max_price, newPrice));
      newPrice = Math.max(minMargin, newPrice);
      newPrice = Math.min(maxDiscount, newPrice);

      // Only update if price changed significantly (more than 1%)
      if (Math.abs(newPrice - rule.selling_price) / rule.selling_price > 0.01) {
        // Update inventory price
        db.prepare('UPDATE msme_inventory SET selling_price = ?, updated_at = ? WHERE id = ?')
          .run(newPrice, new Date().toISOString(), rule.inventory_id);

        // Log repricing history
        const historyId = randomUUID();
        db.prepare(
          `
          INSERT INTO repricing_history (
            id, repricing_rule_id, old_price, new_price, reason, executed_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `
        ).run(
          historyId,
          rule.id,
          rule.selling_price,
          newPrice,
          reason,
          new Date().toISOString()
        );

        updates.push({
          inventoryId: rule.inventory_id,
          oldPrice: rule.selling_price,
          newPrice,
          reason
        });
      }
    }

    return res.json({
      success: true,
      message: 'Repricing executed',
      updated: updates.length,
      updates
    });
  } catch (error: any) {
    console.error('Error executing repricing:', error);
    return res.status(500).json({ success: false, error: 'Failed to execute repricing' });
  }
});

// ==================== GST ROUTES ====================

/**
 * POST /gst/calculate - Calculate GST for a price
 * @access Private
 */
router.post('/gst/calculate', requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, gstRate, includesGst } = req.body;

    if (!amount || !gstRate) {
      return res.status(400).json({
        success: false,
        error: 'Amount and GST rate are required'
      });
    }

    let baseAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (includesGst) {
      // Amount includes GST, extract it
      totalAmount = amount;
      baseAmount = amount / (1 + gstRate / 100);
      gstAmount = amount - baseAmount;
    } else {
      // Amount excludes GST, add it
      baseAmount = amount;
      gstAmount = amount * (gstRate / 100);
      totalAmount = amount + gstAmount;
    }

    // GST is split into CGST and SGST (or IGST for inter-state)
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return res.json({
      success: true,
      calculation: {
        baseAmount: parseFloat(baseAmount.toFixed(2)),
        gstRate,
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        breakdown: {
          cgst: parseFloat(cgst.toFixed(2)),
          sgst: parseFloat(sgst.toFixed(2)),
          igst: parseFloat(gstAmount.toFixed(2))
        }
      }
    });
  } catch (error: any) {
    console.error('Error calculating GST:', error);
    return res.status(500).json({ success: false, error: 'Failed to calculate GST' });
  }
});

/**
 * GET /gst/rates - Get common GST rates
 * @access Public
 */
router.get('/gst/rates', async (_req: Request, res: Response) => {
  try {
    const gstRates = [
      { rate: 0, category: 'Nil', description: 'Essential items like fresh food, books' },
      { rate: 5, category: '5%', description: 'Essential goods like sugar, tea, coffee' },
      { rate: 12, category: '12%', description: 'Processed food, computers' },
      { rate: 18, category: '18%', description: 'Most goods and services' },
      { rate: 28, category: '28%', description: 'Luxury items, automobiles' }
    ];

    res.json({
      success: true,
      rates: gstRates
    });
  } catch (error: any) {
    console.error('Error getting GST rates:', error);
    res.status(500).json({ success: false, error: 'Failed to get GST rates' });
  }
});

// ==================== MARKET INTELLIGENCE ROUTES ====================

/**
 * GET /market/opportunities - Get market opportunities
 * @access Private
 */
router.get('/market/opportunities', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    // Get user's inventory categories
    const userCategories = db
      .prepare(
        `
        SELECT DISTINCT p.category
        FROM msme_inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.user_id = ? AND i.is_active = 1
        `
      )
      .all(userId) as any[];

    // Simple opportunities based on trending products in user's categories
    const opportunities = db
      .prepare(
        `
        SELECT p.category, COUNT(*) as product_count,
               AVG(pp.current_price) as avg_price,
               MAX(p.rating) as max_rating
        FROM products p
        LEFT JOIN platform_prices pp ON p.id = pp.product_id
        WHERE p.category IN (${userCategories.map(() => '?').join(',')})
        GROUP BY p.category
        ORDER BY product_count DESC
        LIMIT 10
        `
      )
      .all(...userCategories.map((c: any) => c.category));

    res.json({
      success: true,
      opportunities: opportunities || []
    });
  } catch (error: any) {
    console.error('Error getting market opportunities:', error);
    res.status(500).json({ success: false, error: 'Failed to get market opportunities' });
  }
});

/**
 * GET /market/threats - Get market threats (competitor analysis)
 * @access Private
 */
router.get('/market/threats', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    // Get inventory items where competitor prices are lower
    const threats = db
      .prepare(
        `
        SELECT i.sku,
               p.name as product_name,
               i.selling_price,
               MIN(pp.current_price) as competitor_price,
               pp.platform as competitor_platform,
               ((i.selling_price - MIN(pp.current_price)) / i.selling_price * 100) as price_difference_percentage
        FROM msme_inventory i
        JOIN products p ON i.product_id = p.id
        LEFT JOIN platform_prices pp ON p.id = pp.product_id
        WHERE i.user_id = ? AND i.is_active = 1
        GROUP BY i.id
        HAVING competitor_price < i.selling_price
        ORDER BY price_difference_percentage DESC
        LIMIT 20
        `
      )
      .all(userId);

    res.json({
      success: true,
      threats
    });
  } catch (error: any) {
    console.error('Error getting market threats:', error);
    res.status(500).json({ success: false, error: 'Failed to get market threats' });
  }
});

// ==================== WHATSAPP ROUTES ====================

/**
 * POST /whatsapp/connect - Connect WhatsApp Business
 * @access Private
 */
router.post('/whatsapp/connect', requireAuth, async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    // In a real implementation, this would integrate with WhatsApp Business API
    // For now, we'll just return a success message

    return res.json({
      success: true,
      message: 'WhatsApp Business connection initiated',
      status: 'pending_verification',
      phoneNumber
    });
  } catch (error: any) {
    console.error('Error connecting WhatsApp:', error);
    return res.status(500).json({ success: false, error: 'Failed to connect WhatsApp' });
  }
});

/**
 * POST /whatsapp/disconnect - Disconnect WhatsApp Business
 * @access Private
 */
router.post('/whatsapp/disconnect', requireAuth, async (_req: Request, res: Response) => {
  try {
    // In a real implementation, this would disconnect from WhatsApp Business API

    res.json({
      success: true,
      message: 'WhatsApp Business disconnected'
    });
  } catch (error: any) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ success: false, error: 'Failed to disconnect WhatsApp' });
  }
});

export default router;

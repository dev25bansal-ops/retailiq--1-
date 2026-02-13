import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { predictPrices } from '../ml/forecasting';
import { generateBuyRecommendation } from '../ml/recommendations';
import { forecastDemand } from '../ml/demand';

const router = Router();

// GET /product/:id - Price predictions
router.get('/product/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    const db = getDb();

    // Get price history
    const history = db.prepare(`
      SELECT DATE(recorded_at) as date, AVG(price) as price
      FROM price_history
      WHERE product_id = ? AND recorded_at >= datetime('now', '-90 days')
      GROUP BY DATE(recorded_at)
      ORDER BY date ASC
    `).all(id) as any[];

    const predictions = predictPrices(history, Number(days));

    res.json({ success: true, predictions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /best-time/:id - Best time to buy
router.get('/best-time/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const history = db.prepare(`
      SELECT DATE(recorded_at) as date, AVG(price) as price
      FROM price_history
      WHERE product_id = ?
      ORDER BY date ASC
    `).all(id) as any[];

    const predictions = predictPrices(history, 30);
    const bestPrediction = predictions.reduce((best, curr) =>
      curr.predictedPrice < best.predictedPrice ? curr : best
    );

    res.json({ success: true, bestTime: bestPrediction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /buy-or-wait/:id - Buy or wait recommendation
router.get('/buy-or-wait/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    const history = db.prepare(`
      SELECT DATE(recorded_at) as date, AVG(price) as price
      FROM price_history
      WHERE product_id = ?
      ORDER BY date ASC
    `).all(id) as any[];

    const predictions = predictPrices(history, 30);
    const recommendation = generateBuyRecommendation(id, history, predictions, product.category);

    res.json({ success: true, recommendation });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /demand/:category - Demand forecast
router.get('/demand/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { days = 30 } = req.query;

    // Mock historical demand data
    const historicalData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      demand: 100 + Math.random() * 50,
      category
    }));

    const forecasts = forecastDemand(category, historicalData, Number(days));

    res.json({ success: true, forecasts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

/**
 * Buy/Wait Recommendation Engine
 * Combines forecasting, seasonality, and historical analysis
 */

import { PricePrediction } from './forecasting';
import { getUpcomingFestivalImpact, FestivalImpact } from './seasonality';

export type RecommendationAction = 'buy_now' | 'wait' | 'set_alert';

export interface BuyRecommendation {
  action: RecommendationAction;
  confidence: number;
  reasoning: string;
  predictedBestPrice: number;
  predictedBestDate: string;
  savingsIfWait: number;
  factors: {
    currentPricePosition: 'low' | 'average' | 'high';
    trend: 'rising' | 'falling' | 'stable';
    festivalImpact: FestivalImpact | null;
    volatility: 'low' | 'medium' | 'high';
    predictionAccuracy: number;
  };
}

interface PriceHistoryPoint {
  date: string;
  price: number;
}

/**
 * Calculate price statistics from history
 */
function calculatePriceStats(priceHistory: PriceHistoryPoint[]): {
  min: number;
  max: number;
  average: number;
  median: number;
  volatility: number;
  currentPosition: number;
} {
  if (priceHistory.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      volatility: 0,
      currentPosition: 0.5
    };
  }

  const prices = priceHistory.map(p => p.price).sort((a, b) => a - b);
  const currentPrice = priceHistory[priceHistory.length - 1].price;

  const min = prices[0];
  const max = prices[prices.length - 1];
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const median = prices[Math.floor(prices.length / 2)];

  // Calculate volatility as coefficient of variation
  const squaredDiffs = prices.map(p => Math.pow(p - average, 2));
  const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const volatility = average > 0 ? stdDev / average : 0;

  // Current position in range (0 = min, 1 = max)
  const currentPosition = max > min ? (currentPrice - min) / (max - min) : 0.5;

  return {
    min,
    max,
    average,
    median,
    volatility,
    currentPosition
  };
}

/**
 * Determine price trend
 */
function analyzeTrend(priceHistory: PriceHistoryPoint[]): {
  direction: 'rising' | 'falling' | 'stable';
  strength: number;
} {
  if (priceHistory.length < 5) {
    return { direction: 'stable', strength: 0 };
  }

  // Compare recent prices (last 7 days) to earlier prices
  const recentCount = Math.min(7, Math.floor(priceHistory.length / 3));
  const recentPrices = priceHistory.slice(-recentCount).map(p => p.price);
  const earlierPrices = priceHistory.slice(0, recentCount).map(p => p.price);

  const recentAvg = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;
  const earlierAvg = earlierPrices.reduce((sum, p) => sum + p, 0) / earlierPrices.length;

  const change = (recentAvg - earlierAvg) / earlierAvg;
  const strength = Math.abs(change);

  let direction: 'rising' | 'falling' | 'stable';
  if (change > 0.03) {
    direction = 'rising';
  } else if (change < -0.03) {
    direction = 'falling';
  } else {
    direction = 'stable';
  }

  return { direction, strength };
}

/**
 * Find best predicted price and date
 */
function findBestPredictedPrice(predictions: PricePrediction[]): {
  price: number;
  date: string;
  daysAhead: number;
} {
  if (predictions.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    return { price: 0, date: today, daysAhead: 0 };
  }

  // Find the prediction with the lowest price
  const bestPrediction = predictions.reduce((best, current) =>
    current.predictedPrice < best.predictedPrice ? current : best
  );

  const daysAhead = predictions.findIndex(p => p.date === bestPrediction.date) + 1;

  return {
    price: bestPrediction.predictedPrice,
    date: bestPrediction.date,
    daysAhead
  };
}

/**
 * Generate buy recommendation
 */
export function generateBuyRecommendation(
  _productId: string,
  priceHistory: PriceHistoryPoint[],
  predictions: PricePrediction[],
  category: string = 'electronics'
): BuyRecommendation {
  if (priceHistory.length === 0) {
    return {
      action: 'set_alert',
      confidence: 0,
      reasoning: 'Insufficient price history to make a recommendation.',
      predictedBestPrice: 0,
      predictedBestDate: new Date().toISOString().split('T')[0],
      savingsIfWait: 0,
      factors: {
        currentPricePosition: 'average',
        trend: 'stable',
        festivalImpact: null,
        volatility: 'medium',
        predictionAccuracy: 0
      }
    };
  }

  const stats = calculatePriceStats(priceHistory);
  const trend = analyzeTrend(priceHistory);
  const festivalImpact = getUpcomingFestivalImpact(category);
  const bestPredicted = findBestPredictedPrice(predictions);
  const currentPrice = priceHistory[priceHistory.length - 1].price;

  // Determine current price position
  let currentPricePosition: 'low' | 'average' | 'high';
  if (stats.currentPosition < 0.3) {
    currentPricePosition = 'low';
  } else if (stats.currentPosition > 0.7) {
    currentPricePosition = 'high';
  } else {
    currentPricePosition = 'average';
  }

  // Determine volatility level
  let volatilityLevel: 'low' | 'medium' | 'high';
  if (stats.volatility < 0.05) {
    volatilityLevel = 'low';
  } else if (stats.volatility < 0.15) {
    volatilityLevel = 'medium';
  } else {
    volatilityLevel = 'high';
  }

  // Calculate prediction accuracy (average confidence)
  const predictionAccuracy =
    predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      : 0;

  // Decision logic
  let action: RecommendationAction;
  let reasoning: string;
  let confidence: number;

  // Factor 1: Current price is near historical low
  const isNearLow = stats.currentPosition < 0.25;

  // Factor 2: Festival is coming soon
  const festivalSoon = festivalImpact && festivalImpact.daysUntil <= 30;

  // Factor 3: Price has already dropped for festival
  const alreadyDiscounted =
    festivalSoon &&
    festivalImpact &&
    currentPrice < stats.average * (1 - festivalImpact.expectedDiscount / 200);

  // Factor 4: Predicted savings
  const potentialSavings = currentPrice - bestPredicted.price;
  const savingsPercentage = (potentialSavings / currentPrice) * 100;

  // Decision tree
  if (isNearLow && !festivalSoon) {
    action = 'buy_now';
    confidence = 0.85;
    reasoning = `Current price is near its 6-month low (${Math.round(
      stats.currentPosition * 100
    )}th percentile). No major festivals in the next 30 days. This is a good time to buy.`;
  } else if (festivalSoon && !alreadyDiscounted && festivalImpact) {
    action = 'wait';
    confidence = festivalImpact.confidence;
    reasoning = `${festivalImpact.festival} is ${
      festivalImpact.daysUntil
    } days away with expected ${festivalImpact.expectedDiscount}% discount. Current price hasn't dropped yet. Wait for festival sale.`;
  } else if (festivalSoon && alreadyDiscounted && isNearLow) {
    action = 'buy_now';
    confidence = 0.9;
    reasoning = `Price has already dropped for the upcoming festival and is near historical low. Buy now before stock runs out.`;
  } else if (trend.direction === 'falling' && trend.strength > 0.05) {
    action = 'wait';
    confidence = 0.7;
    reasoning = `Price is on a downward trend (${Math.round(
      trend.strength * 100
    )}% decline). Expected to drop further. Consider waiting ${bestPredicted.daysAhead} days.`;
  } else if (trend.direction === 'rising' && trend.strength > 0.05) {
    action = 'buy_now';
    confidence = 0.75;
    reasoning = `Price is rising (${Math.round(
      trend.strength * 100
    )}% increase). Buy now before it goes higher.`;
  } else if (savingsPercentage > 10) {
    action = 'wait';
    confidence = predictionAccuracy;
    reasoning = `Price is predicted to drop by ${Math.round(
      savingsPercentage
    )}% in the next ${bestPredicted.daysAhead} days. Worth waiting.`;
  } else if (currentPricePosition === 'high') {
    action = 'set_alert';
    confidence = 0.65;
    reasoning = `Current price is higher than usual (${Math.round(
      stats.currentPosition * 100
    )}th percentile). Set an alert for price drops below ₹${Math.round(stats.average)}.`;
  } else if (volatilityLevel === 'high') {
    action = 'set_alert';
    confidence = 0.6;
    reasoning = `Price is highly volatile. Set an alert and wait for a stable low price.`;
  } else {
    action = 'set_alert';
    confidence = 0.5;
    reasoning = `Price is around average. Set an alert for better deals. You can also buy now if you need the product urgently.`;
  }

  return {
    action,
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
    predictedBestPrice: Math.round(bestPredicted.price * 100) / 100,
    predictedBestDate: bestPredicted.date,
    savingsIfWait: Math.max(0, Math.round(potentialSavings * 100) / 100),
    factors: {
      currentPricePosition,
      trend: trend.direction,
      festivalImpact,
      volatility: volatilityLevel,
      predictionAccuracy: Math.round(predictionAccuracy * 100) / 100
    }
  };
}

/**
 * Generate simple recommendation text
 */
export function getRecommendationText(recommendation: BuyRecommendation): string {
  const emoji =
    recommendation.action === 'buy_now'
      ? '✅'
      : recommendation.action === 'wait'
      ? '⏳'
      : '🔔';

  const actionText =
    recommendation.action === 'buy_now'
      ? 'BUY NOW'
      : recommendation.action === 'wait'
      ? 'WAIT'
      : 'SET ALERT';

  const confidenceText = `${Math.round(recommendation.confidence * 100)}% confidence`;

  return `${emoji} ${actionText} (${confidenceText})\n\n${recommendation.reasoning}`;
}

/**
 * Score a deal for community deals feature
 */
export function scoreDeal(
  currentPrice: number,
  historicalAverage: number,
  historicalMin: number,
  festivalActive: boolean
): {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
} {
  const discountFromAverage = ((historicalAverage - currentPrice) / historicalAverage) * 100;
  const distanceFromMin = ((currentPrice - historicalMin) / historicalMin) * 100;

  let score = 0;

  // Factor 1: Discount from average (40 points)
  if (discountFromAverage >= 30) score += 40;
  else if (discountFromAverage >= 20) score += 30;
  else if (discountFromAverage >= 10) score += 20;
  else if (discountFromAverage >= 5) score += 10;

  // Factor 2: Distance from historical min (30 points)
  if (distanceFromMin <= 5) score += 30;
  else if (distanceFromMin <= 15) score += 20;
  else if (distanceFromMin <= 30) score += 10;

  // Factor 3: Festival bonus (20 points)
  if (festivalActive) score += 20;

  // Factor 4: Absolute discount (10 points)
  if (currentPrice < historicalAverage) score += 10;

  // Determine rating
  let rating: 'excellent' | 'good' | 'fair' | 'poor';
  let label: string;

  if (score >= 80) {
    rating = 'excellent';
    label = 'HOT DEAL 🔥';
  } else if (score >= 60) {
    rating = 'good';
    label = 'Good Deal';
  } else if (score >= 40) {
    rating = 'fair';
    label = 'Fair Price';
  } else {
    rating = 'poor';
    label = 'Not a Deal';
  }

  return { score, rating, label };
}

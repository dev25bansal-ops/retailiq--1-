/**
 * Demand Forecasting
 * Predicts future demand based on historical data and seasonal patterns
 */

import { getUpcomingFestivalImpact, getIndianFestivalCalendar } from './seasonality';
import { linearRegression } from './forecasting';

export interface DemandDataPoint {
  date: string;
  demand: number;
  category?: string;
}

export interface DemandForecast {
  date: string;
  predictedDemand: number;
  confidence: number;
  factors: {
    baselineDemand: number;
    trendAdjustment: number;
    seasonalMultiplier: number;
    festivalBoost: number;
    totalMultiplier: number;
  };
}

export interface MarketOpportunity {
  category: string;
  currentDemand: number;
  projectedDemand: number;
  growthRate: number;
  confidence: number;
  reasoning: string;
  timeframe: string;
}

/**
 * Calculate baseline demand from historical data
 */
function calculateBaseline(historicalData: DemandDataPoint[]): number {
  if (historicalData.length === 0) return 0;

  const demands = historicalData.map(d => d.demand);
  const sum = demands.reduce((acc, val) => acc + val, 0);
  return sum / demands.length;
}

/**
 * Calculate demand trend
 */
function calculateTrend(historicalData: DemandDataPoint[]): {
  dailyGrowthRate: number;
  strength: number;
} {
  if (historicalData.length < 7) {
    return { dailyGrowthRate: 0, strength: 0 };
  }

  // Prepare data for linear regression
  const sortedData = [...historicalData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const regressionData = sortedData.map((point, index) => ({
    x: index,
    y: point.demand
  }));

  const model = linearRegression(regressionData);

  // Convert slope to daily growth rate
  const baseline = calculateBaseline(historicalData);
  const dailyGrowthRate = baseline > 0 ? model.slope / baseline : 0;

  return {
    dailyGrowthRate,
    strength: model.r2
  };
}

/**
 * Get seasonal multiplier for a given month
 */
function getSeasonalMultiplier(month: number, _category: string): number {
  // Peak shopping months in India
  const peakMonths = [9, 10, 11]; // Oct, Nov, Dec (Diwali, festivals, year-end)
  const highMonths = [0, 1, 6, 7]; // Jan, Feb (Republic Day), Jul, Aug (Independence Day)
  // Normal months: [2, 3, 4, 5, 8]; // Mar, Apr, May, Jun, Sep

  if (peakMonths.includes(month)) {
    return 1.4; // 40% higher demand
  } else if (highMonths.includes(month)) {
    return 1.15; // 15% higher demand
  } else {
    return 0.95; // 5% lower demand
  }
}

/**
 * Get festival boost factor
 */
function getFestivalBoost(date: Date, category: string): {
  multiplier: number;
  festival: string | null;
} {
  const year = date.getFullYear();
  const festivals = getIndianFestivalCalendar(year);

  for (const festival of festivals) {
    if (!festival.categories.includes(category) && !festival.categories.includes('electronics')) {
      continue;
    }

    const festivalDate = festival.date;
    const daysDiff = Math.floor(
      (date.getTime() - festivalDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Check if within festival window
    if (daysDiff >= -festival.prePeriodDays && daysDiff <= festival.postPeriodDays) {
      // Peak demand on festival day and day before
      if (daysDiff >= -1 && daysDiff <= 0) {
        return { multiplier: festival.demandMultiplier, festival: festival.name };
      }
      // High demand in pre-period
      else if (daysDiff < 0) {
        const fraction = Math.abs(daysDiff) / festival.prePeriodDays;
        const boost = 1 + (festival.demandMultiplier - 1) * (1 - fraction * 0.5);
        return { multiplier: boost, festival: festival.name };
      }
      // Declining demand in post-period
      else {
        const fraction = daysDiff / festival.postPeriodDays;
        const boost = 1 + (festival.demandMultiplier - 1) * (1 - fraction);
        return { multiplier: boost, festival: festival.name };
      }
    }
  }

  return { multiplier: 1.0, festival: null };
}

/**
 * Forecast demand for future periods
 */
export function forecastDemand(
  category: string,
  historicalData: DemandDataPoint[],
  daysAhead: number = 30
): DemandForecast[] {
  if (historicalData.length === 0) {
    return [];
  }

  const baseline = calculateBaseline(historicalData);
  const trend = calculateTrend(historicalData);

  // Get last date in historical data
  const sortedData = [...historicalData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const lastDate = new Date(sortedData[sortedData.length - 1].date);

  const forecasts: DemandForecast[] = [];

  for (let day = 1; day <= daysAhead; day++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + day);

    // Factor 1: Baseline demand
    const baselineDemand = baseline;

    // Factor 2: Trend adjustment
    const trendAdjustment = trend.dailyGrowthRate * day;

    // Factor 3: Seasonal multiplier
    const seasonalMultiplier = getSeasonalMultiplier(forecastDate.getMonth(), category);

    // Factor 4: Festival boost
    const festivalBoost = getFestivalBoost(forecastDate, category);

    // Combine all factors
    const totalMultiplier = (1 + trendAdjustment) * seasonalMultiplier * festivalBoost.multiplier;
    const predictedDemand = baselineDemand * totalMultiplier;

    // Calculate confidence
    const baseConfidence = Math.min(historicalData.length / 30, 0.9);
    const timeDecay = Math.exp(-day / (daysAhead * 0.7));
    const trendConfidence = trend.strength;
    const confidence = baseConfidence * timeDecay * (0.5 + 0.5 * trendConfidence);

    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      predictedDemand: Math.round(predictedDemand * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      factors: {
        baselineDemand: Math.round(baselineDemand * 100) / 100,
        trendAdjustment: Math.round(trendAdjustment * 1000) / 1000,
        seasonalMultiplier: Math.round(seasonalMultiplier * 100) / 100,
        festivalBoost: Math.round(festivalBoost.multiplier * 100) / 100,
        totalMultiplier: Math.round(totalMultiplier * 100) / 100
      }
    });
  }

  return forecasts;
}

/**
 * Identify market opportunities based on demand forecasts
 */
export function identifyMarketOpportunities(
  categories: string[],
  historicalDataByCategory: Map<string, DemandDataPoint[]>
): MarketOpportunity[] {
  const opportunities: MarketOpportunity[] = [];
  const forecastPeriod = 30;

  for (const category of categories) {
    const historicalData = historicalDataByCategory.get(category) || [];

    if (historicalData.length < 7) {
      continue; // Not enough data
    }

    const forecasts = forecastDemand(category, historicalData, forecastPeriod);

    if (forecasts.length === 0) continue;

    const currentDemand = historicalData[historicalData.length - 1].demand;
    const avgProjectedDemand =
      forecasts.reduce((sum, f) => sum + f.predictedDemand, 0) / forecasts.length;
    const growthRate = ((avgProjectedDemand - currentDemand) / currentDemand) * 100;

    // Calculate average confidence
    const avgConfidence =
      forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length;

    // Determine if this is an opportunity
    let reasoning = '';
    let isOpportunity = false;

    if (growthRate > 30) {
      reasoning = `Strong demand growth of ${Math.round(
        growthRate
      )}% expected. High potential for increased sales and pricing power.`;
      isOpportunity = true;
    } else if (growthRate > 15) {
      reasoning = `Moderate demand growth of ${Math.round(
        growthRate
      )}% expected. Good opportunity to increase inventory.`;
      isOpportunity = true;
    } else if (growthRate > 5) {
      reasoning = `Slight demand increase of ${Math.round(
        growthRate
      )}% expected. Consider maintaining current stock levels.`;
      isOpportunity = true;
    } else if (growthRate < -15) {
      reasoning = `Demand declining by ${Math.round(
        Math.abs(growthRate)
      )}%. Consider reducing prices or inventory to clear stock.`;
    } else {
      reasoning = `Stable demand with ${Math.round(
        Math.abs(growthRate)
      )}% change. No immediate action needed.`;
    }

    // Check for upcoming festivals
    const festivalImpact = getUpcomingFestivalImpact(category);
    if (festivalImpact && festivalImpact.daysUntil <= 30) {
      reasoning += ` ${festivalImpact.festival} approaching in ${festivalImpact.daysUntil} days.`;
      isOpportunity = true;
    }

    if (isOpportunity || growthRate < -15) {
      opportunities.push({
        category,
        currentDemand: Math.round(currentDemand * 100) / 100,
        projectedDemand: Math.round(avgProjectedDemand * 100) / 100,
        growthRate: Math.round(growthRate * 100) / 100,
        confidence: Math.round(avgConfidence * 100) / 100,
        reasoning,
        timeframe: `Next ${forecastPeriod} days`
      });
    }
  }

  // Sort by growth rate (descending)
  return opportunities.sort((a, b) => b.growthRate - a.growthRate);
}

/**
 * Calculate optimal inventory level based on demand forecast
 */
export function calculateOptimalInventory(
  category: string,
  historicalData: DemandDataPoint[],
  leadTimeDays: number = 7,
  safetyStockDays: number = 5
): {
  recommendedStock: number;
  reorderPoint: number;
  averageDailyDemand: number;
  peakDailyDemand: number;
} {
  if (historicalData.length === 0) {
    return {
      recommendedStock: 0,
      reorderPoint: 0,
      averageDailyDemand: 0,
      peakDailyDemand: 0
    };
  }

  const forecasts = forecastDemand(category, historicalData, leadTimeDays + safetyStockDays);

  const averageDailyDemand = calculateBaseline(historicalData);
  const peakDailyDemand = Math.max(...forecasts.map(f => f.predictedDemand));

  // Reorder point = (Average daily demand × Lead time) + Safety stock
  const reorderPoint = averageDailyDemand * leadTimeDays + averageDailyDemand * safetyStockDays;

  // Recommended stock = Peak demand × (Lead time + Safety stock days)
  const recommendedStock = peakDailyDemand * (leadTimeDays + safetyStockDays);

  return {
    recommendedStock: Math.ceil(recommendedStock),
    reorderPoint: Math.ceil(reorderPoint),
    averageDailyDemand: Math.round(averageDailyDemand * 100) / 100,
    peakDailyDemand: Math.round(peakDailyDemand * 100) / 100
  };
}

/**
 * Generate demand insights summary
 */
export function generateDemandInsights(
  category: string,
  historicalData: DemandDataPoint[]
): {
  trend: 'growing' | 'declining' | 'stable';
  volatility: 'high' | 'medium' | 'low';
  seasonality: 'strong' | 'moderate' | 'weak';
  upcomingEvents: string[];
  recommendation: string;
} {
  const trend = calculateTrend(historicalData);
  const festivalImpact = getUpcomingFestivalImpact(category);

  // Determine trend
  let trendDirection: 'growing' | 'declining' | 'stable';
  if (trend.dailyGrowthRate > 0.01) {
    trendDirection = 'growing';
  } else if (trend.dailyGrowthRate < -0.01) {
    trendDirection = 'declining';
  } else {
    trendDirection = 'stable';
  }

  // Calculate volatility
  const demands = historicalData.map(d => d.demand);
  const avg = demands.reduce((sum, d) => sum + d, 0) / demands.length;
  const variance = demands.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / demands.length;
  const coefficientOfVariation = Math.sqrt(variance) / avg;

  let volatility: 'high' | 'medium' | 'low';
  if (coefficientOfVariation > 0.3) {
    volatility = 'high';
  } else if (coefficientOfVariation > 0.15) {
    volatility = 'medium';
  } else {
    volatility = 'low';
  }

  // Determine seasonality strength
  const seasonality: 'strong' | 'moderate' | 'weak' = trend.strength > 0.6 ? 'strong' : trend.strength > 0.3 ? 'moderate' : 'weak';

  // Upcoming events
  const upcomingEvents: string[] = [];
  if (festivalImpact) {
    upcomingEvents.push(
      `${festivalImpact.festival} in ${festivalImpact.daysUntil} days (${festivalImpact.expectedDiscount}% off expected)`
    );
  }

  // Generate recommendation
  let recommendation = '';
  if (trendDirection === 'growing' && volatility === 'low') {
    recommendation = 'Steady growth with low volatility. Increase inventory gradually.';
  } else if (trendDirection === 'growing' && volatility === 'high') {
    recommendation = 'Growing but volatile. Monitor closely and adjust inventory frequently.';
  } else if (trendDirection === 'declining') {
    recommendation = 'Declining demand. Consider promotions and reduce inventory.';
  } else if (festivalImpact) {
    recommendation = `Prepare for ${festivalImpact.festival}. Stock up now.`;
  } else {
    recommendation = 'Stable demand. Maintain current inventory levels.';
  }

  return {
    trend: trendDirection,
    volatility,
    seasonality,
    upcomingEvents,
    recommendation
  };
}

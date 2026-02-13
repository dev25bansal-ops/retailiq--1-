/**
 * Price Forecasting ML Algorithms
 * Implements various time series forecasting methods for price prediction
 */

export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface PricePrediction {
  date: string;
  predictedPrice: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
}

export interface LinearRegressionModel {
  slope: number;
  intercept: number;
  r2: number;
  predict: (x: number) => number;
}

/**
 * Calculate Simple Moving Average
 */
export function simpleMovingAverage(prices: number[], window: number): number {
  if (prices.length < window) {
    window = prices.length;
  }

  const relevantPrices = prices.slice(-window);
  const sum = relevantPrices.reduce((acc, price) => acc + price, 0);
  return sum / relevantPrices.length;
}

/**
 * Calculate Exponential Moving Average
 */
export function exponentialMovingAverage(prices: number[], alpha: number): number {
  if (prices.length === 0) return 0;
  if (prices.length === 1) return prices[0];

  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = alpha * prices[i] + (1 - alpha) * ema;
  }

  return ema;
}

/**
 * Exponential Smoothing for multiple periods ahead
 */
export function exponentialSmoothing(
  prices: number[],
  alpha: number,
  periods: number
): number[] {
  if (prices.length === 0) return [];

  const forecasts: number[] = [];
  let level = prices[0];

  // Calculate level through historical data
  for (let i = 1; i < prices.length; i++) {
    level = alpha * prices[i] + (1 - alpha) * level;
  }

  // Forecast future periods (flat forecast with exponential smoothing)
  for (let i = 0; i < periods; i++) {
    forecasts.push(level);
  }

  return forecasts;
}

/**
 * Linear Regression for trend analysis
 */
export function linearRegression(
  data: { x: number; y: number }[]
): LinearRegressionModel {
  const n = data.length;

  if (n === 0) {
    return {
      slope: 0,
      intercept: 0,
      r2: 0,
      predict: () => 0
    };
  }

  // Calculate means
  const xMean = data.reduce((sum, point) => sum + point.x, 0) / n;
  const yMean = data.reduce((sum, point) => sum + point.y, 0) / n;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;

  for (const point of data) {
    numerator += (point.x - xMean) * (point.y - yMean);
    denominator += (point.x - xMean) ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  let ssTotal = 0;
  let ssResidual = 0;

  for (const point of data) {
    const predicted = slope * point.x + intercept;
    ssTotal += (point.y - yMean) ** 2;
    ssResidual += (point.y - predicted) ** 2;
  }

  const r2 = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal;

  return {
    slope,
    intercept,
    r2: Math.max(0, Math.min(1, r2)), // Clamp between 0 and 1
    predict: (x: number) => slope * x + intercept
  };
}

/**
 * Calculate standard deviation
 */
function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => (val - mean) ** 2);
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Main prediction function combining multiple methods
 */
export function predictPrices(
  priceHistory: PriceDataPoint[],
  daysAhead: number
): PricePrediction[] {
  if (priceHistory.length === 0) return [];

  // Sort by date
  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const prices = sortedHistory.map(p => p.price);
  const lastDate = new Date(sortedHistory[sortedHistory.length - 1].date);

  // Prepare data for linear regression
  const regressionData = sortedHistory.map((point, index) => ({
    x: index,
    y: point.price
  }));

  const model = linearRegression(regressionData);

  // Calculate EMA for short-term prediction
  const alpha = 0.3; // Smoothing factor
  const emaValue = exponentialMovingAverage(prices, alpha);

  // Calculate historical volatility for confidence bands
  const priceReturns = [];
  for (let i = 1; i < prices.length; i++) {
    priceReturns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const volatility = standardDeviation(priceReturns);

  // Generate predictions
  const predictions: PricePrediction[] = [];
  const lastIndex = sortedHistory.length - 1;

  for (let day = 1; day <= daysAhead; day++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + day);

    // Combine trend (linear regression) and level (EMA)
    // Give more weight to EMA for near-term, more to trend for far-term
    const trendWeight = Math.min(day / daysAhead, 0.7);
    const emaWeight = 1 - trendWeight;

    const trendPrediction = model.predict(lastIndex + day);
    const emaPrediction = emaValue; // EMA stays flat for future

    const predictedPrice = trendWeight * trendPrediction + emaWeight * emaPrediction;

    // Calculate confidence (decreases with distance into future)
    const baseConfidence = model.r2;
    const timeDecay = Math.exp(-day / (daysAhead * 0.5));
    const confidence = baseConfidence * timeDecay;

    // Calculate confidence bands based on volatility
    const lastPrice = prices[prices.length - 1];
    const cumulativeVolatility = volatility * Math.sqrt(day);
    const bandWidth = lastPrice * cumulativeVolatility * 1.96; // 95% confidence

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      predictedPrice: Math.max(0, predictedPrice),
      confidence: Math.round(confidence * 100) / 100,
      lowerBound: Math.max(0, predictedPrice - bandWidth),
      upperBound: predictedPrice + bandWidth
    });
  }

  return predictions;
}

/**
 * Calculate prediction accuracy metrics
 */
export function calculateAccuracy(
  actual: number[],
  predicted: number[]
): {
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  mae: number;  // Mean Absolute Error
} {
  if (actual.length === 0 || actual.length !== predicted.length) {
    return { mape: 100, rmse: 0, mae: 0 };
  }

  let sumSquaredError = 0;
  let sumAbsoluteError = 0;
  let sumPercentageError = 0;
  let validCount = 0;

  for (let i = 0; i < actual.length; i++) {
    const error = actual[i] - predicted[i];
    sumSquaredError += error ** 2;
    sumAbsoluteError += Math.abs(error);

    if (actual[i] !== 0) {
      sumPercentageError += Math.abs(error / actual[i]) * 100;
      validCount++;
    }
  }

  const n = actual.length;
  const rmse = Math.sqrt(sumSquaredError / n);
  const mae = sumAbsoluteError / n;
  const mape = validCount > 0 ? sumPercentageError / validCount : 100;

  return {
    mape: Math.round(mape * 100) / 100,
    rmse: Math.round(rmse * 100) / 100,
    mae: Math.round(mae * 100) / 100
  };
}

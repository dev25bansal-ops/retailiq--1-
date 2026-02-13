/**
 * ML Forecasting Functions Tests
 */

import {
  simpleMovingAverage,
  exponentialMovingAverage,
  linearRegression,
  exponentialSmoothing,
  predictPrices,
  calculateAccuracy,
  type PriceDataPoint,
  type LinearRegressionModel
} from '../../src/ml/forecasting';

describe('ML Forecasting Functions', () => {
  describe('simpleMovingAverage', () => {
    test('should calculate correct average with known array of prices', () => {
      const prices = [100, 110, 105, 115, 120];
      const window = 3;
      const result = simpleMovingAverage(prices, window);

      // Average of last 3 prices: (105 + 115 + 120) / 3 = 113.33
      expect(result).toBeCloseTo(113.33, 2);
    });

    test('should handle window size larger than array length', () => {
      const prices = [100, 110, 105];
      const window = 5;
      const result = simpleMovingAverage(prices, window);

      // Should use all available prices: (100 + 110 + 105) / 3 = 105
      expect(result).toBeCloseTo(105, 2);
    });

    test('should calculate correct average with window of 1', () => {
      const prices = [100, 110, 105, 115, 120];
      const window = 1;
      const result = simpleMovingAverage(prices, window);

      // Average of last 1 price: 120
      expect(result).toBe(120);
    });

    test('should handle single price', () => {
      const prices = [100];
      const window = 3;
      const result = simpleMovingAverage(prices, window);

      expect(result).toBe(100);
    });

    test('should calculate average for full array', () => {
      const prices = [100, 200, 300, 400, 500];
      const window = 5;
      const result = simpleMovingAverage(prices, window);

      // (100 + 200 + 300 + 400 + 500) / 5 = 300
      expect(result).toBe(300);
    });

    test('should handle empty array gracefully', () => {
      const prices: number[] = [];
      const window = 3;
      const result = simpleMovingAverage(prices, window);

      expect(isNaN(result)).toBe(true);
    });
  });

  describe('exponentialMovingAverage', () => {
    test('should return a number', () => {
      const prices = [100, 110, 105, 115, 120];
      const alpha = 0.3;
      const result = exponentialMovingAverage(prices, alpha);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('should calculate EMA with standard alpha', () => {
      const prices = [100, 110, 120];
      const alpha = 0.3;
      const result = exponentialMovingAverage(prices, alpha);

      // EMA calculation:
      // EMA[0] = 100
      // EMA[1] = 0.3 * 110 + 0.7 * 100 = 33 + 70 = 103
      // EMA[2] = 0.3 * 120 + 0.7 * 103 = 36 + 72.1 = 108.1
      expect(result).toBeCloseTo(108.1, 1);
    });

    test('should return first price for single element array', () => {
      const prices = [150];
      const alpha = 0.3;
      const result = exponentialMovingAverage(prices, alpha);

      expect(result).toBe(150);
    });

    test('should handle alpha = 1 (gives last price)', () => {
      const prices = [100, 110, 120, 130];
      const alpha = 1;
      const result = exponentialMovingAverage(prices, alpha);

      expect(result).toBe(130);
    });

    test('should handle alpha = 0 (gives first price)', () => {
      const prices = [100, 110, 120, 130];
      const alpha = 0;
      const result = exponentialMovingAverage(prices, alpha);

      expect(result).toBe(100);
    });

    test('should return 0 for empty array', () => {
      const prices: number[] = [];
      const alpha = 0.3;
      const result = exponentialMovingAverage(prices, alpha);

      expect(result).toBe(0);
    });

    test('should calculate EMA with different alpha values', () => {
      const prices = [100, 110, 120, 130, 140];

      const emaLowAlpha = exponentialMovingAverage(prices, 0.1);
      const emaHighAlpha = exponentialMovingAverage(prices, 0.9);

      // Higher alpha should give more weight to recent prices
      expect(emaHighAlpha).toBeGreaterThan(emaLowAlpha);
    });
  });

  describe('linearRegression', () => {
    test('should return slope, intercept, r2, and predict function', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 }
      ];
      const model = linearRegression(data);

      expect(model).toHaveProperty('slope');
      expect(model).toHaveProperty('intercept');
      expect(model).toHaveProperty('r2');
      expect(model).toHaveProperty('predict');
      expect(typeof model.predict).toBe('function');
    });

    test('should calculate correct linear regression for perfect line', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 }
      ];
      const model = linearRegression(data);

      // For y = 2x, slope should be 2, intercept should be 0
      expect(model.slope).toBeCloseTo(2, 5);
      expect(model.intercept).toBeCloseTo(0, 5);
      expect(model.r2).toBeCloseTo(1, 5); // Perfect fit
    });

    test('should predict future values correctly', () => {
      const data = [
        { x: 0, y: 0 },
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 30 }
      ];
      const model = linearRegression(data);

      // Should predict y = 10x
      expect(model.predict(4)).toBeCloseTo(40, 1);
      expect(model.predict(5)).toBeCloseTo(50, 1);
    });

    test('should handle data with intercept', () => {
      const data = [
        { x: 0, y: 5 },
        { x: 1, y: 8 },
        { x: 2, y: 11 },
        { x: 3, y: 14 }
      ];
      const model = linearRegression(data);

      // y = 3x + 5
      expect(model.slope).toBeCloseTo(3, 5);
      expect(model.intercept).toBeCloseTo(5, 5);
      expect(model.r2).toBeCloseTo(1, 5);
    });

    test('should handle empty data', () => {
      const data: { x: number; y: number }[] = [];
      const model = linearRegression(data);

      expect(model.slope).toBe(0);
      expect(model.intercept).toBe(0);
      expect(model.r2).toBe(0);
      expect(model.predict(5)).toBe(0);
    });

    test('should calculate r2 for imperfect fit', () => {
      const data = [
        { x: 1, y: 2.1 },
        { x: 2, y: 3.9 },
        { x: 3, y: 6.2 },
        { x: 4, y: 7.8 }
      ];
      const model = linearRegression(data);

      // R2 should be between 0 and 1 for imperfect fit
      expect(model.r2).toBeGreaterThan(0);
      expect(model.r2).toBeLessThanOrEqual(1);
    });

    test('should handle single data point', () => {
      const data = [{ x: 5, y: 10 }];
      const model = linearRegression(data);

      // With single point, slope should be 0 (flat line at mean)
      expect(model.slope).toBe(0);
      expect(model.r2).toBe(0);
    });

    test('should handle vertical data (same x values)', () => {
      const data = [
        { x: 5, y: 10 },
        { x: 5, y: 20 },
        { x: 5, y: 30 }
      ];
      const model = linearRegression(data);

      // Denominator is 0, slope should be 0
      expect(model.slope).toBe(0);
    });
  });

  describe('exponentialSmoothing', () => {
    test('should forecast multiple periods ahead', () => {
      const prices = [100, 110, 105, 115];
      const alpha = 0.3;
      const periods = 3;
      const forecasts = exponentialSmoothing(prices, alpha, periods);

      expect(forecasts).toHaveLength(3);
      expect(forecasts.every(f => typeof f === 'number')).toBe(true);
    });

    test('should return empty array for empty prices', () => {
      const prices: number[] = [];
      const alpha = 0.3;
      const periods = 3;
      const forecasts = exponentialSmoothing(prices, alpha, periods);

      expect(forecasts).toEqual([]);
    });
  });

  describe('predictPrices', () => {
    test('should predict future prices', () => {
      const priceHistory: PriceDataPoint[] = [
        { date: '2024-01-01', price: 1000 },
        { date: '2024-01-02', price: 1050 },
        { date: '2024-01-03', price: 1100 },
        { date: '2024-01-04', price: 1150 },
        { date: '2024-01-05', price: 1200 }
      ];
      const daysAhead = 3;
      const predictions = predictPrices(priceHistory, daysAhead);

      expect(predictions).toHaveLength(3);
      expect(predictions[0]).toHaveProperty('date');
      expect(predictions[0]).toHaveProperty('predictedPrice');
      expect(predictions[0]).toHaveProperty('confidence');
      expect(predictions[0]).toHaveProperty('lowerBound');
      expect(predictions[0]).toHaveProperty('upperBound');
    });

    test('should return empty array for no history', () => {
      const priceHistory: PriceDataPoint[] = [];
      const predictions = predictPrices(priceHistory, 3);

      expect(predictions).toEqual([]);
    });

    test('should ensure predicted prices are non-negative', () => {
      const priceHistory: PriceDataPoint[] = [
        { date: '2024-01-01', price: 100 },
        { date: '2024-01-02', price: 90 },
        { date: '2024-01-03', price: 80 }
      ];
      const predictions = predictPrices(priceHistory, 2);

      predictions.forEach(pred => {
        expect(pred.predictedPrice).toBeGreaterThanOrEqual(0);
        expect(pred.lowerBound).toBeGreaterThanOrEqual(0);
      });
    });

    test('should have decreasing confidence for future predictions', () => {
      const priceHistory: PriceDataPoint[] = [
        { date: '2024-01-01', price: 1000 },
        { date: '2024-01-02', price: 1050 },
        { date: '2024-01-03', price: 1100 },
        { date: '2024-01-04', price: 1150 }
      ];
      const predictions = predictPrices(priceHistory, 5);

      // Confidence should generally decrease over time
      for (let i = 1; i < predictions.length; i++) {
        expect(predictions[i].confidence).toBeLessThanOrEqual(predictions[i - 1].confidence);
      }
    });
  });

  describe('calculateAccuracy', () => {
    test('should calculate MAPE, RMSE, and MAE', () => {
      const actual = [100, 110, 120, 130, 140];
      const predicted = [98, 112, 118, 132, 138];
      const accuracy = calculateAccuracy(actual, predicted);

      expect(accuracy).toHaveProperty('mape');
      expect(accuracy).toHaveProperty('rmse');
      expect(accuracy).toHaveProperty('mae');
      expect(accuracy.mape).toBeGreaterThan(0);
      expect(accuracy.rmse).toBeGreaterThan(0);
      expect(accuracy.mae).toBeGreaterThan(0);
    });

    test('should return perfect accuracy for identical arrays', () => {
      const actual = [100, 110, 120];
      const predicted = [100, 110, 120];
      const accuracy = calculateAccuracy(actual, predicted);

      expect(accuracy.mape).toBe(0);
      expect(accuracy.rmse).toBe(0);
      expect(accuracy.mae).toBe(0);
    });

    test('should handle empty arrays', () => {
      const actual: number[] = [];
      const predicted: number[] = [];
      const accuracy = calculateAccuracy(actual, predicted);

      expect(accuracy.mape).toBe(100);
    });

    test('should handle mismatched array lengths', () => {
      const actual = [100, 110, 120];
      const predicted = [100, 110];
      const accuracy = calculateAccuracy(actual, predicted);

      expect(accuracy.mape).toBe(100);
    });
  });
});

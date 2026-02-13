import apiClient from './client';
import type { PricePrediction, BuyRecommendation, ProductCategory, ApiResponse } from '../types';

export interface PredictionParams {
  days?: number;
  confidence?: number;
}

export interface DemandForecast {
  category: ProductCategory;
  currentDemand: number;
  predictedDemand: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface SeasonalPattern {
  month: string;
  avgPrice: number;
  avgDiscount: number;
  demandLevel: 'low' | 'medium' | 'high';
}

export interface PriceInsight {
  productId: string;
  currentPrice: number;
  historicalAvg: number;
  lowestPrice: number;
  highestPrice: number;
  isGoodDeal: boolean;
  savingsVsAvg: number;
  pricePosition: 'low' | 'average' | 'high';
}

// Get product price predictions
export const getProductPredictions = async (
  id: string,
  params?: PredictionParams
): Promise<ApiResponse<PricePrediction[]>> => {
  const response = await apiClient.get(`/predictions/products/${id}`, { params });
  return response.data;
};

// Get best time to buy
export const getBestTimeToBuy = async (
  id: string
): Promise<ApiResponse<{ date: string; price: number; reasoning: string; confidence: number }>> => {
  const response = await apiClient.get(`/predictions/products/${id}/best-time`);
  return response.data;
};

// Get buy or wait recommendation
export const getBuyOrWait = async (id: string): Promise<ApiResponse<BuyRecommendation>> => {
  const response = await apiClient.get(`/predictions/products/${id}/recommendation`);
  return response.data;
};

// Get demand forecast by category
export const getDemandForecast = async (category: ProductCategory): Promise<ApiResponse<DemandForecast>> => {
  const response = await apiClient.get(`/predictions/demand/${category}`);
  return response.data;
};

// Get seasonal patterns
export const getSeasonalPatterns = async (
  productId: string
): Promise<ApiResponse<SeasonalPattern[]>> => {
  const response = await apiClient.get(`/predictions/products/${productId}/seasonal`);
  return response.data;
};

// Get price insights
export const getPriceInsights = async (productId: string): Promise<ApiResponse<PriceInsight>> => {
  const response = await apiClient.get(`/predictions/products/${productId}/insights`);
  return response.data;
};

// Get category predictions
export const getCategoryPredictions = async (
  category: ProductCategory
): Promise<ApiResponse<{ avgPrice: number; trend: string; predictions: PricePrediction[] }>> => {
  const response = await apiClient.get(`/predictions/categories/${category}`);
  return response.data;
};

// Get festival impact predictions
export const getFestivalImpact = async (
  festivalId: string
): Promise<
  ApiResponse<{
    festivalName: string;
    expectedDiscount: number;
    affectedCategories: ProductCategory[];
    startDate: string;
    confidence: number;
  }>
> => {
  const response = await apiClient.get(`/predictions/festivals/${festivalId}/impact`);
  return response.data;
};

// Get price drop probability
export const getPriceDropProbability = async (
  productId: string,
  days?: number
): Promise<ApiResponse<{ probability: number; expectedDrop: number; timeframe: string }>> => {
  const response = await apiClient.get(`/predictions/products/${productId}/drop-probability`, {
    params: { days },
  });
  return response.data;
};

// Get market trends
export const getMarketTrends = async (): Promise<
  ApiResponse<{
    trending: { category: ProductCategory; growth: number }[];
    declining: { category: ProductCategory; decline: number }[];
    stable: ProductCategory[];
  }>
> => {
  const response = await apiClient.get('/predictions/market-trends');
  return response.data;
};

export const predictionsApi = {
  getProductPredictions,
  getBestTimeToBuy,
  getBuyOrWait,
  getDemandForecast,
  getSeasonalPatterns,
  getPriceInsights,
  getCategoryPredictions,
  getFestivalImpact,
  getPriceDropProbability,
  getMarketTrends,
};

export default predictionsApi;

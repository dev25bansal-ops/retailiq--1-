import apiClient from './client';
import type { AnalyticsEvent, DashboardMetric, ApiResponse } from '../types';

export interface TrackEventData {
  type: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  charts: {
    priceDrops: Array<{ date: string; count: number }>;
    savingsOverTime: Array<{ date: string; savings: number }>;
    categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
    platformUsage: Array<{ platform: string; count: number; percentage: number }>;
  };
  insights: Array<{
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning';
    action?: { label: string; url: string };
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'excel';
  startDate?: string;
  endDate?: string;
  type?: 'products' | 'alerts' | 'transactions' | 'analytics';
}

// Track analytics event
export const trackEvent = async (
  type: string,
  properties?: Record<string, any>
): Promise<ApiResponse<{ tracked: boolean }>> => {
  const response = await apiClient.post('/analytics/events', {
    type,
    properties,
    timestamp: new Date().toISOString(),
  });
  return response.data;
};

// Get dashboard analytics
export const getDashboard = async (dateRange?: {
  startDate?: string;
  endDate?: string;
  period?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all';
}): Promise<ApiResponse<DashboardData>> => {
  const response = await apiClient.get('/analytics/dashboard', { params: dateRange });
  return response.data;
};

// Get user activity
export const getUserActivity = async (params?: {
  startDate?: string;
  endDate?: string;
  type?: string;
}): Promise<ApiResponse<AnalyticsEvent[]>> => {
  const response = await apiClient.get('/analytics/activity', { params });
  return response.data;
};

// Get product views
export const getProductViews = async (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<
  ApiResponse<
    Array<{
      productId: string;
      productName: string;
      views: number;
      uniqueViews: number;
    }>
  >
> => {
  const response = await apiClient.get('/analytics/product-views', { params });
  return response.data;
};

// Get search analytics
export const getSearchAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<
  ApiResponse<{
    topSearches: Array<{ query: string; count: number }>;
    zeroResultSearches: Array<{ query: string; count: number }>;
    avgResultsPerSearch: number;
  }>
> => {
  const response = await apiClient.get('/analytics/searches', { params });
  return response.data;
};

// Get savings analytics
export const getSavingsAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<
  ApiResponse<{
    totalSavings: number;
    savingsByCategory: Array<{ category: string; savings: number }>;
    savingsByPlatform: Array<{ platform: string; savings: number }>;
    avgSavingsPerProduct: number;
    topSavingProducts: Array<{
      productId: string;
      productName: string;
      oldPrice: number;
      newPrice: number;
      savings: number;
    }>;
  }>
> => {
  const response = await apiClient.get('/analytics/savings', { params });
  return response.data;
};

// Get alert analytics
export const getAlertAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<
  ApiResponse<{
    totalAlerts: number;
    alertsByType: Array<{ type: string; count: number }>;
    readRate: number;
    avgResponseTime: number;
  }>
> => {
  const response = await apiClient.get('/analytics/alerts', { params });
  return response.data;
};

// Get conversion analytics
export const getConversionAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<
  ApiResponse<{
    clickThroughRate: number;
    conversionRate: number;
    totalClicks: number;
    totalConversions: number;
    revenueGenerated: number;
  }>
> => {
  const response = await apiClient.get('/analytics/conversions', { params });
  return response.data;
};

// Get retention analytics
export const getRetentionAnalytics = async (): Promise<
  ApiResponse<{
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    retentionRate: Array<{ day: number; rate: number }>;
    churnRate: number;
  }>
> => {
  const response = await apiClient.get('/analytics/retention');
  return response.data;
};

// Get funnel analytics
export const getFunnelAnalytics = async (
  funnel: 'signup' | 'product_view' | 'watchlist' | 'purchase'
): Promise<
  ApiResponse<{
    steps: Array<{
      name: string;
      users: number;
      dropoffRate: number;
    }>;
    conversionRate: number;
  }>
> => {
  const response = await apiClient.get(`/analytics/funnels/${funnel}`);
  return response.data;
};

// Get performance metrics
export const getPerformanceMetrics = async (): Promise<
  ApiResponse<{
    avgPageLoadTime: number;
    avgApiResponseTime: number;
    errorRate: number;
    uptime: number;
  }>
> => {
  const response = await apiClient.get('/analytics/performance');
  return response.data;
};

// Export data
export const exportData = async (options: ExportOptions): Promise<Blob> => {
  const response = await apiClient.post(
    '/analytics/export',
    {
      format: options.format,
      startDate: options.startDate,
      endDate: options.endDate,
      type: options.type,
    },
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

// Get real-time stats
export const getRealTimeStats = async (): Promise<
  ApiResponse<{
    activeUsers: number;
    ongoingSearches: number;
    recentAlerts: number;
    systemLoad: number;
  }>
> => {
  const response = await apiClient.get('/analytics/realtime');
  return response.data;
};

// Get heatmap data
export const getHeatmapData = async (page: string): Promise<
  ApiResponse<{
    clicks: Array<{ x: number; y: number; count: number }>;
    scrollDepth: Array<{ depth: number; percentage: number }>;
  }>
> => {
  const response = await apiClient.get('/analytics/heatmap', { params: { page } });
  return response.data;
};

export const analyticsApi = {
  trackEvent,
  getDashboard,
  getUserActivity,
  getProductViews,
  getSearchAnalytics,
  getSavingsAnalytics,
  getAlertAnalytics,
  getConversionAnalytics,
  getRetentionAnalytics,
  getFunnelAnalytics,
  getPerformanceMetrics,
  exportData,
  getRealTimeStats,
  getHeatmapData,
};

export default analyticsApi;

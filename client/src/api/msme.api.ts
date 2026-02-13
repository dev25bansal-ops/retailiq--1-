import apiClient from './client';
import type {
  InventoryItem,
  RepricingRule,
  GSTInfo,
  Competitor,
  MarketOpportunity,
  MarketThreat,
  ApiResponse,
} from '../types';

// ============ Inventory Management ============

export interface CreateInventoryData {
  productId: string;
  sku: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  warehouse?: string;
}

// Get inventory
export const getInventory = async (filters?: {
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  category?: string;
  warehouse?: string;
}): Promise<ApiResponse<InventoryItem[]>> => {
  const response = await apiClient.get('/msme/inventory', { params: filters });
  return response.data;
};

// Get single inventory item
export const getInventoryItem = async (id: string): Promise<ApiResponse<InventoryItem>> => {
  const response = await apiClient.get(`/msme/inventory/${id}`);
  return response.data;
};

// Add inventory item
export const addInventoryItem = async (data: CreateInventoryData): Promise<ApiResponse<InventoryItem>> => {
  const response = await apiClient.post('/msme/inventory', data);
  return response.data;
};

// Update inventory item
export const updateInventoryItem = async (
  id: string,
  data: Partial<CreateInventoryData>
): Promise<ApiResponse<InventoryItem>> => {
  const response = await apiClient.patch(`/msme/inventory/${id}`, data);
  return response.data;
};

// Delete inventory item
export const deleteInventoryItem = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/msme/inventory/${id}`);
  return response.data;
};

// Restock item
export const restockItem = async (
  id: string,
  quantity: number
): Promise<ApiResponse<InventoryItem>> => {
  const response = await apiClient.post(`/msme/inventory/${id}/restock`, { quantity });
  return response.data;
};

// Get inventory stats
export const getInventoryStats = async (): Promise<
  ApiResponse<{
    totalItems: number;
    totalValue: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    reorderAlerts: number;
  }>
> => {
  const response = await apiClient.get('/msme/inventory/stats');
  return response.data;
};

// Bulk update inventory
export const bulkUpdateInventory = async (
  updates: Array<{ id: string; quantity: number }>
): Promise<ApiResponse<{ updated: number }>> => {
  const response = await apiClient.post('/msme/inventory/bulk-update', { updates });
  return response.data;
};

// ============ Auto-Repricing ============

export interface CreateRepricingRuleData {
  productId: string;
  strategy: 'match_lowest' | 'undercut_by_percent' | 'fixed_margin' | 'dynamic';
  parameters: {
    targetMargin?: number;
    undercutPercent?: number;
    minPrice: number;
    maxPrice: number;
    competitorIds?: string[];
  };
  enabled?: boolean;
}

// Get repricing rules
export const getRepricingRules = async (): Promise<ApiResponse<RepricingRule[]>> => {
  const response = await apiClient.get('/msme/repricing/rules');
  return response.data;
};

// Get single repricing rule
export const getRepricingRule = async (id: string): Promise<ApiResponse<RepricingRule>> => {
  const response = await apiClient.get(`/msme/repricing/rules/${id}`);
  return response.data;
};

// Create repricing rule
export const createRepricingRule = async (
  data: CreateRepricingRuleData
): Promise<ApiResponse<RepricingRule>> => {
  const response = await apiClient.post('/msme/repricing/rules', data);
  return response.data;
};

// Update repricing rule
export const updateRepricingRule = async (
  id: string,
  data: Partial<CreateRepricingRuleData>
): Promise<ApiResponse<RepricingRule>> => {
  const response = await apiClient.patch(`/msme/repricing/rules/${id}`, data);
  return response.data;
};

// Delete repricing rule
export const deleteRepricingRule = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/msme/repricing/rules/${id}`);
  return response.data;
};

// Execute repricing (manual trigger)
export const executeRepricing = async (): Promise<
  ApiResponse<{ executed: number; updated: number; errors: number }>
> => {
  const response = await apiClient.post('/msme/repricing/execute');
  return response.data;
};

// Get repricing history
export const getRepricingHistory = async (
  productId?: string
): Promise<
  ApiResponse<
    Array<{
      id: string;
      productId: string;
      oldPrice: number;
      newPrice: number;
      reason: string;
      executedAt: string;
    }>
  >
> => {
  const response = await apiClient.get('/msme/repricing/history', { params: { productId } });
  return response.data;
};

// ============ GST Insights ============

export interface CalculateGSTData {
  amount: number;
  hsnCode?: string;
  gstRate?: number;
  includesGST?: boolean;
}

// Calculate GST
export const calculateGST = async (
  data: CalculateGSTData
): Promise<
  ApiResponse<{
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    gstRate: number;
  }>
> => {
  const response = await apiClient.post('/msme/gst/calculate', data);
  return response.data;
};

// Get GST rates
export const getGSTRates = async (): Promise<
  ApiResponse<Array<{ hsnCode: string; description: string; gstRate: number }>>
> => {
  const response = await apiClient.get('/msme/gst/rates');
  return response.data;
};

// Get GST info by HSN
export const getGSTByHSN = async (hsnCode: string): Promise<ApiResponse<GSTInfo>> => {
  const response = await apiClient.get(`/msme/gst/hsn/${hsnCode}`);
  return response.data;
};

// Generate GST report
export const generateGSTReport = async (params: {
  startDate: string;
  endDate: string;
  format?: 'pdf' | 'csv';
}): Promise<ApiResponse<{ reportUrl: string }>> => {
  const response = await apiClient.post('/msme/gst/report', params);
  return response.data;
};

// ============ Competitive Intelligence ============

// Get competitors
export const getCompetitors = async (filters?: {
  category?: string;
  platform?: string;
}): Promise<ApiResponse<Competitor[]>> => {
  const response = await apiClient.get('/msme/competitive/competitors', { params: filters });
  return response.data;
};

// Add competitor
export const addCompetitor = async (data: {
  name: string;
  platform: string;
  productUrl: string;
}): Promise<ApiResponse<Competitor>> => {
  const response = await apiClient.post('/msme/competitive/competitors', data);
  return response.data;
};

// Remove competitor
export const removeCompetitor = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/msme/competitive/competitors/${id}`);
  return response.data;
};

// Get market opportunities
export const getMarketOpportunities = async (): Promise<ApiResponse<MarketOpportunity[]>> => {
  const response = await apiClient.get('/msme/competitive/opportunities');
  return response.data;
};

// Get market threats
export const getMarketThreats = async (): Promise<ApiResponse<MarketThreat[]>> => {
  const response = await apiClient.get('/msme/competitive/threats');
  return response.data;
};

// Get competitor analysis
export const getCompetitorAnalysis = async (
  competitorId: string
): Promise<
  ApiResponse<{
    competitor: Competitor;
    priceComparison: Array<{ productName: string; myPrice: number; theirPrice: number; difference: number }>;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }>
> => {
  const response = await apiClient.get(`/msme/competitive/competitors/${competitorId}/analysis`);
  return response.data;
};

// ============ WhatsApp Integration ============

export interface WhatsAppConfig {
  phoneNumber: string;
  apiKey?: string;
  enableAlerts: boolean;
  alertTypes: Array<'price_change' | 'low_stock' | 'new_order' | 'competitor_update'>;
}

// Connect WhatsApp
export const connectWhatsApp = async (phone: string): Promise<ApiResponse<{ qrCode: string; status: string }>> => {
  const response = await apiClient.post('/msme/whatsapp/connect', { phoneNumber: phone });
  return response.data;
};

// Disconnect WhatsApp
export const disconnectWhatsApp = async (): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/msme/whatsapp/disconnect');
  return response.data;
};

// Get WhatsApp status
export const getWhatsAppStatus = async (): Promise<
  ApiResponse<{ connected: boolean; phoneNumber?: string; lastSync?: string }>
> => {
  const response = await apiClient.get('/msme/whatsapp/status');
  return response.data;
};

// Update WhatsApp alerts config
export const updateWhatsAppAlerts = async (
  config: Partial<WhatsAppConfig>
): Promise<ApiResponse<WhatsAppConfig>> => {
  const response = await apiClient.patch('/msme/whatsapp/alerts', config);
  return response.data;
};

// Send test WhatsApp message
export const sendTestWhatsAppMessage = async (): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/msme/whatsapp/test');
  return response.data;
};

export const msmeApi = {
  // Inventory
  getInventory,
  getInventoryItem,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  restockItem,
  getInventoryStats,
  bulkUpdateInventory,

  // Repricing
  getRepricingRules,
  getRepricingRule,
  createRepricingRule,
  updateRepricingRule,
  deleteRepricingRule,
  executeRepricing,
  getRepricingHistory,

  // GST
  calculateGST,
  getGSTRates,
  getGSTByHSN,
  generateGSTReport,

  // Competitive
  getCompetitors,
  addCompetitor,
  removeCompetitor,
  getMarketOpportunities,
  getMarketThreats,
  getCompetitorAnalysis,

  // WhatsApp
  connectWhatsApp,
  disconnectWhatsApp,
  getWhatsAppStatus,
  updateWhatsAppAlerts,
  sendTestWhatsAppMessage,
};

export default msmeApi;

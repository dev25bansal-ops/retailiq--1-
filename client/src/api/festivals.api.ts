import apiClient from './client';
import type { Festival, ProductCategory, Platform, ApiResponse } from '../types';

export interface FestivalFilters {
  platform?: Platform | 'all';
  category?: ProductCategory;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export interface FestivalReminder {
  id: string;
  festivalId: string;
  userId: string;
  reminderDate: string;
  channels: ('email' | 'push' | 'sms' | 'whatsapp')[];
  createdAt: string;
}

// Get all festivals
export const getFestivals = async (filters?: FestivalFilters): Promise<ApiResponse<Festival[]>> => {
  const response = await apiClient.get('/festivals', { params: filters });
  return response.data;
};

// Get upcoming festivals
export const getUpcoming = async (days: number = 30): Promise<ApiResponse<Festival[]>> => {
  const response = await apiClient.get('/festivals/upcoming', { params: { days } });
  return response.data;
};

// Get active festivals
export const getActive = async (): Promise<ApiResponse<Festival[]>> => {
  const response = await apiClient.get('/festivals/active');
  return response.data;
};

// Get single festival
export const getFestival = async (id: string): Promise<ApiResponse<Festival>> => {
  const response = await apiClient.get(`/festivals/${id}`);
  return response.data;
};

// Get festival by platform
export const getFestivalsByPlatform = async (platform: Platform): Promise<ApiResponse<Festival[]>> => {
  const response = await apiClient.get(`/festivals/platform/${platform}`);
  return response.data;
};

// Get festival history
export const getFestivalHistory = async (festivalName: string): Promise<
  ApiResponse<{
    name: string;
    editions: Array<{
      year: number;
      startDate: string;
      endDate: string;
      avgDiscount: number;
      topCategories: ProductCategory[];
    }>;
  }>
> => {
  const response = await apiClient.get(`/festivals/history/${festivalName}`);
  return response.data;
};

// Set festival reminder
export const setReminder = async (
  festivalId: string,
  data: {
    reminderDate: string;
    channels: ('email' | 'push' | 'sms' | 'whatsapp')[];
  }
): Promise<ApiResponse<FestivalReminder>> => {
  const response = await apiClient.post(`/festivals/${festivalId}/reminder`, data);
  return response.data;
};

// Cancel festival reminder
export const cancelReminder = async (festivalId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/festivals/${festivalId}/reminder`);
  return response.data;
};

// Get reminders
export const getReminders = async (): Promise<ApiResponse<FestivalReminder[]>> => {
  const response = await apiClient.get('/festivals/reminders');
  return response.data;
};

// Get festival deals
export const getFestivalDeals = async (festivalId: string): Promise<
  ApiResponse<{
    festival: Festival;
    deals: Array<{
      category: ProductCategory;
      avgDiscount: number;
      topProducts: any[];
    }>;
  }>
> => {
  const response = await apiClient.get(`/festivals/${festivalId}/deals`);
  return response.data;
};

// Compare festivals
export const compareFestivals = async (
  festivalIds: string[]
): Promise<
  ApiResponse<{
    festivals: Festival[];
    comparison: {
      bestOverallDiscount: { festivalId: string; discount: number };
      bestByCategory: Record<ProductCategory, { festivalId: string; discount: number }>;
    };
  }>
> => {
  const response = await apiClient.post('/festivals/compare', { festivalIds });
  return response.data;
};

export const festivalsApi = {
  getFestivals,
  getUpcoming,
  getActive,
  getFestival,
  getFestivalsByPlatform,
  getFestivalHistory,
  setReminder,
  cancelReminder,
  getReminders,
  getFestivalDeals,
  compareFestivals,
};

export default festivalsApi;

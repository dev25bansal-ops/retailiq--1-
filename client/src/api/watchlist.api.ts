import apiClient from './client';
import type { Product, ApiResponse } from '../types';

export interface WatchlistItem {
  id: string;
  product: Product;
  targetPrice?: number;
  addedAt: string;
  priceAlert: boolean;
  stockAlert: boolean;
}

export interface AddToWatchlistData {
  productId: string;
  targetPrice?: number;
  priceAlert?: boolean;
  stockAlert?: boolean;
}

// Get user's watchlist
export const getWatchlist = async (): Promise<ApiResponse<WatchlistItem[]>> => {
  const response = await apiClient.get('/watchlist');
  return response.data;
};

// Add product to watchlist
export const addToWatchlist = async (
  productId: string,
  targetPrice?: number,
  options?: { priceAlert?: boolean; stockAlert?: boolean }
): Promise<ApiResponse<WatchlistItem>> => {
  const response = await apiClient.post('/watchlist', {
    productId,
    targetPrice,
    priceAlert: options?.priceAlert ?? true,
    stockAlert: options?.stockAlert ?? true,
  });
  return response.data;
};

// Remove product from watchlist
export const removeFromWatchlist = async (productId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/watchlist/${productId}`);
  return response.data;
};

// Update watchlist item
export const updateWatchlistItem = async (
  productId: string,
  data: Partial<AddToWatchlistData>
): Promise<ApiResponse<WatchlistItem>> => {
  const response = await apiClient.patch(`/watchlist/${productId}`, data);
  return response.data;
};

// Check if product is in watchlist
export const isInWatchlist = async (productId: string): Promise<ApiResponse<{ inWatchlist: boolean }>> => {
  const response = await apiClient.get(`/watchlist/check/${productId}`);
  return response.data;
};

// Get watchlist stats
export const getWatchlistStats = async (): Promise<
  ApiResponse<{
    totalItems: number;
    totalSavings: number;
    priceDrops: number;
    backInStock: number;
  }>
> => {
  const response = await apiClient.get('/watchlist/stats');
  return response.data;
};

// Clear watchlist
export const clearWatchlist = async (): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete('/watchlist/clear');
  return response.data;
};

export const watchlistApi = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
  isInWatchlist,
  getWatchlistStats,
  clearWatchlist,
};

export default watchlistApi;

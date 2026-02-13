import apiClient from './client';
import type { Product, PriceRecord, ProductCategory, Platform, ApiResponse } from '../types';

export interface ProductFilters {
  category?: ProductCategory | 'all';
  platform?: Platform | 'all';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: 'in_stock' | 'out_of_stock' | 'limited' | 'all';
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'discount' | 'popularity';
  page?: number;
  limit?: number;
}

export interface PriceHistoryParams {
  startDate?: string;
  endDate?: string;
  platform?: Platform;
  interval?: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface CompareProductsResponse {
  products: Product[];
  comparison: {
    lowestPrice: { productId: string; price: number; platform: Platform };
    highestRating: { productId: string; rating: number };
    bestDeal: { productId: string; discount: number };
  };
}

// Get all products with filters
export const getProducts = async (params?: ProductFilters): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

// Get single product
export const getProduct = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

// Get product prices across platforms
export const getProductPrices = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await apiClient.get(`/products/${id}/prices`);
  return response.data;
};

// Get product price history
export const getProductHistory = async (
  id: string,
  params?: PriceHistoryParams
): Promise<ApiResponse<PriceRecord[]>> => {
  const response = await apiClient.get(`/products/${id}/history`, { params });
  return response.data;
};

// Get trending products
export const getTrending = async (limit: number = 10): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products/trending', { params: { limit } });
  return response.data;
};

// Search products
export const searchProducts = async (query: string, filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products/search', {
    params: { q: query, ...filters },
  });
  return response.data;
};

// Compare multiple products
export const compareProducts = async (ids: string[]): Promise<ApiResponse<CompareProductsResponse>> => {
  const response = await apiClient.post('/products/compare', { productIds: ids });
  return response.data;
};

// Get product recommendations
export const getRecommendations = async (
  productId?: string,
  category?: ProductCategory
): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products/recommendations', {
    params: { productId, category },
  });
  return response.data;
};

// Get products by category
export const getProductsByCategory = async (
  category: ProductCategory,
  params?: ProductFilters
): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get(`/products/category/${category}`, { params });
  return response.data;
};

// Get products by platform
export const getProductsByPlatform = async (
  platform: Platform,
  params?: ProductFilters
): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get(`/products/platform/${platform}`, { params });
  return response.data;
};

// Get product deals
export const getProductDeals = async (params?: ProductFilters): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products/deals', { params });
  return response.data;
};

// Get price drops
export const getPriceDrops = async (hours: number = 24): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products/price-drops', { params: { hours } });
  return response.data;
};

// Get back in stock products
export const getBackInStock = async (): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get('/products/back-in-stock');
  return response.data;
};

export const productsApi = {
  getProducts,
  getProduct,
  getProductPrices,
  getProductHistory,
  getTrending,
  searchProducts,
  compareProducts,
  getRecommendations,
  getProductsByCategory,
  getProductsByPlatform,
  getProductDeals,
  getPriceDrops,
  getBackInStock,
};

export default productsApi;

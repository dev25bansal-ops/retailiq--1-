import apiClient from './client';
import type { Deal, Comment, ApiResponse } from '../types';

export interface DealFilters {
  category?: string;
  platform?: string;
  minDiscount?: number;
  verified?: boolean;
  sortBy?: 'newest' | 'popular' | 'expiring' | 'hot';
  page?: number;
  limit?: number;
}

export interface CreateDealData {
  title: string;
  description: string;
  productId: string;
  expiresAt?: string;
  couponCode?: string;
}

export interface VoteType {
  type: 'upvote' | 'downvote';
}

// Get all deals
export const getDeals = async (params?: DealFilters): Promise<ApiResponse<Deal[]>> => {
  const response = await apiClient.get('/deals', { params });
  return response.data;
};

// Get single deal
export const getDeal = async (id: string): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.get(`/deals/${id}`);
  return response.data;
};

// Create new deal
export const createDeal = async (data: CreateDealData): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.post('/deals', data);
  return response.data;
};

// Update deal
export const updateDeal = async (id: string, data: Partial<CreateDealData>): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.patch(`/deals/${id}`, data);
  return response.data;
};

// Delete deal
export const deleteDeal = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/deals/${id}`);
  return response.data;
};

// Vote on deal
export const voteDeal = async (id: string, type: 'upvote' | 'downvote'): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.post(`/deals/${id}/vote`, { type });
  return response.data;
};

// Remove vote
export const removeVote = async (id: string): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.delete(`/deals/${id}/vote`);
  return response.data;
};

// Get deal comments
export const getComments = async (id: string): Promise<ApiResponse<Comment[]>> => {
  const response = await apiClient.get(`/deals/${id}/comments`);
  return response.data;
};

// Add comment to deal
export const addComment = async (id: string, text: string): Promise<ApiResponse<Comment>> => {
  const response = await apiClient.post(`/deals/${id}/comments`, { text });
  return response.data;
};

// Update comment
export const updateComment = async (
  dealId: string,
  commentId: string,
  text: string
): Promise<ApiResponse<Comment>> => {
  const response = await apiClient.patch(`/deals/${dealId}/comments/${commentId}`, { text });
  return response.data;
};

// Delete comment
export const deleteComment = async (dealId: string, commentId: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/deals/${dealId}/comments/${commentId}`);
  return response.data;
};

// Vote on comment
export const voteComment = async (
  dealId: string,
  commentId: string,
  type: 'upvote' | 'downvote'
): Promise<ApiResponse<Comment>> => {
  const response = await apiClient.post(`/deals/${dealId}/comments/${commentId}/vote`, { type });
  return response.data;
};

// Get hot deals
export const getHotDeals = async (limit: number = 10): Promise<ApiResponse<Deal[]>> => {
  const response = await apiClient.get('/deals/hot', { params: { limit } });
  return response.data;
};

// Get trending deals
export const getTrendingDeals = async (limit: number = 10): Promise<ApiResponse<Deal[]>> => {
  const response = await apiClient.get('/deals/trending', { params: { limit } });
  return response.data;
};

// Get user's deals
export const getUserDeals = async (): Promise<ApiResponse<Deal[]>> => {
  const response = await apiClient.get('/deals/my-deals');
  return response.data;
};

// Report deal
export const reportDeal = async (
  id: string,
  reason: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post(`/deals/${id}/report`, { reason });
  return response.data;
};

// Verify deal (admin)
export const verifyDeal = async (id: string): Promise<ApiResponse<Deal>> => {
  const response = await apiClient.post(`/deals/${id}/verify`);
  return response.data;
};

export const dealsApi = {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  voteDeal,
  removeVote,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  voteComment,
  getHotDeals,
  getTrendingDeals,
  getUserDeals,
  reportDeal,
  verifyDeal,
};

export default dealsApi;

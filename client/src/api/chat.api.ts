import apiClient from './client';
import type { ChatMessage, Product, ApiResponse } from '../types';

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
}

export interface SendMessageData {
  sessionId?: string;
  message: string;
  context?: {
    productId?: string;
    category?: string;
    intent?: 'price_query' | 'recommendation' | 'comparison' | 'general';
  };
}

export interface AIResponse {
  message: ChatMessage;
  products?: Product[];
  suggestions?: string[];
}

// Send message to AI
export const sendMessage = async (
  message: string,
  sessionId?: string,
  context?: SendMessageData['context']
): Promise<ApiResponse<AIResponse>> => {
  const response = await apiClient.post('/chat/messages', {
    sessionId,
    message,
    context,
  });
  return response.data;
};

// Get chat sessions
export const getSessions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ChatSession[]>> => {
  const response = await apiClient.get('/chat/sessions', { params });
  return response.data;
};

// Get single session
export const getSession = async (id: string): Promise<ApiResponse<ChatSession>> => {
  const response = await apiClient.get(`/chat/sessions/${id}`);
  return response.data;
};

// Get session messages
export const getSessionMessages = async (
  id: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<ChatMessage[]>> => {
  const response = await apiClient.get(`/chat/sessions/${id}/messages`, { params });
  return response.data;
};

// Create new session
export const createSession = async (title?: string): Promise<ApiResponse<ChatSession>> => {
  const response = await apiClient.post('/chat/sessions', { title });
  return response.data;
};

// Update session
export const updateSession = async (
  id: string,
  data: { title?: string }
): Promise<ApiResponse<ChatSession>> => {
  const response = await apiClient.patch(`/chat/sessions/${id}`, data);
  return response.data;
};

// Delete session
export const deleteSession = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/chat/sessions/${id}`);
  return response.data;
};

// Clear all sessions
export const clearAllSessions = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.delete('/chat/sessions');
  return response.data;
};

// Get chat suggestions
export const getSuggestions = async (context?: {
  category?: string;
  intent?: string;
}): Promise<ApiResponse<string[]>> => {
  const response = await apiClient.get('/chat/suggestions', { params: context });
  return response.data;
};

// Get quick replies
export const getQuickReplies = async (): Promise<
  ApiResponse<
    Array<{
      text: string;
      action: string;
      icon?: string;
    }>
  >
> => {
  const response = await apiClient.get('/chat/quick-replies');
  return response.data;
};

// Rate message
export const rateMessage = async (
  messageId: string,
  rating: 1 | 2 | 3 | 4 | 5,
  feedback?: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post(`/chat/messages/${messageId}/rate`, {
    rating,
    feedback,
  });
  return response.data;
};

// Report issue with message
export const reportMessage = async (
  messageId: string,
  issue: 'incorrect' | 'inappropriate' | 'unhelpful' | 'other',
  details?: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post(`/chat/messages/${messageId}/report`, {
    issue,
    details,
  });
  return response.data;
};

// Get chat analytics
export const getChatAnalytics = async (): Promise<
  ApiResponse<{
    totalSessions: number;
    totalMessages: number;
    avgMessagesPerSession: number;
    topIntents: Array<{ intent: string; count: number }>;
    satisfactionRate: number;
  }>
> => {
  const response = await apiClient.get('/chat/analytics');
  return response.data;
};

// Search messages
export const searchMessages = async (
  query: string,
  sessionId?: string
): Promise<ApiResponse<ChatMessage[]>> => {
  const response = await apiClient.get('/chat/search', {
    params: { q: query, sessionId },
  });
  return response.data;
};

export const chatApi = {
  sendMessage,
  getSessions,
  getSession,
  getSessionMessages,
  createSession,
  updateSession,
  deleteSession,
  clearAllSessions,
  getSuggestions,
  getQuickReplies,
  rateMessage,
  reportMessage,
  getChatAnalytics,
  searchMessages,
};

export default chatApi;

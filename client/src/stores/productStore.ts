import { create } from 'zustand';
import type { Product, ProductCategory, Platform } from '../types/index';
import { productsApi, watchlistApi } from '../api';

interface ProductFilters {
  category?: ProductCategory | 'all';
  platform?: Platform | 'all';
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
}

interface ProductStore {
  products: Product[];
  watchlist: Product[];
  trending: Product[];
  searchQuery: string;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  selectedProduct: Product | null;

  // Actions
  fetchProducts: (filters?: any) => Promise<void>;
  searchProducts: (query: string, filters?: any) => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  addToWatchlist: (productId: string, targetPrice?: number) => Promise<void>;
  removeFromWatchlist: (productId: string) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  selectProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  watchlist: [],
  trending: [],
  searchQuery: '',
  filters: {
    category: 'all',
    platform: 'all',
    rating: 0,
  },
  isLoading: false,
  error: null,
  selectedProduct: null,

  // Actions
  fetchProducts: async (filters?: any) => {
    set({ isLoading: true, error: null });

    try {
      const response = await productsApi.getProducts(filters);
      set({
        products: response.data || [],
        isLoading: false,
      });

      // Fetch trending products in background
      productsApi.getTrending(10).then((res) => {
        set({ trending: res.data || [] });
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      set({
        error: errorMessage,
        isLoading: false,
        products: [],
      });
    }
  },

  searchProducts: async (query: string, filters?: any) => {
    set({ isLoading: true, error: null, searchQuery: query });

    try {
      const response = await productsApi.searchProducts(query, filters);
      set({
        products: response.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Search failed';
      set({
        error: errorMessage,
        isLoading: false,
        products: [],
      });
    }
  },

  fetchWatchlist: async () => {
    try {
      const response = await watchlistApi.getWatchlist();
      const watchlistProducts = response.data?.map((item) => item.product) || [];
      set({ watchlist: watchlistProducts });
    } catch (error: any) {
      console.error('Failed to fetch watchlist:', error);
    }
  },

  addToWatchlist: async (productId: string, targetPrice?: number) => {
    try {
      const response = await watchlistApi.addToWatchlist(productId, targetPrice);

      // Add to local watchlist
      if (response.data?.product) {
        set((state) => ({
          watchlist: [...state.watchlist, response.data.product],
        }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add to watchlist';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  removeFromWatchlist: async (productId: string) => {
    try {
      await watchlistApi.removeFromWatchlist(productId);

      // Remove from local watchlist
      set((state) => ({
        watchlist: state.watchlist.filter((p) => p.id !== productId),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove from watchlist';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    const { filters } = get();
    set({ filters: { ...filters, ...newFilters } });
  },

  clearFilters: () => {
    set({
      filters: {
        category: 'all',
        platform: 'all',
        rating: 0,
      },
      searchQuery: '',
    });
  },

  selectProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));

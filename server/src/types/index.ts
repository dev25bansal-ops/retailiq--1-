export interface Product {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  image_url: string;
  specifications: string | object;
  tags: string | string[];
  created_at: string;
  updated_at: string;
}

export interface PlatformPrice {
  id: string;
  product_id: string;
  platform: string;
  current_price: number;
  original_price: number | null;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  product_url: string | null;
  affiliate_url: string | null;
  rating: number | null;
  review_count: number | null;
  last_checked: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  platform: string;
  price: number;
  recorded_at: string;
}

export interface Festival {
  id: string;
  name: string;
  platform: string;
  start_date: string;
  end_date: string;
  expected_discount: string;
  categories: string | string[];
  confidence: number;
  historical_avg_discount: number;
  description: string;
  banner_url: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_products: number | null;
  max_alerts: number | null;
  price_history_days: number;
  api_access: number;
  team_access: number;
  features: string | string[];
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_from: string;
  valid_until: string;
  max_uses: number | null;
  current_uses: number;
  applicable_plans: string | string[];
  is_active: number;
  created_at: string;
}

export interface ProductWithPrices extends Product {
  prices?: PlatformPrice[];
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

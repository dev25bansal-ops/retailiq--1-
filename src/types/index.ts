export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  platform: 'amazon_india' | 'flipkart';
  product_url: string;
  current_price: number;
  original_price: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock';
  last_updated: string;
  image_url: string;
  brand: string;
  rating: number;
  review_count: number;
  features: Record<string, string>;
  description: string;
}

export interface PriceRecord {
  product_id: string;
  platform: string;
  price: number;
  timestamp: string;
  availability: string;
}

export interface Alert {
  alert_id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  alert_type: 'price_drop' | 'price_increase' | 'festival' | 'back_in_stock';
  old_price: number;
  new_price: number;
  percentage_change: number;
  timestamp: string;
  read: boolean;
  platform: string;
}

export interface Festival {
  festival_id: string;
  name: string;
  date: string;
  type: 'religious' | 'national' | 'sale_event';
  days_until: number;
  historical_discount_avg: number;
  affected_categories: string[];
  description: string;
  historical_discounts: { year: number; discount: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  products?: Product[];
}

export interface MarketStats {
  category: string;
  avg_price: number;
  median_price: number;
  std_dev: number;
  price_range: [number, number];
  trend: 'rising' | 'falling' | 'stable';
  volatility: 'high' | 'medium' | 'low';
  product_count: number;
}

export interface Competitor {
  rank: number;
  name: string;
  avg_price: number;
  market_share: number;
  strategy: string;
  isUser?: boolean;
}

export interface PricingScenario {
  label: string;
  price: number;
  margin_pct: number;
  position: string;
  estimated_demand: string;
  risk: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
  units_per_month: number;
  revenue: number;
  profit: number;
}

export interface PricingStrategy {
  recommended_price: number;
  min_price: number;
  competitive_position: string;
  percentile: number;
  rationale: string;
  scenarios: PricingScenario[];
}

export interface MarketOpportunity {
  product: string;
  demand_change: string;
  competition: 'Low' | 'Medium' | 'High';
  avg_price: number;
  potential_margin: string;
}

export type ViewMode = 'consumer' | 'msme';

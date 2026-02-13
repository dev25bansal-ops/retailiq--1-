// ============ Core Types ============
export type ViewMode = 'consumer' | 'msme';
export type Platform = 'amazon_india' | 'flipkart' | 'myntra' | 'ajio' | 'tatacliq' | 'jiomart' | 'meesho' | 'snapdeal';
export type ProductCategory = 'Electronics' | 'Smartphones' | 'Laptops' | 'Audio' | 'Wearables' | 'Cameras' | 'TVs' | 'Gaming' | 'Home' | 'Fashion' | 'Beauty' | 'Kitchen';
export type Currency = 'INR';
export type Language = 'en' | 'hi';

// ============ User & Auth ============
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  phone?: string;
  authProvider: 'email' | 'google' | 'facebook';
  role: 'consumer' | 'msme' | 'admin';
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserPreferences {
  language: Language;
  currency: Currency;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  defaultMode: ViewMode;
  favoriteCategories: ProductCategory[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  priceDropThreshold: number; // percentage
  frequency: 'instant' | 'daily' | 'weekly';
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// ============ Product & Pricing ============
export interface Product {
  id: string;
  product_name: string;
  brand: string;
  category: ProductCategory;
  current_price: number;
  original_price: number;
  platform: Platform;
  rating: number;
  review_count: number;
  image_url: string;
  product_url: string;
  affiliate_url?: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  specifications?: Record<string, string>;
  tags?: string[];
  lastUpdated: string;
  // Multi-platform pricing
  crossPlatformPrices?: CrossPlatformPrice[];
}

export interface CrossPlatformPrice {
  platform: Platform;
  price: number;
  url: string;
  affiliateUrl?: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  lastChecked: string;
}

export interface PriceRecord {
  date: string;
  price: number;
  platform: Platform;
}

export interface PricePrediction {
  date: string;
  predictedPrice: number;
  confidence: number; // 0-100
  lowerBound: number;
  upperBound: number;
  factors: string[];
}

export interface BuyRecommendation {
  action: 'buy_now' | 'wait' | 'set_alert';
  confidence: number;
  reasoning: string;
  predictedBestPrice: number;
  predictedBestDate: string;
  savingsIfWait: number;
}

// ============ Alerts & Notifications ============
export interface Alert {
  id: string;
  type: 'price_drop' | 'price_increase' | 'back_in_stock' | 'deal' | 'festival' | 'prediction';
  title: string;
  message: string;
  product_name: string;
  product_id?: string;
  platform: Platform;
  old_price?: number;
  new_price?: number;
  change_percentage?: number;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  channels: ('push' | 'email' | 'sms' | 'whatsapp' | 'in_app')[];
}

export interface Notification {
  id: string;
  type: 'alert' | 'system' | 'promo' | 'social' | 'achievement';
  title: string;
  body: string;
  icon?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// ============ Festival & Deals ============
export interface Festival {
  id: string;
  name: string;
  platform: Platform | 'all';
  start_date: string;
  end_date: string;
  expected_discount: string;
  categories: ProductCategory[];
  confidence: number;
  historical_avg_discount: number;
  description?: string;
  bannerUrl?: string;
}

// ============ Chat / AI ============
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  products?: Product[];
  followUpQuestions?: string[];
  prediction?: PricePrediction;
  recommendation?: BuyRecommendation;
}

// ============ MSME Types ============
export interface MarketStats {
  totalProducts: number;
  avgPrice: number;
  priceRange: { min: number; max: number };
  topBrands: string[];
  marketTrend: 'growing' | 'stable' | 'declining';
}

export interface Competitor {
  id: string;
  name: string;
  platform: Platform;
  price: number;
  rating: number;
  review_count: number;
  market_share: number;
  price_trend: 'up' | 'down' | 'stable';
  last_price_change: string;
  strengths: string[];
  weaknesses: string[];
}

export interface PricingScenario {
  id: string;
  name: string;
  basePrice: number;
  suggestedPrice: number;
  expectedVolume: number;
  expectedRevenue: number;
  expectedProfit: number;
  competitivePosition: 'cheapest' | 'mid_range' | 'premium';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'competitive' | 'value' | 'premium' | 'penetration' | 'skimming';
  margin_target: number;
  price_range: { min: number; max: number };
  auto_adjust: boolean;
  rules: PricingRule[];
}

export interface PricingRule {
  id: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export interface MarketOpportunity {
  id: string;
  title: string;
  category: ProductCategory;
  potential_revenue: number;
  competition_level: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  action_items: string[];
}

export interface MarketThreat {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: ProductCategory;
  description: string;
  mitigation: string;
  detectedAt: string;
}

// ============ MSME Inventory ============
export interface InventoryItem {
  id: string;
  product: Product;
  sku: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  margin: number;
  warehouse: string;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface RepricingRule {
  id: string;
  productId: string;
  strategy: 'match_lowest' | 'undercut_by_percent' | 'fixed_margin' | 'dynamic';
  parameters: {
    targetMargin?: number;
    undercutPercent?: number;
    minPrice: number;
    maxPrice: number;
    competitorIds?: string[];
  };
  enabled: boolean;
  lastExecuted?: string;
}

export interface GSTInfo {
  hsnCode: string;
  gstRate: number; // 0, 5, 12, 18, 28
  cgst: number;
  sgst: number;
  igst: number;
  cess?: number;
}

// ============ Subscription & Monetization ============
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    trackedProducts: number;
    alerts: number;
    competitors: number;
    apiCalls: number;
    teamMembers: number;
  };
  popular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  last4?: string;
  brand?: string;
  upiId?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'subscription' | 'affiliate_commission';
  description: string;
  createdAt: string;
  paymentMethod?: PaymentMethod;
}

// ============ Analytics ============
export interface AnalyticsEvent {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

export interface DashboardMetric {
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  period: string;
}

// ============ Community ============
export interface Deal {
  id: string;
  title: string;
  description: string;
  product: Product;
  postedBy: { id: string; displayName: string; avatarUrl?: string };
  upvotes: number;
  downvotes: number;
  comments: number;
  verified: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: { id: string; displayName: string; avatarUrl?: string };
  upvotes: number;
  createdAt: string;
  replies?: Comment[];
}

// ============ API Types ============
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      watchlistLimit: 10,
      alertsLimit: 5,
      priceHistory: 30, // days
      dealVoting: true,
      bulkPriceCheck: false,
      advancedAnalytics: false,
      apiAccess: false,
      prioritySupport: false,
      msmeFeatures: false,
    },
  },
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 199,
    priceYearly: 1990,
    features: {
      watchlistLimit: 50,
      alertsLimit: 25,
      priceHistory: 90,
      dealVoting: true,
      bulkPriceCheck: true,
      advancedAnalytics: false,
      apiAccess: false,
      prioritySupport: false,
      msmeFeatures: false,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 499,
    priceYearly: 4990,
    features: {
      watchlistLimit: 200,
      alertsLimit: 100,
      priceHistory: 365,
      dealVoting: true,
      bulkPriceCheck: true,
      advancedAnalytics: true,
      apiAccess: true,
      prioritySupport: true,
      msmeFeatures: false,
    },
  },
  BUSINESS: {
    id: 'business',
    name: 'Business (MSME)',
    price: 1999,
    priceYearly: 19990,
    features: {
      watchlistLimit: -1, // unlimited
      alertsLimit: -1,
      priceHistory: 730, // 2 years
      dealVoting: true,
      bulkPriceCheck: true,
      advancedAnalytics: true,
      apiAccess: true,
      prioritySupport: true,
      msmeFeatures: true,
    },
  },
} as const;

export const PLATFORMS = [
  { id: 'amazon', name: 'Amazon', baseUrl: 'https://www.amazon.in', active: true },
  { id: 'flipkart', name: 'Flipkart', baseUrl: 'https://www.flipkart.com', active: true },
  { id: 'myntra', name: 'Myntra', baseUrl: 'https://www.myntra.com', active: true },
  { id: 'ajio', name: 'AJIO', baseUrl: 'https://www.ajio.com', active: true },
  { id: 'meesho', name: 'Meesho', baseUrl: 'https://www.meesho.com', active: true },
  { id: 'tatacliq', name: 'Tata CLiQ', baseUrl: 'https://www.tatacliq.com', active: true },
  { id: 'jiomart', name: 'JioMart', baseUrl: 'https://www.jiomart.com', active: true },
  { id: 'snapdeal', name: 'Snapdeal', baseUrl: 'https://www.snapdeal.com', active: true },
  { id: 'nykaa', name: 'Nykaa', baseUrl: 'https://www.nykaa.com', active: true },
  { id: 'shopclues', name: 'ShopClues', baseUrl: 'https://www.shopclues.com', active: false },
] as const;

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Laptop' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'home', name: 'Home & Kitchen', icon: 'Home' },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: 'Sparkles' },
  { id: 'sports', name: 'Sports & Fitness', icon: 'Dumbbell' },
  { id: 'books', name: 'Books & Media', icon: 'Book' },
  { id: 'toys', name: 'Toys & Games', icon: 'Gamepad2' },
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingBasket' },
  { id: 'automotive', name: 'Automotive', icon: 'Car' },
  { id: 'health', name: 'Health & Wellness', icon: 'Heart' },
  { id: 'baby', name: 'Baby Products', icon: 'Baby' },
  { id: 'pet', name: 'Pet Supplies', icon: 'Cat' },
  { id: 'garden', name: 'Garden & Outdoor', icon: 'Trees' },
  { id: 'office', name: 'Office Supplies', icon: 'Briefcase' },
  { id: 'jewelry', name: 'Jewelry & Accessories', icon: 'Gem' },
] as const;

export const GST_RATES: Record<string, number> = {
  // HSN prefix to GST rate mapping
  '8517': 18, // Mobile phones
  '8528': 18, // TVs, monitors
  '8471': 18, // Computers
  '8504': 18, // Power banks
  '6109': 5, // T-shirts
  '6203': 5, // Men's clothing
  '6204': 5, // Women's clothing
  '6402': 5, // Footwear < 1000
  '6403': 18, // Footwear > 1000
  '3304': 18, // Beauty products
  '9403': 18, // Furniture
  '6912': 12, // Kitchenware
  '4901': 0, // Books
  '9503': 12, // Toys
  '1006': 5, // Rice
  '0401': 0, // Milk
  '8703': 28, // Cars
  '3004': 12, // Medicines
};

export const INDIAN_FESTIVALS = [
  { name: 'Republic Day', date: '2026-01-26', season: 'winter' },
  { name: 'Holi', date: '2026-03-14', season: 'spring' },
  { name: 'Ram Navami', date: '2026-04-02', season: 'spring' },
  { name: 'Eid ul-Fitr', date: '2026-04-21', season: 'spring' },
  { name: 'Independence Day', date: '2026-08-15', season: 'monsoon' },
  { name: 'Raksha Bandhan', date: '2026-08-28', season: 'monsoon' },
  { name: 'Janmashtami', date: '2026-09-05', season: 'monsoon' },
  { name: 'Ganesh Chaturthi', date: '2026-09-13', season: 'monsoon' },
  { name: 'Navratri', date: '2026-10-12', season: 'autumn' },
  { name: 'Dussehra', date: '2026-10-21', season: 'autumn' },
  { name: 'Diwali', date: '2026-11-08', season: 'autumn' },
  { name: 'Dhanteras', date: '2026-11-06', season: 'autumn' },
  { name: 'Black Friday', date: '2026-11-27', season: 'winter' },
  { name: 'Cyber Monday', date: '2026-11-30', season: 'winter' },
  { name: 'Christmas', date: '2026-12-25', season: 'winter' },
  { name: 'New Year', date: '2026-12-31', season: 'winter' },
] as const;

export const SALE_SEASONS = [
  { name: 'Amazon Great Indian Festival', months: [9, 10] },
  { name: 'Flipkart Big Billion Days', months: [9, 10] },
  { name: 'Summer Sale', months: [4, 5, 6] },
  { name: 'Monsoon Sale', months: [7, 8] },
  { name: 'Winter Sale', months: [12, 1] },
  { name: 'End of Season Sale', months: [3, 6, 9, 12] },
] as const;

export const NOTIFICATION_TYPES = {
  PRICE_DROP: 'price_drop',
  PRICE_TARGET: 'price_target',
  BACK_IN_STOCK: 'back_in_stock',
  DEAL_APPROVED: 'deal_approved',
  DEAL_COMMENT: 'deal_comment',
  SUBSCRIPTION_EXPIRING: 'subscription_expiring',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  FESTIVAL_SALE: 'festival_sale',
  GROUP_BUY_TARGET: 'group_buy_target',
  COMPETITOR_PRICE_CHANGE: 'competitor_price_change',
  LOW_STOCK_ALERT: 'low_stock_alert',
} as const;

export const ALERT_TYPES = {
  PRICE_DROP: 'price_drop',
  PRICE_TARGET: 'price_target',
  PERCENTAGE_DROP: 'percentage_drop',
  BACK_IN_STOCK: 'back_in_stock',
  HISTORICAL_LOW: 'historical_low',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const DEAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export const REPRICING_STRATEGIES = {
  MATCH_LOWEST: 'match_lowest',
  BEAT_LOWEST: 'beat_lowest',
  STAY_COMPETITIVE: 'stay_competitive',
  MAXIMIZE_MARGIN: 'maximize_margin',
  DYNAMIC_DEMAND: 'dynamic_demand',
} as const;

export const API_RATE_LIMITS = {
  FREE: { requests: 100, window: 3600 }, // 100 per hour
  BASIC: { requests: 500, window: 3600 },
  PREMIUM: { requests: 2000, window: 3600 },
  BUSINESS: { requests: 10000, window: 3600 },
} as const;

export const PRICE_SCRAPE_INTERVALS = {
  HIGH_PRIORITY: 3600, // 1 hour
  MEDIUM_PRIORITY: 21600, // 6 hours
  LOW_PRIORITY: 86400, // 24 hours
} as const;

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PRICE_ALERT: 'price_alert',
  PASSWORD_RESET: 'password_reset',
  SUBSCRIPTION_CONFIRMATION: 'subscription_confirmation',
  DEAL_NOTIFICATION: 'deal_notification',
} as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

export const CURRENCY_SYMBOL = '₹';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
};

export const PASSWORD_MIN_LENGTH = 8;

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_LENGTH = 6;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default {
  SUBSCRIPTION_TIERS,
  PLATFORMS,
  CATEGORIES,
  GST_RATES,
  INDIAN_FESTIVALS,
  SALE_SEASONS,
  NOTIFICATION_TYPES,
  ALERT_TYPES,
  TRANSACTION_STATUS,
  DEAL_STATUS,
  REPRICING_STRATEGIES,
  API_RATE_LIMITS,
  PRICE_SCRAPE_INTERVALS,
  EMAIL_TEMPLATES,
  INDIAN_STATES,
  CURRENCY_SYMBOL,
  DATE_FORMAT,
  DATETIME_FORMAT,
  PAGINATION_DEFAULTS,
  PASSWORD_MIN_LENGTH,
  OTP_EXPIRY_MINUTES,
  OTP_LENGTH,
  MAX_FILE_SIZE,
  SUPPORTED_IMAGE_TYPES,
};

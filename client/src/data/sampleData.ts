import type { Product, Alert, Festival, PriceRecord } from '../types';

export const sampleProducts: Product[] = [
  {
    id: 'p1',
    product_name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    category: 'Smartphones',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/iphone-15-pro-max',
    current_price: 144900,
    original_price: 159900,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/iphone15pro.jpg',
    brand: 'Apple',
    rating: 4.7,
    review_count: 1542,
    specifications: {
      storage: '256GB',
      ram: '8GB',
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro',
      camera: '48MP + 12MP + 12MP'
    },
    tags: ['flagship', 'premium', 'iOS']
  },
  {
    id: 'p2',
    product_name: 'Samsung Galaxy S24 Ultra (12GB RAM, 256GB)',
    category: 'Smartphones',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/samsung-s24-ultra',
    current_price: 124999,
    original_price: 134999,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/s24ultra.jpg',
    brand: 'Samsung',
    rating: 4.6,
    review_count: 2341,
    specifications: {
      storage: '256GB',
      ram: '12GB',
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP + 50MP + 12MP + 10MP'
    },
    tags: ['flagship', 'S-Pen', 'Android']
  },
  {
    id: 'p3',
    product_name: 'OnePlus 12 (12GB RAM, 256GB, Flowy Emerald)',
    category: 'Smartphones',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/oneplus-12',
    current_price: 64999,
    original_price: 69999,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/oneplus12.jpg',
    brand: 'OnePlus',
    rating: 4.5,
    review_count: 1876,
    specifications: {
      storage: '256GB',
      ram: '12GB',
      display: '6.82" AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP + 64MP + 48MP'
    },
    tags: ['flagship-killer', 'Hasselblad', 'fast-charging']
  },
  {
    id: 'p4',
    product_name: 'Google Pixel 8 Pro (12GB RAM, 256GB)',
    category: 'Smartphones',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/pixel-8-pro',
    current_price: 84999,
    original_price: 106999,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/pixel8pro.jpg',
    brand: 'Google',
    rating: 4.6,
    review_count: 987,
    specifications: {
      storage: '256GB',
      ram: '12GB',
      display: '6.7" LTPO OLED',
      processor: 'Google Tensor G3',
      camera: '50MP + 48MP + 48MP'
    },
    tags: ['best-camera', 'AI', 'long-updates']
  },
  {
    id: 'p5',
    product_name: 'Nothing Phone (2a) (8GB RAM, 128GB)',
    category: 'Smartphones',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/nothing-phone-2a',
    current_price: 23999,
    original_price: 25999,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/nothing2a.jpg',
    brand: 'Nothing',
    rating: 4.3,
    review_count: 1234,
    specifications: {
      storage: '128GB',
      ram: '8GB',
      display: '6.7" AMOLED',
      processor: 'MediaTek Dimensity 7200 Pro',
      camera: '50MP + 50MP'
    },
    tags: ['unique-design', 'glyph', 'mid-range']
  },
  {
    id: 'p6',
    product_name: 'Dell XPS 13 (13th Gen Intel i7, 16GB RAM, 512GB SSD)',
    category: 'Laptops',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/dell-xps-13',
    current_price: 119990,
    original_price: 134990,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/dell-xps13.jpg',
    brand: 'Dell',
    rating: 4.5,
    review_count: 543,
    specifications: {
      processor: 'Intel Core i7-1355U',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '13.4" FHD+',
      graphics: 'Intel Iris Xe'
    },
    tags: ['ultrabook', 'premium', 'business']
  },
  {
    id: 'p7',
    product_name: 'MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)',
    category: 'Laptops',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/macbook-air-m2',
    current_price: 99990,
    original_price: 114900,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/macbook-air-m2.jpg',
    brand: 'Apple',
    rating: 4.8,
    review_count: 876,
    specifications: {
      processor: 'Apple M2',
      ram: '8GB Unified Memory',
      storage: '256GB SSD',
      display: '13.6" Liquid Retina',
      graphics: '8-core GPU'
    },
    tags: ['thin', 'light', 'M2', 'macOS']
  },
  {
    id: 'p8',
    product_name: 'ASUS ROG Strix G16 (Intel i7, RTX 4060, 16GB RAM)',
    category: 'Laptops',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/asus-rog-strix-g16',
    current_price: 124990,
    original_price: 149990,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/rog-strix-g16.jpg',
    brand: 'ASUS',
    rating: 4.6,
    review_count: 432,
    specifications: {
      processor: 'Intel Core i7-13650HX',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      display: '16" FHD 165Hz',
      graphics: 'NVIDIA RTX 4060 8GB'
    },
    tags: ['gaming', 'high-performance', 'RGB']
  },
  {
    id: 'p9',
    product_name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'Audio',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/sony-wh1000xm5',
    current_price: 28990,
    original_price: 34990,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/sony-wh1000xm5.jpg',
    brand: 'Sony',
    rating: 4.7,
    review_count: 2341,
    specifications: {
      type: 'Over-Ear Wireless',
      noise_cancelling: 'Industry-leading ANC',
      battery: '30 hours',
      connectivity: 'Bluetooth 5.2',
      controls: 'Touch controls'
    },
    tags: ['premium-audio', 'ANC', 'wireless']
  },
  {
    id: 'p10',
    product_name: 'Apple AirPods Pro (2nd Generation)',
    category: 'Audio',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/airpods-pro-2',
    current_price: 23990,
    original_price: 26900,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/airpods-pro-2.jpg',
    brand: 'Apple',
    rating: 4.6,
    review_count: 1654,
    specifications: {
      type: 'In-Ear Wireless',
      noise_cancelling: 'Active Noise Cancellation',
      battery: '6 hours (30 hours with case)',
      connectivity: 'Bluetooth 5.3',
      features: 'Spatial Audio, Transparency Mode'
    },
    tags: ['premium', 'ANC', 'spatial-audio']
  },
  {
    id: 'p11',
    product_name: 'boAt Airdopes 141 True Wireless Earbuds',
    category: 'Audio',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/boat-airdopes-141',
    current_price: 1299,
    original_price: 2990,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/boat-airdopes-141.jpg',
    brand: 'boAt',
    rating: 4.1,
    review_count: 8765,
    specifications: {
      type: 'In-Ear Wireless',
      battery: '42 hours playback',
      connectivity: 'Bluetooth 5.1',
      waterproof: 'IPX4',
      drivers: '8mm drivers'
    },
    tags: ['budget', 'TWS', 'value-for-money']
  },
  {
    id: 'p12',
    product_name: 'Samsung Galaxy Watch 6 Classic (43mm, Bluetooth)',
    category: 'Wearables',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/galaxy-watch-6-classic',
    current_price: 34999,
    original_price: 39999,
    availability: 'in_stock',
    lastUpdated: '2026-02-12T10:00:00Z',
    image_url: '/images/galaxy-watch-6.jpg',
    brand: 'Samsung',
    rating: 4.5,
    review_count: 432,
    specifications: {
      display: '1.3" Super AMOLED',
      battery: 'Up to 40 hours',
      sensors: 'Heart rate, ECG, Blood oxygen, Sleep tracking',
      waterproof: '5ATM + IP68',
      compatibility: 'Android'
    },
    tags: ['smartwatch', 'health-tracking', 'rotating-bezel']
  }
];

export const sampleCompetitors = [
  { rank: 1, name: 'TechMart Electronics', avg_price: 24500, market_share: 15.2, strategy: 'Premium positioning' },
  { rank: 2, name: 'Digital Hub', avg_price: 22800, market_share: 12.8, strategy: 'Volume sales' },
  { rank: 3, name: 'Gadget Galaxy', avg_price: 26100, market_share: 11.5, strategy: 'Premium + Services' },
  { rank: 4, name: 'Smart Solutions', avg_price: 21900, market_share: 10.3, strategy: 'Competitive pricing' },
  { rank: 5, name: 'E-Retail Pro', avg_price: 23200, market_share: 9.8, strategy: 'Bundle deals' },
  { rank: 6, name: 'Tech Valley', avg_price: 24800, market_share: 8.9, strategy: 'Brand exclusives' },
  { rank: 7, name: 'Digi Store', avg_price: 22500, market_share: 7.4, strategy: 'Fast delivery' },
  { rank: 8, name: 'Your Store', avg_price: 25200, market_share: 6.2, strategy: 'Premium + Service', isUser: true },
  { rank: 9, name: 'Quick Gadgets', avg_price: 20800, market_share: 5.8, strategy: 'Discount heavy' },
  { rank: 10, name: 'Mobile World', avg_price: 23900, market_share: 5.1, strategy: 'Mid-range focus' }
];

export const sampleOpportunities = [
  {
    product: 'Wireless Earbuds (Budget)',
    demand_change: '+45% in 30 days',
    competition: 'Low' as const,
    avg_price: 1499,
    potential_margin: '35-40%'
  },
  {
    product: 'Smart Watches (Mid-range)',
    demand_change: '+28% in 30 days',
    competition: 'Medium' as const,
    avg_price: 8999,
    potential_margin: '25-30%'
  },
  {
    product: 'Power Banks (20000mAh)',
    demand_change: '+18% in 30 days',
    competition: 'Low' as const,
    avg_price: 1799,
    potential_margin: '30-35%'
  }
];

export const sampleThreats = [
  { competitor: 'TechMart Electronics', action: 'Reduced prices by 8% on premium smartphones', impact: 'High', date: '2 days ago' },
  { competitor: 'Digital Hub', action: 'Launched buy-2-get-1 offer on accessories', impact: 'Medium', date: '5 days ago' },
  { competitor: 'Smart Solutions', action: 'Started same-day delivery in your area', impact: 'Medium', date: '1 week ago' }
];

export const msmeProducts = [
  { id: 1, name: 'Samsung Galaxy M34 5G', yourPrice: 18999, marketAvg: 16999, position: 'Above Market', status: 'warning' },
  { id: 2, name: 'boAt Airdopes 141', yourPrice: 1299, marketAvg: 1450, position: 'Competitive', status: 'success' },
  { id: 3, name: 'OnePlus Nord CE 3', yourPrice: 24999, marketAvg: 26500, position: 'Best Value', status: 'success' },
  { id: 4, name: 'Noise ColorFit Pro 4', yourPrice: 3499, marketAvg: 2999, position: 'Above Market', status: 'warning' },
  { id: 5, name: 'Realme Buds Air 5', yourPrice: 2799, marketAvg: 3200, position: 'Competitive', status: 'success' }
];

export const topPerformers = [
  { name: 'OnePlus Nord CE 3', margin: '18%', sales: 45, trend: 'up' },
  { name: 'boAt Airdopes 141', margin: '22%', sales: 123, trend: 'up' },
  { name: 'Realme Buds Air 5', margin: '15%', sales: 67, trend: 'stable' }
];

export const needsAttention = [
  { name: 'Samsung Galaxy M34 5G', issue: 'Overpriced vs market', impact: 'Low sales' },
  { name: 'Noise ColorFit Pro 4', issue: 'High competition', impact: 'Margin pressure' }
];

export const priceDistribution = [
  { range: '15k-20k', count: 45 },
  { range: '20k-25k', count: 78 },
  { range: '25k-30k', count: 52 },
  { range: '30k-35k', count: 34 },
  { range: '35k-40k', count: 18 },
  { range: '40k+', count: 12 }
];

// Consumer-specific data
export const sampleAlerts: Alert[] = [
  {
    id: 'ALERT001',
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: 'Price dropped by ₹5,000 on Apple iPhone 15 Pro Max',
    product_name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    product_id: 'p1',
    platform: 'amazon_india',
    old_price: 149900,
    new_price: 144900,
    change_percentage: -3.3,
    timestamp: '2026-02-12T10:00:00Z',
    read: false,
    channels: ['push', 'email', 'in_app']
  },
  {
    id: 'ALERT002',
    type: 'price_drop',
    title: 'Great Deal Alert',
    message: 'Significant price drop on Sony WH-1000XM5',
    product_name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    product_id: 'p9',
    platform: 'amazon_india',
    old_price: 32990,
    new_price: 28990,
    change_percentage: -12.1,
    timestamp: '2026-02-12T08:30:00Z',
    read: false,
    channels: ['push', 'email', 'in_app']
  },
  {
    id: 'ALERT003',
    type: 'festival',
    title: 'Festival Sale Alert',
    message: 'Special festival discount on Samsung Galaxy S24 Ultra',
    product_name: 'Samsung Galaxy S24 Ultra (12GB RAM, 256GB)',
    product_id: 'p2',
    platform: 'flipkart',
    old_price: 129999,
    new_price: 124999,
    change_percentage: -3.8,
    timestamp: '2026-02-11T15:20:00Z',
    read: false,
    channels: ['push', 'in_app']
  },
  {
    id: 'ALERT004',
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: 'MacBook Air M2 price reduced',
    product_name: 'MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)',
    product_id: 'p7',
    platform: 'flipkart',
    old_price: 104990,
    new_price: 99990,
    change_percentage: -4.8,
    timestamp: '2026-02-11T09:00:00Z',
    read: true,
    channels: ['email', 'in_app']
  },
  {
    id: 'ALERT005',
    type: 'price_drop',
    title: 'Hot Deal Alert',
    message: 'boAt Airdopes 141 at lowest price',
    product_name: 'boAt Airdopes 141 True Wireless Earbuds',
    product_id: 'p11',
    platform: 'amazon_india',
    old_price: 1599,
    new_price: 1299,
    change_percentage: -18.8,
    timestamp: '2026-02-10T16:45:00Z',
    read: true,
    channels: ['push', 'in_app']
  },
  {
    id: 'ALERT006',
    type: 'price_increase',
    title: 'Price Increase Alert',
    message: 'OnePlus 12 price increased',
    product_name: 'OnePlus 12 (12GB RAM, 256GB, Flowy Emerald)',
    product_id: 'p3',
    platform: 'amazon_india',
    old_price: 62999,
    new_price: 64999,
    change_percentage: 3.2,
    timestamp: '2026-02-10T12:15:00Z',
    read: true,
    channels: ['email', 'in_app']
  },
  {
    id: 'ALERT007',
    type: 'festival',
    title: 'Festival Deal',
    message: 'Dell XPS 13 festival discount',
    product_name: 'Dell XPS 13 (13th Gen Intel i7, 16GB RAM, 512GB SSD)',
    product_id: 'p6',
    platform: 'amazon_india',
    old_price: 124990,
    new_price: 119990,
    change_percentage: -4.0,
    timestamp: '2026-02-09T11:30:00Z',
    read: true,
    channels: ['in_app']
  },
  {
    id: 'ALERT008',
    type: 'price_increase',
    title: 'Price Increase Alert',
    message: 'AirPods Pro price went up',
    product_name: 'Apple AirPods Pro (2nd Generation)',
    product_id: 'p10',
    platform: 'flipkart',
    old_price: 22990,
    new_price: 23990,
    change_percentage: 4.3,
    timestamp: '2026-02-09T08:00:00Z',
    read: true,
    channels: ['email']
  },
];

export const sampleFestivals: Festival[] = [
  {
    id: 'FEST001',
    name: 'Holi Sale',
    platform: 'all',
    start_date: '2026-03-14',
    end_date: '2026-03-16',
    expected_discount: '20-30%',
    categories: ['Electronics', 'Fashion', 'Home', 'Beauty'],
    confidence: 85,
    historical_avg_discount: 25,
    description: 'Major spring festival sale with significant discounts across categories'
  },
  {
    id: 'FEST002',
    name: 'Amazon Great Indian Festival',
    platform: 'amazon_india',
    start_date: '2026-09-20',
    end_date: '2026-09-24',
    expected_discount: '30-50%',
    categories: ['Electronics', 'Smartphones', 'Laptops', 'TVs'],
    confidence: 95,
    historical_avg_discount: 40,
    description: 'Amazon biggest annual sale event with deep discounts'
  },
  {
    id: 'FEST003',
    name: 'Flipkart Big Billion Days',
    platform: 'flipkart',
    start_date: '2026-10-05',
    end_date: '2026-10-10',
    expected_discount: '35-55%',
    categories: ['Electronics', 'Fashion', 'Smartphones', 'Laptops'],
    confidence: 95,
    historical_avg_discount: 45,
    description: 'Flipkart annual mega sale with massive discounts'
  },
  {
    id: 'FEST004',
    name: 'Diwali Dhamaka',
    platform: 'all',
    start_date: '2026-11-01',
    end_date: '2026-11-05',
    expected_discount: '25-40%',
    categories: ['Electronics', 'Fashion', 'Home'],
    confidence: 90,
    historical_avg_discount: 35,
    description: 'Festival of lights mega sale across all platforms'
  },
  {
    id: 'FEST005',
    name: 'Republic Day Sale',
    platform: 'all',
    start_date: '2027-01-26',
    end_date: '2027-01-28',
    expected_discount: '20-35%',
    categories: ['Electronics', 'Fashion', 'Smartphones'],
    confidence: 80,
    historical_avg_discount: 30,
    description: 'Republic Day special offers and discounts'
  },
  {
    id: 'FEST006',
    name: 'Summer Sale',
    platform: 'all',
    start_date: '2026-05-15',
    end_date: '2026-05-18',
    expected_discount: '20-35%',
    categories: ['Fashion', 'Beauty', 'Electronics'],
    confidence: 75,
    historical_avg_discount: 28,
    description: 'Summer clearance sale with attractive deals'
  },
  {
    id: 'FEST007',
    name: 'Raksha Bandhan Special',
    platform: 'all',
    start_date: '2026-08-09',
    end_date: '2026-08-11',
    expected_discount: '15-25%',
    categories: ['Fashion', 'Electronics'],
    confidence: 70,
    historical_avg_discount: 20,
    description: 'Special festive offers for Raksha Bandhan'
  },
  {
    id: 'FEST008',
    name: 'Independence Day Sale',
    platform: 'all',
    start_date: '2026-08-15',
    end_date: '2026-08-17',
    expected_discount: '25-40%',
    categories: ['Electronics', 'Smartphones', 'Fashion'],
    confidence: 85,
    historical_avg_discount: 32,
    description: 'Independence Day mega sale with patriotic discounts'
  },
];

export const samplePriceHistory: PriceRecord[] = [
  // iPhone 15 Pro Max price history (last 30 days)
  { date: '2026-01-13', price: 154900, platform: 'amazon_india' },
  { date: '2026-01-16', price: 152900, platform: 'amazon_india' },
  { date: '2026-01-20', price: 151900, platform: 'amazon_india' },
  { date: '2026-01-25', price: 149900, platform: 'amazon_india' },
  { date: '2026-01-30', price: 148900, platform: 'amazon_india' },
  { date: '2026-02-03', price: 147900, platform: 'amazon_india' },
  { date: '2026-02-07', price: 146900, platform: 'amazon_india' },
  { date: '2026-02-12', price: 144900, platform: 'amazon_india' },

  { date: '2026-01-13', price: 156900, platform: 'flipkart' },
  { date: '2026-01-20', price: 154900, platform: 'flipkart' },
  { date: '2026-01-27', price: 151900, platform: 'flipkart' },
  { date: '2026-02-03', price: 149900, platform: 'flipkart' },
  { date: '2026-02-10', price: 147900, platform: 'flipkart' },
  { date: '2026-02-12', price: 146900, platform: 'flipkart' },
];

// Helper functions
export const getNextFestival = (): Festival | undefined => {
  const today = new Date('2026-02-12');
  const festivals = sampleFestivals
    .map(festival => ({
      ...festival,
      daysUntil: Math.floor((new Date(festival.start_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    }))
    .filter(f => f.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return festivals[0];
};

export const getPriceHistory = (productId: string): PriceRecord[] => {
  // Note: PriceRecord doesn't have product_id, so this function would need to be implemented differently
  // For now, returning sample data for demonstration
  return samplePriceHistory;
};

export const watchlistProducts = sampleProducts.slice(0, 12);

export const getRecentAlerts = (): Alert[] => {
  return sampleAlerts.filter(alert => !alert.read).slice(0, 3);
};

export const trendingProducts = [
  { rank: 1, product: sampleProducts[0], trend_score: 95 },
  { rank: 2, product: sampleProducts[1], trend_score: 92 },
  { rank: 3, product: sampleProducts[2], trend_score: 88 },
  { rank: 4, product: sampleProducts[4], trend_score: 85 },
  { rank: 5, product: sampleProducts[5], trend_score: 82 },
];

export const recommendedProducts = sampleProducts.slice(0, 8);

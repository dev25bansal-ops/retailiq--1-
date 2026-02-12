import type { Product, Alert, Festival, PriceRecord } from '../types';

export const sampleProducts: Product[] = [
  {
    product_id: 'p1',
    product_name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    category: 'Smartphone',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/iphone-15-pro-max',
    current_price: 144900,
    original_price: 159900,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/iphone15pro.jpg',
    brand: 'Apple',
    rating: 4.7,
    review_count: 1542,
    features: {
      storage: '256GB',
      ram: '8GB',
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro',
      camera: '48MP + 12MP + 12MP'
    },
    description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system'
  },
  {
    product_id: 'p2',
    product_name: 'Samsung Galaxy S24 Ultra (12GB RAM, 256GB)',
    category: 'Smartphone',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/samsung-s24-ultra',
    current_price: 124999,
    original_price: 134999,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/s24ultra.jpg',
    brand: 'Samsung',
    rating: 4.6,
    review_count: 2341,
    features: {
      storage: '256GB',
      ram: '12GB',
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 3',
      camera: '200MP + 50MP + 12MP + 10MP'
    },
    description: 'Flagship Samsung with S Pen, 200MP camera, and AI features'
  },
  {
    product_id: 'p3',
    product_name: 'OnePlus 12 (12GB RAM, 256GB, Flowy Emerald)',
    category: 'Smartphone',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/oneplus-12',
    current_price: 64999,
    original_price: 69999,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/oneplus12.jpg',
    brand: 'OnePlus',
    rating: 4.5,
    review_count: 1876,
    features: {
      storage: '256GB',
      ram: '12GB',
      display: '6.82" AMOLED',
      processor: 'Snapdragon 8 Gen 3',
      camera: '50MP + 64MP + 48MP'
    },
    description: 'Flagship killer with Hasselblad camera and 100W fast charging'
  },
  {
    product_id: 'p4',
    product_name: 'Google Pixel 8 Pro (12GB RAM, 256GB)',
    category: 'Smartphone',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/pixel-8-pro',
    current_price: 84999,
    original_price: 106999,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/pixel8pro.jpg',
    brand: 'Google',
    rating: 4.6,
    review_count: 987,
    features: {
      storage: '256GB',
      ram: '12GB',
      display: '6.7" LTPO OLED',
      processor: 'Google Tensor G3',
      camera: '50MP + 48MP + 48MP'
    },
    description: 'Best Android camera with AI features and 7 years of updates'
  },
  {
    product_id: 'p5',
    product_name: 'Nothing Phone (2a) (8GB RAM, 128GB)',
    category: 'Smartphone',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/nothing-phone-2a',
    current_price: 23999,
    original_price: 25999,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/nothing2a.jpg',
    brand: 'Nothing',
    rating: 4.3,
    review_count: 1234,
    features: {
      storage: '128GB',
      ram: '8GB',
      display: '6.7" AMOLED',
      processor: 'MediaTek Dimensity 7200 Pro',
      camera: '50MP + 50MP'
    },
    description: 'Unique design with Glyph interface and great value'
  },
  {
    product_id: 'p6',
    product_name: 'Dell XPS 13 (13th Gen Intel i7, 16GB RAM, 512GB SSD)',
    category: 'Laptop',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/dell-xps-13',
    current_price: 119990,
    original_price: 134990,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/dell-xps13.jpg',
    brand: 'Dell',
    rating: 4.5,
    review_count: 543,
    features: {
      processor: 'Intel Core i7-1355U',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '13.4" FHD+',
      graphics: 'Intel Iris Xe'
    },
    description: 'Premium ultrabook with stunning display and long battery life'
  },
  {
    product_id: 'p7',
    product_name: 'MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)',
    category: 'Laptop',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/macbook-air-m2',
    current_price: 99990,
    original_price: 114900,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/macbook-air-m2.jpg',
    brand: 'Apple',
    rating: 4.8,
    review_count: 876,
    features: {
      processor: 'Apple M2',
      ram: '8GB Unified Memory',
      storage: '256GB SSD',
      display: '13.6" Liquid Retina',
      graphics: '8-core GPU'
    },
    description: 'Thin, light, and powerful with Apple M2 chip'
  },
  {
    product_id: 'p8',
    product_name: 'ASUS ROG Strix G16 (Intel i7, RTX 4060, 16GB RAM)',
    category: 'Laptop',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/asus-rog-strix-g16',
    current_price: 124990,
    original_price: 149990,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/rog-strix-g16.jpg',
    brand: 'ASUS',
    rating: 4.6,
    review_count: 432,
    features: {
      processor: 'Intel Core i7-13650HX',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      display: '16" FHD 165Hz',
      graphics: 'NVIDIA RTX 4060 8GB'
    },
    description: 'Gaming laptop with powerful specs and RGB lighting'
  },
  {
    product_id: 'p9',
    product_name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'Audio',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/sony-wh1000xm5',
    current_price: 28990,
    original_price: 34990,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/sony-wh1000xm5.jpg',
    brand: 'Sony',
    rating: 4.7,
    review_count: 2341,
    features: {
      type: 'Over-Ear Wireless',
      noise_cancelling: 'Industry-leading ANC',
      battery: '30 hours',
      connectivity: 'Bluetooth 5.2',
      controls: 'Touch controls'
    },
    description: 'Best-in-class noise cancelling with premium sound quality'
  },
  {
    product_id: 'p10',
    product_name: 'Apple AirPods Pro (2nd Generation)',
    category: 'Audio',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/airpods-pro-2',
    current_price: 23990,
    original_price: 26900,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/airpods-pro-2.jpg',
    brand: 'Apple',
    rating: 4.6,
    review_count: 1654,
    features: {
      type: 'In-Ear Wireless',
      noise_cancelling: 'Active Noise Cancellation',
      battery: '6 hours (30 hours with case)',
      connectivity: 'Bluetooth 5.3',
      features: 'Spatial Audio, Transparency Mode'
    },
    description: 'Premium earbuds with adaptive audio and seamless Apple integration'
  },
  {
    product_id: 'p11',
    product_name: 'boAt Airdopes 141 True Wireless Earbuds',
    category: 'Audio',
    platform: 'amazon_india',
    product_url: 'https://amazon.in/boat-airdopes-141',
    current_price: 1299,
    original_price: 2990,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/boat-airdopes-141.jpg',
    brand: 'boAt',
    rating: 4.1,
    review_count: 8765,
    features: {
      type: 'In-Ear Wireless',
      battery: '42 hours playback',
      connectivity: 'Bluetooth 5.1',
      waterproof: 'IPX4',
      drivers: '8mm drivers'
    },
    description: 'Budget TWS earbuds with good battery life'
  },
  {
    product_id: 'p12',
    product_name: 'Samsung Galaxy Watch 6 Classic (43mm, Bluetooth)',
    category: 'Wearable',
    platform: 'flipkart',
    product_url: 'https://flipkart.com/galaxy-watch-6-classic',
    current_price: 34999,
    original_price: 39999,
    currency: 'INR',
    availability: 'in_stock',
    last_updated: '2026-02-12T10:00:00Z',
    image_url: '/images/galaxy-watch-6.jpg',
    brand: 'Samsung',
    rating: 4.5,
    review_count: 432,
    features: {
      display: '1.3" Super AMOLED',
      battery: 'Up to 40 hours',
      sensors: 'Heart rate, ECG, Blood oxygen, Sleep tracking',
      waterproof: '5ATM + IP68',
      compatibility: 'Android'
    },
    description: 'Premium smartwatch with rotating bezel and advanced health tracking'
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
    alert_id: 'ALERT001',
    user_id: 'USER001',
    product_id: 'p1',
    product_name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
    alert_type: 'price_drop',
    old_price: 149900,
    new_price: 144900,
    percentage_change: -3.3,
    timestamp: '2026-02-12T10:00:00Z',
    read: false,
    platform: 'amazon_india',
  },
  {
    alert_id: 'ALERT002',
    user_id: 'USER001',
    product_id: 'p9',
    product_name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    alert_type: 'price_drop',
    old_price: 32990,
    new_price: 28990,
    percentage_change: -12.1,
    timestamp: '2026-02-12T08:30:00Z',
    read: false,
    platform: 'amazon_india',
  },
  {
    alert_id: 'ALERT003',
    user_id: 'USER001',
    product_id: 'p2',
    product_name: 'Samsung Galaxy S24 Ultra (12GB RAM, 256GB)',
    alert_type: 'festival',
    old_price: 129999,
    new_price: 124999,
    percentage_change: -3.8,
    timestamp: '2026-02-11T15:20:00Z',
    read: false,
    platform: 'flipkart',
  },
  {
    alert_id: 'ALERT004',
    user_id: 'USER001',
    product_id: 'p7',
    product_name: 'MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)',
    alert_type: 'price_drop',
    old_price: 104990,
    new_price: 99990,
    percentage_change: -4.8,
    timestamp: '2026-02-11T09:00:00Z',
    read: true,
    platform: 'flipkart',
  },
  {
    alert_id: 'ALERT005',
    user_id: 'USER001',
    product_id: 'p11',
    product_name: 'boAt Airdopes 141 True Wireless Earbuds',
    alert_type: 'price_drop',
    old_price: 1599,
    new_price: 1299,
    percentage_change: -18.8,
    timestamp: '2026-02-10T16:45:00Z',
    read: true,
    platform: 'amazon_india',
  },
  {
    alert_id: 'ALERT006',
    user_id: 'USER001',
    product_id: 'p3',
    product_name: 'OnePlus 12 (12GB RAM, 256GB, Flowy Emerald)',
    alert_type: 'price_increase',
    old_price: 62999,
    new_price: 64999,
    percentage_change: 3.2,
    timestamp: '2026-02-10T12:15:00Z',
    read: true,
    platform: 'amazon_india',
  },
  {
    alert_id: 'ALERT007',
    user_id: 'USER001',
    product_id: 'p6',
    product_name: 'Dell XPS 13 (13th Gen Intel i7, 16GB RAM, 512GB SSD)',
    alert_type: 'festival',
    old_price: 124990,
    new_price: 119990,
    percentage_change: -4.0,
    timestamp: '2026-02-09T11:30:00Z',
    read: true,
    platform: 'amazon_india',
  },
  {
    alert_id: 'ALERT008',
    user_id: 'USER001',
    product_id: 'p10',
    product_name: 'Apple AirPods Pro (2nd Generation)',
    alert_type: 'price_increase',
    old_price: 22990,
    new_price: 23990,
    percentage_change: 4.3,
    timestamp: '2026-02-09T08:00:00Z',
    read: true,
    platform: 'flipkart',
  },
];

export const sampleFestivals: Festival[] = [
  {
    festival_id: 'FEST001',
    name: 'Holi Sale',
    date: '2026-03-14',
    type: 'religious',
    days_until: 30,
    historical_discount_avg: 25,
    affected_categories: ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'],
    description: 'Major spring festival sale with significant discounts across categories',
    historical_discounts: [
      { year: 2025, discount: 22 },
      { year: 2024, discount: 25 },
      { year: 2023, discount: 28 },
      { year: 2022, discount: 24 },
    ],
  },
  {
    festival_id: 'FEST002',
    name: 'Amazon Great Indian Festival',
    date: '2026-09-20',
    type: 'sale_event',
    days_until: 220,
    historical_discount_avg: 40,
    affected_categories: ['Electronics', 'Appliances', 'Fashion', 'Mobile', 'TV', 'Laptop'],
    description: 'Amazon biggest annual sale event with deep discounts',
    historical_discounts: [
      { year: 2025, discount: 38 },
      { year: 2024, discount: 42 },
      { year: 2023, discount: 40 },
      { year: 2022, discount: 39 },
    ],
  },
  {
    festival_id: 'FEST003',
    name: 'Flipkart Big Billion Days',
    date: '2026-10-05',
    type: 'sale_event',
    days_until: 235,
    historical_discount_avg: 45,
    affected_categories: ['Electronics', 'Fashion', 'Mobile', 'Laptop', 'TV', 'Appliances'],
    description: 'Flipkart annual mega sale with massive discounts',
    historical_discounts: [
      { year: 2025, discount: 43 },
      { year: 2024, discount: 47 },
      { year: 2023, discount: 45 },
      { year: 2022, discount: 44 },
    ],
  },
  {
    festival_id: 'FEST004',
    name: 'Diwali Dhamaka',
    date: '2026-11-01',
    type: 'religious',
    days_until: 262,
    historical_discount_avg: 35,
    affected_categories: ['Electronics', 'Jewelry', 'Fashion', 'Home Decor', 'Appliances'],
    description: 'Festival of lights mega sale across all platforms',
    historical_discounts: [
      { year: 2025, discount: 33 },
      { year: 2024, discount: 37 },
      { year: 2023, discount: 35 },
      { year: 2022, discount: 35 },
    ],
  },
  {
    festival_id: 'FEST005',
    name: 'Republic Day Sale',
    date: '2027-01-26',
    type: 'national',
    days_until: 348,
    historical_discount_avg: 30,
    affected_categories: ['Electronics', 'Fashion', 'Appliances', 'Mobile'],
    description: 'Republic Day special offers and discounts',
    historical_discounts: [
      { year: 2026, discount: 28 },
      { year: 2025, discount: 32 },
      { year: 2024, discount: 30 },
      { year: 2023, discount: 30 },
    ],
  },
  {
    festival_id: 'FEST006',
    name: 'Summer Sale',
    date: '2026-05-15',
    type: 'sale_event',
    days_until: 92,
    historical_discount_avg: 28,
    affected_categories: ['Fashion', 'Beauty', 'Sports', 'Electronics'],
    description: 'Summer clearance sale with attractive deals',
    historical_discounts: [
      { year: 2025, discount: 26 },
      { year: 2024, discount: 30 },
      { year: 2023, discount: 28 },
      { year: 2022, discount: 28 },
    ],
  },
  {
    festival_id: 'FEST007',
    name: 'Raksha Bandhan Special',
    date: '2026-08-09',
    type: 'religious',
    days_until: 178,
    historical_discount_avg: 20,
    affected_categories: ['Fashion', 'Jewelry', 'Electronics', 'Gifts'],
    description: 'Special festive offers for Raksha Bandhan',
    historical_discounts: [
      { year: 2025, discount: 18 },
      { year: 2024, discount: 22 },
      { year: 2023, discount: 20 },
      { year: 2022, discount: 20 },
    ],
  },
  {
    festival_id: 'FEST008',
    name: 'Independence Day Sale',
    date: '2026-08-15',
    type: 'national',
    days_until: 184,
    historical_discount_avg: 32,
    affected_categories: ['Electronics', 'Appliances', 'Fashion', 'Mobile'],
    description: 'Independence Day mega sale with patriotic discounts',
    historical_discounts: [
      { year: 2025, discount: 30 },
      { year: 2024, discount: 34 },
      { year: 2023, discount: 32 },
      { year: 2022, discount: 32 },
    ],
  },
];

export const samplePriceHistory: PriceRecord[] = [
  // iPhone 15 Pro Max price history (last 30 days)
  { product_id: 'p1', platform: 'amazon_india', price: 154900, timestamp: '2026-01-13T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 152900, timestamp: '2026-01-16T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 151900, timestamp: '2026-01-20T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 149900, timestamp: '2026-01-25T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 148900, timestamp: '2026-01-30T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 147900, timestamp: '2026-02-03T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 146900, timestamp: '2026-02-07T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'amazon_india', price: 144900, timestamp: '2026-02-12T00:00:00Z', availability: 'in_stock' },

  { product_id: 'p1', platform: 'flipkart', price: 156900, timestamp: '2026-01-13T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'flipkart', price: 154900, timestamp: '2026-01-20T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'flipkart', price: 151900, timestamp: '2026-01-27T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'flipkart', price: 149900, timestamp: '2026-02-03T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'flipkart', price: 147900, timestamp: '2026-02-10T00:00:00Z', availability: 'in_stock' },
  { product_id: 'p1', platform: 'flipkart', price: 146900, timestamp: '2026-02-12T00:00:00Z', availability: 'in_stock' },
];

// Helper functions
export const getNextFestival = (): Festival | undefined => {
  return sampleFestivals.sort((a, b) => a.days_until - b.days_until)[0];
};

export const getPriceHistory = (productId: string): PriceRecord[] => {
  return samplePriceHistory.filter(record => record.product_id === productId);
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

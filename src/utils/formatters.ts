/**
 * Format a number as Indian Rupees with proper formatting
 * Uses Indian number system with lakhs and crores
 * @param amount - The amount to format
 * @returns Formatted string with ₹ symbol
 */
export function formatINR(amount: number): string {
  if (amount === 0) return '₹0';
  if (!amount || isNaN(amount)) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Convert to string and split into integer and decimal parts
  const parts = absAmount.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Apply Indian number system formatting
  // Last 3 digits, then groups of 2
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  // Remove unnecessary decimals if they are .00
  const result = decimalPart === '00' ? formatted : `${formatted}.${decimalPart}`;

  return `${isNegative ? '-' : ''}₹${result}`;
}

/**
 * Format a number as a percentage with sign
 * @param value - The percentage value (e.g., 15 for 15%)
 * @returns Formatted percentage string with sign
 */
export function formatPercentage(value: number): string {
  if (!value || isNaN(value)) return '0%';

  const sign = value > 0 ? '+' : '';
  const rounded = Math.round(value * 10) / 10; // Round to 1 decimal place

  return `${sign}${rounded}%`;
}

/**
 * Format an ISO date string to a human-readable format
 * @param isoString - ISO 8601 date string
 * @returns Formatted date string (e.g., "12 Feb 2026")
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return '';
  }
}

/**
 * Format an ISO date string to relative time
 * @param isoString - ISO 8601 date string
 * @returns Relative time string (e.g., "2 hours ago", "1 day ago")
 */
export function formatRelativeTime(isoString: string): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    const now = new Date();

    if (isNaN(date.getTime())) return '';

    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    }
  } catch {
    return '';
  }
}

/**
 * Get an emoji icon for a product category
 * @param category - Product category name
 * @returns Emoji representing the category
 */
export function getCategoryIcon(category: string): string {
  const normalizedCategory = category.toLowerCase().trim();

  const categoryMap: Record<string, string> = {
    electronics: '📱',
    mobile: '📱',
    smartphone: '📱',
    phone: '📱',
    laptop: '💻',
    computer: '💻',
    gaming: '🎮',
    headphones: '🎧',
    audio: '🎧',
    earbuds: '🎧',
    camera: '📷',
    photography: '📷',
    watch: '⌚',
    smartwatch: '⌚',
    wearable: '⌚',
    tv: '📺',
    television: '📺',
    appliances: '🏠',
    home: '🏠',
    kitchen: '🍳',
    fashion: '👕',
    clothing: '👕',
    apparel: '👕',
    shoes: '👟',
    footwear: '👟',
    sports: '⚽',
    fitness: '💪',
    books: '📚',
    reading: '📚',
    toys: '🧸',
    kids: '🧸',
    beauty: '💄',
    cosmetics: '💄',
    health: '🏥',
    medicine: '💊',
    furniture: '🛋️',
    decor: '🖼️',
    tools: '🔧',
    automotive: '🚗',
    car: '🚗',
    grocery: '🛒',
    food: '🍔',
    pet: '🐾',
    pets: '🐾',
    music: '🎵',
    jewelry: '💎',
    bag: '👜',
    luggage: '🧳',
  };

  // Check for exact match first
  if (categoryMap[normalizedCategory]) {
    return categoryMap[normalizedCategory];
  }

  // Check for partial matches
  for (const [key, icon] of Object.entries(categoryMap)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return icon;
    }
  }

  // Default icon
  return '📦';
}

/**
 * Get a color associated with an e-commerce platform
 * @param platform - Platform name
 * @returns Hex color code
 */
export function getPlatformColor(platform: string): string {
  const normalizedPlatform = platform.toLowerCase().trim();

  const platformColors: Record<string, string> = {
    amazon: '#FF9900',
    amazon_india: '#FF9900',
    flipkart: '#2874F0',
    myntra: '#FF3F6C',
    snapdeal: '#E40046',
    paytm: '#00BAF2',
    meesho: '#9F2089',
    ajio: '#212121',
    tata_cliq: '#C41E3A',
    shopsy: '#1976D2',
    jiomart: '#0057A2',
    bigbasket: '#84C225',
    default: '#757575',
  };

  return platformColors[normalizedPlatform] || platformColors.default;
}

/**
 * Get the display name for a platform
 * @param platform - Platform identifier
 * @returns Human-readable platform name
 */
export function getPlatformName(platform: string): string {
  const normalizedPlatform = platform.toLowerCase().trim();

  const platformNames: Record<string, string> = {
    amazon: 'Amazon',
    amazon_india: 'Amazon India',
    flipkart: 'Flipkart',
    myntra: 'Myntra',
    snapdeal: 'Snapdeal',
    paytm: 'Paytm Mall',
    meesho: 'Meesho',
    ajio: 'AJIO',
    tata_cliq: 'Tata CLiQ',
    shopsy: 'Shopsy',
    jiomart: 'JioMart',
    bigbasket: 'BigBasket',
  };

  return platformNames[normalizedPlatform] || platform;
}

/**
 * Get an arrow emoji representing a trend direction
 * @param trend - Trend direction ('rising', 'falling', 'stable', 'up', 'down')
 * @returns Arrow emoji
 */
export function getTrendIcon(trend: string): string {
  const normalizedTrend = trend.toLowerCase().trim();

  const trendIcons: Record<string, string> = {
    rising: '📈',
    up: '⬆️',
    increase: '⬆️',
    high: '⬆️',
    falling: '📉',
    down: '⬇️',
    decrease: '⬇️',
    low: '⬇️',
    stable: '➡️',
    neutral: '➡️',
    flat: '➡️',
    unchanged: '➡️',
  };

  return trendIcons[normalizedTrend] || '➡️';
}

/**
 * Calculate savings between original and current price
 * @param original - Original price
 * @param current - Current price
 * @returns Object with savings amount and percentage
 */
export function calculateSavings(
  original: number,
  current: number
): { amount: number; percentage: number } {
  if (!original || original <= 0 || !current || current < 0) {
    return { amount: 0, percentage: 0 };
  }

  const amount = original - current;
  const percentage = (amount / original) * 100;

  return {
    amount: Math.max(0, amount),
    percentage: Math.max(0, Math.round(percentage * 10) / 10),
  };
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format a number in a compact form (e.g., 1.2K, 3.5M)
 * @param num - Number to format
 * @returns Compact formatted string
 */
export function formatCompactNumber(num: number): string {
  if (!num || isNaN(num)) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 10000000) {
    // Crores (10 million)
    return `${sign}${(absNum / 10000000).toFixed(1)}Cr`;
  } else if (absNum >= 100000) {
    // Lakhs (100 thousand)
    return `${sign}${(absNum / 100000).toFixed(1)}L`;
  } else if (absNum >= 1000) {
    // Thousands
    return `${sign}${(absNum / 1000).toFixed(1)}K`;
  }

  return `${sign}${absNum}`;
}

/**
 * Get rating color based on rating value
 * @param rating - Rating value (0-5)
 * @returns Color hex code
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return '#388e3c'; // Green
  if (rating >= 4.0) return '#689f38'; // Light green
  if (rating >= 3.5) return '#fbc02d'; // Yellow
  if (rating >= 3.0) return '#f57c00'; // Orange
  return '#d32f2f'; // Red
}

/**
 * Format availability status to human-readable text
 * @param availability - Availability status
 * @returns Human-readable availability text
 */
export function formatAvailability(availability: string): string {
  const statusMap: Record<string, string> = {
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    limited_stock: 'Limited Stock',
    pre_order: 'Pre-Order',
    coming_soon: 'Coming Soon',
  };

  return statusMap[availability.toLowerCase()] || availability;
}

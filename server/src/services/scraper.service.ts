/**
 * Price Scraping Simulator Service
 * Simulates real-time price updates from various e-commerce platforms
 */

import { getDb } from '../config/database';
import { getFestivalAdjustedPrice } from '../ml/seasonality';

interface PlatformCharacteristics {
  volatility: number; // Daily price change volatility
  discountFrequency: number; // How often platform offers discounts (0-1)
  stockoutRate: number; // Probability of going out of stock (0-1)
}

const PLATFORM_CHARACTERISTICS: Record<string, PlatformCharacteristics> = {
  amazon: {
    volatility: 0.015, // 1.5% daily volatility
    discountFrequency: 0.3,
    stockoutRate: 0.02
  },
  flipkart: {
    volatility: 0.02, // 2% daily volatility
    discountFrequency: 0.35,
    stockoutRate: 0.03
  },
  myntra: {
    volatility: 0.025,
    discountFrequency: 0.4,
    stockoutRate: 0.04
  },
  ajio: {
    volatility: 0.03,
    discountFrequency: 0.35,
    stockoutRate: 0.05
  },
  meesho: {
    volatility: 0.04, // 4% - more volatile
    discountFrequency: 0.5,
    stockoutRate: 0.08
  },
  snapdeal: {
    volatility: 0.035,
    discountFrequency: 0.45,
    stockoutRate: 0.06
  },
  tatacliq: {
    volatility: 0.02,
    discountFrequency: 0.3,
    stockoutRate: 0.03
  },
  reliance: {
    volatility: 0.018,
    discountFrequency: 0.25,
    stockoutRate: 0.02
  }
};

/**
 * Generate new price using random walk with bounds
 */
function generateNewPrice(
  currentPrice: number,
  platform: string,
  basePrice: number,
  category: string,
  _lastUpdated: Date
): {
  newPrice: number;
  changePercent: number;
  discount: number;
} {
  const characteristics = PLATFORM_CHARACTERISTICS[platform.toLowerCase()] || {
    volatility: 0.02,
    discountFrequency: 0.3,
    stockoutRate: 0.03
  };

  // Apply festival discount
  const today = new Date();
  const festivalAdjustment = getFestivalAdjustedPrice(currentPrice, today, category);

  let newPrice = currentPrice;

  // If there's an active festival discount, apply it with some randomness
  if (festivalAdjustment.festival) {
    const discountRange = 0.1; // ±10% variation in discount
    const actualDiscount =
      festivalAdjustment.discount * (1 + (Math.random() - 0.5) * discountRange);
    newPrice = basePrice * (1 - actualDiscount / 100);
  } else {
    // Random walk based on platform volatility
    const randomChange = (Math.random() - 0.5) * 2; // -1 to 1
    const priceChange = currentPrice * characteristics.volatility * randomChange;
    newPrice = currentPrice + priceChange;

    // Random discount events
    if (Math.random() < characteristics.discountFrequency * 0.1) {
      // 10% of discountFrequency per update
      const discountPercent = 5 + Math.random() * 15; // 5-20% discount
      newPrice = newPrice * (1 - discountPercent / 100);
    }

    // Price bounds: never go below 50% or above 120% of base price
    const minPrice = basePrice * 0.5;
    const maxPrice = basePrice * 1.2;
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
  }

  // Round to nearest rupee
  newPrice = Math.round(newPrice);

  const changePercent = ((newPrice - currentPrice) / currentPrice) * 100;
  const discount = ((basePrice - newPrice) / basePrice) * 100;

  return {
    newPrice,
    changePercent: Math.round(changePercent * 100) / 100,
    discount: Math.max(0, Math.round(discount * 100) / 100)
  };
}

/**
 * Simulate price update for a single product on a platform
 */
export async function simulatePriceUpdate(
  productId: string,
  platform: string
): Promise<{
  success: boolean;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  stockStatus: string;
}> {
  const db = getDb();

  // Get current platform price
  const platformPrice = db
    .prepare(
      `
    SELECT pp.*, p.category, p.base_price
    FROM platform_prices pp
    JOIN products p ON pp.product_id = p.id
    WHERE pp.product_id = ? AND pp.platform = ?
  `
    )
    .get(productId, platform) as any;

  if (!platformPrice) {
    return {
      success: false,
      oldPrice: 0,
      newPrice: 0,
      changePercent: 0,
      stockStatus: 'unknown'
    };
  }

  const oldPrice = platformPrice.price;
  const basePrice = platformPrice.base_price;
  const category = platformPrice.category;
  const lastUpdated = new Date(platformPrice.updated_at);

  // Generate new price
  const priceUpdate = generateNewPrice(oldPrice, platform, basePrice, category, lastUpdated);

  // Determine stock status
  const characteristics = PLATFORM_CHARACTERISTICS[platform.toLowerCase()] || {
    volatility: 0.02,
    discountFrequency: 0.3,
    stockoutRate: 0.03
  };

  let stockStatus = platformPrice.stock_status;

  // Random stock status changes
  if (stockStatus === 'in_stock' && Math.random() < characteristics.stockoutRate) {
    stockStatus = 'out_of_stock';
  } else if (stockStatus === 'out_of_stock' && Math.random() < 0.3) {
    // 30% chance to restock
    stockStatus = 'in_stock';
  } else if (stockStatus === 'in_stock' && Math.random() < 0.05) {
    stockStatus = 'low_stock';
  }

  // Update platform_prices table
  const now = new Date().toISOString();
  db.prepare(
    `
    UPDATE platform_prices
    SET price = ?,
        stock_status = ?,
        updated_at = ?
    WHERE product_id = ? AND platform = ?
  `
  ).run(priceUpdate.newPrice, stockStatus, now, productId, platform);

  // Record in price_history only if price changed significantly (>1%)
  if (Math.abs(priceUpdate.changePercent) > 0.5) {
    db.prepare(
      `
      INSERT INTO price_history (product_id, platform, price, recorded_at)
      VALUES (?, ?, ?, ?)
    `
    ).run(productId, platform, priceUpdate.newPrice, now);
  }

  return {
    success: true,
    oldPrice,
    newPrice: priceUpdate.newPrice,
    changePercent: priceUpdate.changePercent,
    stockStatus
  };
}

/**
 * Update prices for all products across all platforms
 */
export async function updateAllPrices(): Promise<{
  totalUpdated: number;
  priceChanges: number;
  stockChanges: number;
  errors: number;
}> {
  const db = getDb();

  // Get all platform prices
  const platformPrices = db
    .prepare(
      `
    SELECT pp.product_id, pp.platform
    FROM platform_prices pp
    ORDER BY RANDOM()
  `
    )
    .all() as any[];

  let totalUpdated = 0;
  let priceChanges = 0;
  let stockChanges = 0;
  let errors = 0;

  for (const pp of platformPrices) {
    try {
      const result = await simulatePriceUpdate(pp.product_id, pp.platform);

      if (result.success) {
        totalUpdated++;

        if (Math.abs(result.changePercent) > 0.5) {
          priceChanges++;
        }

        if (result.stockStatus !== 'in_stock') {
          stockChanges++;
        }
      } else {
        errors++;
      }
    } catch (error) {
      console.error(`Error updating price for ${pp.product_id} on ${pp.platform}:`, error);
      errors++;
    }
  }

  console.log(
    `[Scraper] Updated ${totalUpdated} prices. Changes: ${priceChanges}, Stock issues: ${stockChanges}, Errors: ${errors}`
  );

  return {
    totalUpdated,
    priceChanges,
    stockChanges,
    errors
  };
}

/**
 * Update prices for a batch of products (for scheduled updates)
 */
export async function updatePriceBatch(batchSize: number = 50): Promise<{
  updated: number;
  errors: number;
}> {
  const db = getDb();

  // Get oldest updated platform prices
  const platformPrices = db
    .prepare(
      `
    SELECT product_id, platform
    FROM platform_prices
    ORDER BY updated_at ASC
    LIMIT ?
  `
    )
    .all(batchSize) as any[];

  let updated = 0;
  let errors = 0;

  for (const pp of platformPrices) {
    try {
      const result = await simulatePriceUpdate(pp.product_id, pp.platform);
      if (result.success) {
        updated++;
      } else {
        errors++;
      }
    } catch (error) {
      console.error(`Error updating price for ${pp.product_id}:`, error);
      errors++;
    }
  }

  return { updated, errors };
}

/**
 * Force a specific price for testing
 */
export async function setPrice(
  productId: string,
  platform: string,
  price: number
): Promise<boolean> {
  const db = getDb();

  try {
    const now = new Date().toISOString();

    db.prepare(
      `
      UPDATE platform_prices
      SET price = ?, updated_at = ?
      WHERE product_id = ? AND platform = ?
    `
    ).run(price, now, productId, platform);

    db.prepare(
      `
      INSERT INTO price_history (product_id, platform, price, recorded_at)
      VALUES (?, ?, ?, ?)
    `
    ).run(productId, platform, price, now);

    return true;
  } catch (error) {
    console.error('Error setting price:', error);
    return false;
  }
}

/**
 * Simulate a flash sale on specific platform
 */
export async function simulateFlashSale(
  platform: string,
  category: string,
  discountPercent: number,
  durationMinutes: number
): Promise<number> {
  const db = getDb();

  // Get products in category from platform
  const products = db
    .prepare(
      `
    SELECT pp.product_id, pp.platform, pp.price, p.base_price
    FROM platform_prices pp
    JOIN products p ON pp.product_id = p.id
    WHERE pp.platform = ? AND p.category = ?
  `
    )
    .all(platform, category) as any[];

  let updated = 0;

  for (const product of products) {
    const salePrice = Math.round(product.price * (1 - discountPercent / 100));

    await setPrice(product.product_id, product.platform, salePrice);
    updated++;
  }

  console.log(
    `[Flash Sale] Applied ${discountPercent}% discount to ${updated} products on ${platform} for ${durationMinutes} minutes`
  );

  return updated;
}

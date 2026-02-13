import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

interface Product {
  id: string;
  product_name: string;
  brand: string;
  category: string;
}

// Platform availability rules
const getPlatformsForProduct = (product: Product): string[] => {
  const { category, brand } = product;
  const name = product.product_name.toLowerCase();

  // Base platforms
  const amazonFlipkart = ['amazon_india', 'flipkart'];
  const allMajor = [...amazonFlipkart, 'tatacliq', 'jiomart'];
  const budget = [...allMajor, 'meesho', 'snapdeal'];
  const fashion = ['myntra', 'ajio', 'tatacliq'];

  // Determine which platforms carry this product
  if (category === 'Smartphones') {
    if (name.includes('iphone') || name.includes('samsung galaxy s') || name.includes('oneplus 12') ||
        name.includes('pixel 8 pro') || name.includes('xiaomi 14')) {
      return allMajor; // Premium phones
    }
    return budget; // Budget/mid-range phones
  }

  if (category === 'Laptops') {
    if (name.includes('macbook') || name.includes('rog') || name.includes('xps') || name.includes('spectre')) {
      return allMajor; // Premium laptops
    }
    return [...allMajor, 'snapdeal']; // Budget laptops
  }

  if (category === 'Audio') {
    if (name.includes('boat') || name.includes('realme')) {
      return [...budget, ...fashion]; // Budget audio on all platforms including fashion
    }
    if (name.includes('airpods') || name.includes('sony wh') || name.includes('bose') || name.includes('sennheiser')) {
      return [...allMajor, ...fashion]; // Premium audio on major + fashion
    }
    return allMajor; // Mid-range audio
  }

  if (category === 'Wearables') {
    if (name.includes('apple watch') || name.includes('galaxy watch') || name.includes('garmin')) {
      return [...allMajor, ...fashion]; // Premium wearables on major + fashion
    }
    return [...budget, ...fashion]; // Budget wearables everywhere including fashion
  }

  if (category === 'Cameras') {
    return allMajor; // Cameras only on major platforms
  }

  if (category === 'TVs' || category === 'Home') {
    return allMajor; // TVs and home appliances on major platforms
  }

  return amazonFlipkart; // Default
};

// Price mapping for products (base prices in INR)
const getBasePrice = (product: Product): number => {
  const name = product.product_name.toLowerCase();
  const { category } = product;

  // Smartphones
  if (category === 'Smartphones') {
    if (name.includes('iphone 15 pro max')) return 159900;
    if (name.includes('iphone 15') && !name.includes('pro')) return 79900;
    if (name.includes('iphone 14')) return 69900;
    if (name.includes('galaxy s24 ultra')) return 129999;
    if (name.includes('galaxy s24') && !name.includes('ultra')) return 79999;
    if (name.includes('galaxy a55')) return 39999;
    if (name.includes('oneplus 12')) return 64999;
    if (name.includes('nord ce4')) return 24999;
    if (name.includes('pixel 8 pro')) return 106999;
    if (name.includes('pixel 8a')) return 52999;
    if (name.includes('nothing phone')) return 23999;
    if (name.includes('xiaomi 14')) return 69999;
    if (name.includes('realme gt 6')) return 35999;
    if (name.includes('oppo reno')) return 36999;
    if (name.includes('vivo v30')) return 41999;
  }

  // Laptops
  if (category === 'Laptops') {
    if (name.includes('macbook air m3')) return 114900;
    if (name.includes('macbook pro m3')) return 169900;
    if (name.includes('xps 13')) return 119990;
    if (name.includes('inspiron 16')) return 63990;
    if (name.includes('spectre x360')) return 149990;
    if (name.includes('pavilion 15')) return 54990;
    if (name.includes('thinkpad x1')) return 139990;
    if (name.includes('ideapad slim')) return 52990;
    if (name.includes('rog strix')) return 179990;
    if (name.includes('nitro 5')) return 84990;
  }

  // Audio
  if (category === 'Audio') {
    if (name.includes('wh-1000xm5')) return 29990;
    if (name.includes('wf-1000xm5')) return 19990;
    if (name.includes('airpods pro 2')) return 24900;
    if (name.includes('airpods max')) return 59900;
    if (name.includes('tune 770')) return 5999;
    if (name.includes('charge 5')) return 9999;
    if (name.includes('airdopes 141')) return 999;
    if (name.includes('rockerz 550')) return 1499;
    if (name.includes('momentum 4')) return 29990;
    if (name.includes('quietcomfort ultra')) return 34990;
  }

  // Wearables
  if (category === 'Wearables') {
    if (name.includes('watch ultra 2')) return 89900;
    if (name.includes('watch se')) return 29900;
    if (name.includes('galaxy watch 6')) return 31999;
    if (name.includes('galaxy fit 3')) return 3999;
    if (name.includes('fitbit charge 6')) return 12999;
    if (name.includes('garmin venu')) return 42990;
    if (name.includes('colorfit pro')) return 2299;
    if (name.includes('wave elevate')) return 1799;
  }

  // Cameras
  if (category === 'Cameras') {
    if (name.includes('eos r6')) return 239995;
    if (name.includes('z6 iii')) return 249950;
    if (name.includes('a7 iv')) return 229990;
    if (name.includes('gopro hero 12')) return 37990;
    if (name.includes('pocket 3')) return 46990;
  }

  // TVs
  if (category === 'TVs') {
    if (name.includes('samsung crystal')) return 46990;
    if (name.includes('lg oled')) return 134990;
    if (name.includes('bravia xr 65')) return 159990;
    if (name.includes('mi tv 5x')) return 36999;
    if (name.includes('tcl c745')) return 44990;
  }

  // Home
  if (category === 'Home') {
    if (name.includes('dyson v15')) return 49900;
    if (name.includes('roomba j7')) return 44900;
    if (name.includes('philips air')) return 11995;
    if (name.includes('aquaguard')) return 13499;
    if (name.includes('havells')) return 6499;
  }

  return 10000; // Default
};

export const seedPrices = (db: Database.Database) => {
  console.log('Seeding platform prices...');

  // Get all products
  const products = db.prepare('SELECT * FROM products').all() as Product[];

  const prices: any[] = [];

  for (const product of products) {
    const basePrice = getBasePrice(product);
    const platforms = getPlatformsForProduct(product);

    for (const platform of platforms) {
      // Platform-specific price variations
      let priceMultiplier = 1.0;
      let discountMultiplier = 1.0;

      switch (platform) {
        case 'amazon_india':
          priceMultiplier = 0.95 + Math.random() * 0.10; // -5% to +5%
          discountMultiplier = 0.90 + Math.random() * 0.05; // 5-10% discount
          break;
        case 'flipkart':
          priceMultiplier = 0.93 + Math.random() * 0.12; // -7% to +5%
          discountMultiplier = 0.88 + Math.random() * 0.07; // 5-12% discount
          break;
        case 'myntra':
          priceMultiplier = 0.97 + Math.random() * 0.06; // -3% to +3%
          discountMultiplier = 0.85 + Math.random() * 0.10; // 5-15% discount
          break;
        case 'ajio':
          priceMultiplier = 0.96 + Math.random() * 0.08; // -4% to +4%
          discountMultiplier = 0.87 + Math.random() * 0.08; // 5-13% discount
          break;
        case 'tatacliq':
          priceMultiplier = 0.98 + Math.random() * 0.05; // -2% to +3%
          discountMultiplier = 0.92 + Math.random() * 0.05; // 3-8% discount
          break;
        case 'jiomart':
          priceMultiplier = 0.94 + Math.random() * 0.08; // -6% to +2%
          discountMultiplier = 0.90 + Math.random() * 0.06; // 4-10% discount
          break;
        case 'meesho':
          priceMultiplier = 0.90 + Math.random() * 0.08; // -10% to -2%
          discountMultiplier = 0.85 + Math.random() * 0.10; // 5-15% discount
          break;
        case 'snapdeal':
          priceMultiplier = 0.92 + Math.random() * 0.10; // -8% to +2%
          discountMultiplier = 0.88 + Math.random() * 0.08; // 4-12% discount
          break;
      }

      const originalPrice = Math.round(basePrice * priceMultiplier);
      const currentPrice = Math.round(originalPrice * discountMultiplier);

      // Availability
      const availabilityRoll = Math.random();
      let availability = 'in_stock';
      if (availabilityRoll > 0.95) availability = 'out_of_stock';
      else if (availabilityRoll > 0.85) availability = 'limited';

      // Rating and reviews
      const baseRating = 3.5 + Math.random() * 1.4; // 3.5 to 4.9
      const rating = Math.round(baseRating * 10) / 10;

      // Premium products get more reviews
      const isPremium = basePrice > 50000;
      const minReviews = isPremium ? 500 : 50;
      const maxReviews = isPremium ? 50000 : 5000;
      const reviewCount = Math.floor(minReviews + Math.random() * (maxReviews - minReviews));

      // Generate URLs
      const productSlug = product.product_name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
      const productUrl = `https://${platform}.in/product/${productSlug}`;
      const affiliateUrl = `https://${platform}.in/aff/${productSlug}?ref=retailiq`;

      prices.push({
        id: uuidv4(),
        product_id: product.id,
        platform,
        current_price: currentPrice,
        original_price: originalPrice,
        availability,
        product_url: productUrl,
        affiliate_url: affiliateUrl,
        rating,
        review_count: reviewCount,
        last_checked: new Date().toISOString(),
      });
    }
  }

  // Batch insert
  const insert = db.prepare(`
    INSERT INTO platform_prices (
      id, product_id, platform, current_price, original_price,
      availability, product_url, affiliate_url, rating, review_count, last_checked
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((prices) => {
    for (const price of prices) {
      insert.run(
        price.id,
        price.product_id,
        price.platform,
        price.current_price,
        price.original_price,
        price.availability,
        price.product_url,
        price.affiliate_url,
        price.rating,
        price.review_count,
        price.last_checked
      );
    }
  });

  insertMany(prices);

  console.log(`✓ Seeded ${prices.length} platform prices`);
  return prices;
};

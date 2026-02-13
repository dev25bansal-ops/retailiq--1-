# RetailIQ Database Seeds

This directory contains seed files to populate the RetailIQ database with production-quality sample data.

## Overview

The seeding process creates:
- **55 products** across 7 categories
- **~250 platform prices** across 8 e-commerce platforms
- **~27,000+ price history records** (6 months of daily data)
- **29 festivals** across multiple platforms
- **4 subscription plans** (Free, Basic, Pro, Enterprise)
- **7 promo codes**

## Running Seeds

From the server directory:

```bash
npm run seed
```

Or using ts-node directly:

```bash
npx ts-node database/seeds/seed.ts
```

## Seed Files

### 1. products.ts
Seeds 55 products across categories:
- **Smartphones (15)**: iPhone, Samsung, OnePlus, Google Pixel, Xiaomi, etc.
- **Laptops (10)**: MacBook, Dell, HP, Lenovo, ASUS, Acer
- **Audio (10)**: Sony, Apple AirPods, JBL, boAt, Sennheiser, Bose
- **Wearables (8)**: Apple Watch, Samsung, Fitbit, Garmin, Noise, boAt
- **Cameras (5)**: Canon, Nikon, Sony, GoPro, DJI
- **TVs (5)**: Samsung, LG, Sony, Mi, TCL
- **Home (5)**: Dyson, iRobot, Philips, Eureka Forbes, Havells

Each product includes:
- Complete specifications (JSON)
- Realistic images (Unsplash)
- Category tags
- Brand information

### 2. prices.ts
Creates platform prices for products across 8 platforms:
- amazon_india
- flipkart
- myntra
- ajio
- tatacliq
- jiomart
- meesho
- snapdeal

**Platform Distribution Rules:**
- Premium products (iPhone, MacBook, high-end cameras): amazon_india, flipkart, tatacliq, jiomart
- Budget products: All platforms including meesho and snapdeal
- Fashion-adjacent (wearables, audio): Also available on myntra and ajio

**Realistic Pricing (INR):**
- Flagship phones: ₹50,000 - ₹1,70,000
- Budget phones: ₹10,000 - ₹25,000
- Laptops: ₹40,000 - ₹2,50,000
- Premium audio: ₹5,000 - ₹60,000
- Budget audio: ₹500 - ₹3,000
- Wearables: ₹2,000 - ₹90,000
- Cameras: ₹30,000 - ₹2,50,000
- TVs: ₹25,000 - ₹2,00,000
- Home appliances: ₹5,000 - ₹50,000

Each price includes:
- Current price and original price (for discounts)
- Availability status (in_stock, limited, out_of_stock)
- Ratings (3.5 - 4.9)
- Review counts (realistic distribution)
- Product URLs and affiliate URLs

### 3. price-history.ts
Generates 6 months of daily price history with:

**Price Movement Algorithm:**
- Random walk with daily volatility (1.5-3%)
- Slight downward trend for electronics
- Festival-based price drops:
  - Republic Day: 15% off
  - Valentine's: 10% off
  - Holi: 12% off
  - Summer Sale: 18% off
  - Prime Day: 25% off
  - Independence Day: 20% off
  - Onam: 15% off
  - Navratri: 18% off
  - Diwali: 30% off (biggest sale)
  - Black Friday: 25% off
  - Year End: 22% off

**Performance:**
- Uses batch inserts (1000 records per transaction)
- Generates ~27,000+ records
- Takes approximately 5-15 seconds

### 4. festivals.ts
Seeds 29+ festival events including:
- Platform-specific sales (Amazon Great Indian Festival, Flipkart Big Billion Days)
- Traditional festivals (Diwali, Holi, Onam, Navratri)
- Shopping events (Prime Day, Black Friday, Year End Sales)
- Seasonal sales (Summer, Valentine's)

Each festival includes:
- Date ranges
- Expected discount percentages
- Applicable categories
- Confidence scores (0-1)
- Historical average discounts
- Banner images

### 5. plans.ts
Creates 4 subscription tiers and promo codes:

**Plans:**
- **Free**: ₹0, 10 products, 10 alerts, 30 days history
- **Basic**: ₹999/mo (₹9,590/yr), 50 products, 50 alerts, 90 days history
- **Pro**: ₹2,999/mo (₹28,790/yr), unlimited products & alerts, 365 days history, API access
- **Enterprise**: ₹9,999/mo (₹95,990/yr), unlimited everything, team access, dedicated support

**Promo Codes:**
- SAVE10: 10% off all plans
- FIRST20: 20% off for first-time users
- DIWALI30: 30% off (seasonal)
- RETAILIQ50: 50% off first month
- NEWYEAR2025: 25% off
- LAUNCH100: ₹100 flat discount
- STUDENT15: 15% off for students

## Database Schema

The seeds populate these tables:
- products
- platform_prices
- price_history
- festivals
- subscription_plans
- promo_codes

Foreign key constraints are handled properly with cascading deletes.

## Performance Notes

- **Total execution time**: ~10-20 seconds
- **Batch inserts** used for price history
- **Transactional safety** for data consistency
- **Progress indicators** during long operations

## Data Characteristics

### Realistic Price Variations
- Platform-specific pricing (Flipkart typically 2-7% cheaper than Amazon)
- Budget platforms (Meesho, Snapdeal) 8-10% cheaper
- Fashion platforms (Myntra, Ajio) have higher markups

### Availability Distribution
- 85% in_stock
- 10% limited stock
- 5% out_of_stock

### Review Distribution
- Premium products: 500-50,000 reviews
- Budget products: 50-5,000 reviews
- Average rating: 3.5-4.9 stars

## API Endpoints

After seeding, test these endpoints:

```bash
# Get all products
GET /api/products

# Get products with filters
GET /api/products?category=Smartphones&minPrice=10000&maxPrice=50000

# Search products
GET /api/products/search?q=iphone

# Get trending products
GET /api/products/trending

# Compare products
GET /api/products/compare?ids=uuid1,uuid2,uuid3

# Get single product
GET /api/products/:id

# Get product prices
GET /api/products/:id/prices

# Get price history
GET /api/products/:id/history?platform=amazon_india&startDate=2024-08-01
```

## Troubleshooting

### "Module not found" errors
Make sure you're running from the server directory:
```bash
cd server
npm run seed
```

### "Database locked" errors
Close any other connections to the database and try again.

### Performance issues
The price history seeding might take 10-20 seconds. This is normal for ~27,000+ records.

## Customization

To add more products:
1. Edit `products.ts` and add to the products array
2. Ensure `getBasePrice()` in `prices.ts` handles the new product
3. Run `npm run seed` to regenerate

To modify price history range:
1. Edit `generateDates()` in `price-history.ts`
2. Adjust the `startDate.setMonth()` call
3. Re-run seeds

## Production Use

For production:
1. Review all seeded data
2. Replace placeholder images with real product images
3. Update product specifications
4. Adjust pricing based on actual market data
5. Configure real affiliate URLs
6. Set up automated price scrapers to update platform_prices

## License

This seed data is for development and testing purposes only. Product names and brands are property of their respective owners.

import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

interface PlatformPrice {
  id: string;
  product_id: string;
  platform: string;
  current_price: number;
}

// Festival periods for price drops (2024-2025 data)
const festivalPeriods = [
  { name: 'Republic Day', start: '2024-01-20', end: '2024-01-28', discount: 0.15 },
  { name: 'Valentine', start: '2024-02-10', end: '2024-02-14', discount: 0.10 },
  { name: 'Holi', start: '2024-03-20', end: '2024-03-26', discount: 0.12 },
  { name: 'Summer', start: '2024-05-01', end: '2024-05-15', discount: 0.18 },
  { name: 'Prime Day', start: '2024-07-15', end: '2024-07-16', discount: 0.25 },
  { name: 'Independence', start: '2024-08-08', end: '2024-08-16', discount: 0.20 },
  { name: 'Onam', start: '2024-08-25', end: '2024-09-05', discount: 0.15 },
  { name: 'Navratri', start: '2024-10-01', end: '2024-10-10', discount: 0.18 },
  { name: 'Diwali', start: '2024-10-15', end: '2024-11-05', discount: 0.30 },
  { name: 'Black Friday', start: '2024-11-24', end: '2024-11-30', discount: 0.25 },
  { name: 'Year End', start: '2024-12-20', end: '2025-01-02', discount: 0.22 },
];

// Check if date falls in any festival period
const getFestivalDiscount = (dateStr: string): number => {
  for (const festival of festivalPeriods) {
    if (dateStr >= festival.start && dateStr <= festival.end) {
      // Random discount within festival range (50-100% of max discount)
      return festival.discount * (0.5 + Math.random() * 0.5);
    }
  }
  return 0;
};

// Generate dates for the last 6 months
const generateDates = (): string[] => {
  const dates: string[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const seedPriceHistory = (db: Database.Database) => {
  console.log('Seeding price history (this may take a moment)...');

  // Get all platform prices
  const platformPrices = db.prepare('SELECT * FROM platform_prices').all() as PlatformPrice[];

  const dates = generateDates();
  const historyRecords: any[] = [];

  let recordCount = 0;
  const batchSize = 1000;

  // Prepare insert statement
  const insert = db.prepare(`
    INSERT INTO price_history (id, product_id, platform, price, recorded_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertBatch = db.transaction((records: any[]) => {
    for (const record of records) {
      insert.run(
        record.id,
        record.product_id,
        record.platform,
        record.price,
        record.recorded_at
      );
    }
  });

  // Generate price history for each platform price
  for (const platformPrice of platformPrices) {
    // Starting price (6 months ago) - slightly higher than current
    const currentPrice = platformPrice.current_price;
    const startingPrice = currentPrice * (1.05 + Math.random() * 0.15); // 5-20% higher

    let price = startingPrice;
    const volatility = 0.015 + Math.random() * 0.015; // 1.5-3% daily volatility
    const trend = -0.002; // Slight downward trend for electronics

    for (const date of dates) {
      // Apply festival discount
      const festivalDiscount = getFestivalDiscount(date);

      // Random walk with trend
      const dailyChange = (Math.random() - 0.5) * 2 * volatility;
      price = price * (1 + dailyChange + trend);

      // Apply festival discount if applicable
      let finalPrice = price;
      if (festivalDiscount > 0) {
        finalPrice = price * (1 - festivalDiscount);
      }

      // Ensure price doesn't go too low or too high
      const minPrice = currentPrice * 0.7; // Not less than 70% of current
      const maxPrice = startingPrice * 1.1; // Not more than 110% of starting
      finalPrice = Math.max(minPrice, Math.min(maxPrice, finalPrice));

      // Round to nearest rupee
      finalPrice = Math.round(finalPrice);

      historyRecords.push({
        id: uuidv4(),
        product_id: platformPrice.product_id,
        platform: platformPrice.platform,
        price: finalPrice,
        recorded_at: `${date}T12:00:00Z`,
      });

      recordCount++;

      // Batch insert every 1000 records
      if (historyRecords.length >= batchSize) {
        insertBatch(historyRecords);
        historyRecords.length = 0; // Clear array
        process.stdout.write(`\r  Inserted ${recordCount} records...`);
      }
    }
  }

  // Insert remaining records
  if (historyRecords.length > 0) {
    insertBatch(historyRecords);
  }

  console.log(`\n✓ Seeded ${recordCount} price history records`);
  return recordCount;
};

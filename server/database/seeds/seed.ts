import Database from 'better-sqlite3';
import path from 'path';
import { seedProducts } from './products';
import { seedPrices } from './prices';
import { seedPriceHistory } from './price-history';
import { seedFestivals } from './festivals';
import { seedPlans } from './plans';

// Create a simple database connection for seeding
const DB_PATH = path.join(__dirname, '../retailiq.db');

const getDb = (): Database.Database => {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
};

const clearData = (db: Database.Database) => {
  console.log('Clearing existing data...');

  // Disable foreign keys temporarily
  db.pragma('foreign_keys = OFF');

  // Clear tables in correct order (respecting foreign keys)
  db.prepare('DELETE FROM price_history').run();
  db.prepare('DELETE FROM platform_prices').run();
  db.prepare('DELETE FROM price_alerts').run();
  db.prepare('DELETE FROM watchlist').run();
  db.prepare('DELETE FROM notifications').run();
  db.prepare('DELETE FROM products').run();
  db.prepare('DELETE FROM festivals').run();
  db.prepare('DELETE FROM promo_codes').run();
  db.prepare('DELETE FROM subscription_plans').run();
  db.prepare('DELETE FROM users').run();

  // Re-enable foreign keys
  db.pragma('foreign_keys = ON');

  console.log('✓ Cleared existing data\n');
};

const runSeeds = async () => {
  console.log('=================================');
  console.log('RetailIQ Database Seeding');
  console.log('=================================\n');

  const startTime = Date.now();
  let db: Database.Database | null = null;

  try {
    db = getDb();

    // Clear existing data
    clearData(db);

    // Track total records
    let totalRecords = 0;

    // Seed products
    console.log('1/5 Seeding products...');
    const products = seedProducts(db);
    totalRecords += products.length;
    console.log('');

    // Seed platform prices
    console.log('2/5 Seeding platform prices...');
    const prices = seedPrices(db);
    totalRecords += prices.length;
    console.log('');

    // Seed price history (this takes the longest)
    console.log('3/5 Seeding price history...');
    const historyCount = seedPriceHistory(db);
    totalRecords += historyCount;
    console.log('');

    // Seed festivals
    console.log('4/5 Seeding festivals...');
    const festivals = seedFestivals(db);
    totalRecords += festivals.length;
    console.log('');

    // Seed subscription plans and promo codes
    console.log('5/5 Seeding subscription plans...');
    const { plans, promoCodes } = seedPlans(db);
    totalRecords += plans.length + promoCodes.length;
    console.log('');

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('=================================');
    console.log('Seeding Summary:');
    console.log('=================================');
    console.log(`Products:         ${products.length}`);
    console.log(`Platform Prices:  ${prices.length}`);
    console.log(`Price History:    ${historyCount.toLocaleString()}`);
    console.log(`Festivals:        ${festivals.length}`);
    console.log(`Plans:            ${plans.length}`);
    console.log(`Promo Codes:      ${promoCodes.length}`);
    console.log(`---------------------------------`);
    console.log(`Total Records:    ${totalRecords.toLocaleString()}`);
    console.log(`Duration:         ${duration}s`);
    console.log('=================================\n');

    console.log('✅ Database seeding completed successfully!\n');

    // Close database connection
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    if (db) {
      db.close();
    }
    process.exit(1);
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds();
}

export { runSeeds };

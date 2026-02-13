"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeds = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const products_1 = require("./products");
const prices_1 = require("./prices");
const price_history_1 = require("./price-history");
const festivals_1 = require("./festivals");
const plans_1 = require("./plans");
const DB_PATH = path_1.default.join(__dirname, '../retailiq.db');
const getDb = () => {
    const db = new better_sqlite3_1.default(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    return db;
};
const clearData = (db) => {
    console.log('Clearing existing data...');
    db.pragma('foreign_keys = OFF');
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
    db.pragma('foreign_keys = ON');
    console.log('✓ Cleared existing data\n');
};
const runSeeds = async () => {
    console.log('=================================');
    console.log('RetailIQ Database Seeding');
    console.log('=================================\n');
    const startTime = Date.now();
    let db = null;
    try {
        db = getDb();
        clearData(db);
        let totalRecords = 0;
        console.log('1/5 Seeding products...');
        const products = (0, products_1.seedProducts)(db);
        totalRecords += products.length;
        console.log('');
        console.log('2/5 Seeding platform prices...');
        const prices = (0, prices_1.seedPrices)(db);
        totalRecords += prices.length;
        console.log('');
        console.log('3/5 Seeding price history...');
        const historyCount = (0, price_history_1.seedPriceHistory)(db);
        totalRecords += historyCount;
        console.log('');
        console.log('4/5 Seeding festivals...');
        const festivals = (0, festivals_1.seedFestivals)(db);
        totalRecords += festivals.length;
        console.log('');
        console.log('5/5 Seeding subscription plans...');
        const { plans, promoCodes } = (0, plans_1.seedPlans)(db);
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
        db.close();
        process.exit(0);
    }
    catch (error) {
        console.error('\n❌ Error during seeding:', error);
        if (db) {
            db.close();
        }
        process.exit(1);
    }
};
exports.runSeeds = runSeeds;
if (require.main === module) {
    runSeeds();
}
//# sourceMappingURL=seed.js.map
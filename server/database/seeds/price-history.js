"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPriceHistory = void 0;
const uuid_1 = require("uuid");
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
const getFestivalDiscount = (dateStr) => {
    for (const festival of festivalPeriods) {
        if (dateStr >= festival.start && dateStr <= festival.end) {
            return festival.discount * (0.5 + Math.random() * 0.5);
        }
    }
    return 0;
};
const generateDates = () => {
    const dates = [];
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
const seedPriceHistory = (db) => {
    console.log('Seeding price history (this may take a moment)...');
    const platformPrices = db.prepare('SELECT * FROM platform_prices').all();
    const dates = generateDates();
    const historyRecords = [];
    let recordCount = 0;
    const batchSize = 1000;
    const insert = db.prepare(`
    INSERT INTO price_history (id, product_id, platform, price, recorded_at)
    VALUES (?, ?, ?, ?, ?)
  `);
    const insertBatch = db.transaction((records) => {
        for (const record of records) {
            insert.run(record.id, record.product_id, record.platform, record.price, record.recorded_at);
        }
    });
    for (const platformPrice of platformPrices) {
        const currentPrice = platformPrice.current_price;
        const startingPrice = currentPrice * (1.05 + Math.random() * 0.15);
        let price = startingPrice;
        const volatility = 0.015 + Math.random() * 0.015;
        const trend = -0.002;
        for (const date of dates) {
            const festivalDiscount = getFestivalDiscount(date);
            const dailyChange = (Math.random() - 0.5) * 2 * volatility;
            price = price * (1 + dailyChange + trend);
            let finalPrice = price;
            if (festivalDiscount > 0) {
                finalPrice = price * (1 - festivalDiscount);
            }
            const minPrice = currentPrice * 0.7;
            const maxPrice = startingPrice * 1.1;
            finalPrice = Math.max(minPrice, Math.min(maxPrice, finalPrice));
            finalPrice = Math.round(finalPrice);
            historyRecords.push({
                id: (0, uuid_1.v4)(),
                product_id: platformPrice.product_id,
                platform: platformPrice.platform,
                price: finalPrice,
                recorded_at: `${date}T12:00:00Z`,
            });
            recordCount++;
            if (historyRecords.length >= batchSize) {
                insertBatch(historyRecords);
                historyRecords.length = 0;
                process.stdout.write(`\r  Inserted ${recordCount} records...`);
            }
        }
    }
    if (historyRecords.length > 0) {
        insertBatch(historyRecords);
    }
    console.log(`\n✓ Seeded ${recordCount} price history records`);
    return recordCount;
};
exports.seedPriceHistory = seedPriceHistory;
//# sourceMappingURL=price-history.js.map
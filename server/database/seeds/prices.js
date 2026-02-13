"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPrices = void 0;
const uuid_1 = require("uuid");
const getPlatformsForProduct = (product) => {
    const { category, brand } = product;
    const name = product.product_name.toLowerCase();
    const amazonFlipkart = ['amazon_india', 'flipkart'];
    const allMajor = [...amazonFlipkart, 'tatacliq', 'jiomart'];
    const budget = [...allMajor, 'meesho', 'snapdeal'];
    const fashion = ['myntra', 'ajio', 'tatacliq'];
    if (category === 'Smartphones') {
        if (name.includes('iphone') || name.includes('samsung galaxy s') || name.includes('oneplus 12') ||
            name.includes('pixel 8 pro') || name.includes('xiaomi 14')) {
            return allMajor;
        }
        return budget;
    }
    if (category === 'Laptops') {
        if (name.includes('macbook') || name.includes('rog') || name.includes('xps') || name.includes('spectre')) {
            return allMajor;
        }
        return [...allMajor, 'snapdeal'];
    }
    if (category === 'Audio') {
        if (name.includes('boat') || name.includes('realme')) {
            return [...budget, ...fashion];
        }
        if (name.includes('airpods') || name.includes('sony wh') || name.includes('bose') || name.includes('sennheiser')) {
            return [...allMajor, ...fashion];
        }
        return allMajor;
    }
    if (category === 'Wearables') {
        if (name.includes('apple watch') || name.includes('galaxy watch') || name.includes('garmin')) {
            return [...allMajor, ...fashion];
        }
        return [...budget, ...fashion];
    }
    if (category === 'Cameras') {
        return allMajor;
    }
    if (category === 'TVs' || category === 'Home') {
        return allMajor;
    }
    return amazonFlipkart;
};
const getBasePrice = (product) => {
    const name = product.product_name.toLowerCase();
    const { category } = product;
    if (category === 'Smartphones') {
        if (name.includes('iphone 15 pro max'))
            return 159900;
        if (name.includes('iphone 15') && !name.includes('pro'))
            return 79900;
        if (name.includes('iphone 14'))
            return 69900;
        if (name.includes('galaxy s24 ultra'))
            return 129999;
        if (name.includes('galaxy s24') && !name.includes('ultra'))
            return 79999;
        if (name.includes('galaxy a55'))
            return 39999;
        if (name.includes('oneplus 12'))
            return 64999;
        if (name.includes('nord ce4'))
            return 24999;
        if (name.includes('pixel 8 pro'))
            return 106999;
        if (name.includes('pixel 8a'))
            return 52999;
        if (name.includes('nothing phone'))
            return 23999;
        if (name.includes('xiaomi 14'))
            return 69999;
        if (name.includes('realme gt 6'))
            return 35999;
        if (name.includes('oppo reno'))
            return 36999;
        if (name.includes('vivo v30'))
            return 41999;
    }
    if (category === 'Laptops') {
        if (name.includes('macbook air m3'))
            return 114900;
        if (name.includes('macbook pro m3'))
            return 169900;
        if (name.includes('xps 13'))
            return 119990;
        if (name.includes('inspiron 16'))
            return 63990;
        if (name.includes('spectre x360'))
            return 149990;
        if (name.includes('pavilion 15'))
            return 54990;
        if (name.includes('thinkpad x1'))
            return 139990;
        if (name.includes('ideapad slim'))
            return 52990;
        if (name.includes('rog strix'))
            return 179990;
        if (name.includes('nitro 5'))
            return 84990;
    }
    if (category === 'Audio') {
        if (name.includes('wh-1000xm5'))
            return 29990;
        if (name.includes('wf-1000xm5'))
            return 19990;
        if (name.includes('airpods pro 2'))
            return 24900;
        if (name.includes('airpods max'))
            return 59900;
        if (name.includes('tune 770'))
            return 5999;
        if (name.includes('charge 5'))
            return 9999;
        if (name.includes('airdopes 141'))
            return 999;
        if (name.includes('rockerz 550'))
            return 1499;
        if (name.includes('momentum 4'))
            return 29990;
        if (name.includes('quietcomfort ultra'))
            return 34990;
    }
    if (category === 'Wearables') {
        if (name.includes('watch ultra 2'))
            return 89900;
        if (name.includes('watch se'))
            return 29900;
        if (name.includes('galaxy watch 6'))
            return 31999;
        if (name.includes('galaxy fit 3'))
            return 3999;
        if (name.includes('fitbit charge 6'))
            return 12999;
        if (name.includes('garmin venu'))
            return 42990;
        if (name.includes('colorfit pro'))
            return 2299;
        if (name.includes('wave elevate'))
            return 1799;
    }
    if (category === 'Cameras') {
        if (name.includes('eos r6'))
            return 239995;
        if (name.includes('z6 iii'))
            return 249950;
        if (name.includes('a7 iv'))
            return 229990;
        if (name.includes('gopro hero 12'))
            return 37990;
        if (name.includes('pocket 3'))
            return 46990;
    }
    if (category === 'TVs') {
        if (name.includes('samsung crystal'))
            return 46990;
        if (name.includes('lg oled'))
            return 134990;
        if (name.includes('bravia xr 65'))
            return 159990;
        if (name.includes('mi tv 5x'))
            return 36999;
        if (name.includes('tcl c745'))
            return 44990;
    }
    if (category === 'Home') {
        if (name.includes('dyson v15'))
            return 49900;
        if (name.includes('roomba j7'))
            return 44900;
        if (name.includes('philips air'))
            return 11995;
        if (name.includes('aquaguard'))
            return 13499;
        if (name.includes('havells'))
            return 6499;
    }
    return 10000;
};
const seedPrices = (db) => {
    console.log('Seeding platform prices...');
    const products = db.prepare('SELECT * FROM products').all();
    const prices = [];
    for (const product of products) {
        const basePrice = getBasePrice(product);
        const platforms = getPlatformsForProduct(product);
        for (const platform of platforms) {
            let priceMultiplier = 1.0;
            let discountMultiplier = 1.0;
            switch (platform) {
                case 'amazon_india':
                    priceMultiplier = 0.95 + Math.random() * 0.10;
                    discountMultiplier = 0.90 + Math.random() * 0.05;
                    break;
                case 'flipkart':
                    priceMultiplier = 0.93 + Math.random() * 0.12;
                    discountMultiplier = 0.88 + Math.random() * 0.07;
                    break;
                case 'myntra':
                    priceMultiplier = 0.97 + Math.random() * 0.06;
                    discountMultiplier = 0.85 + Math.random() * 0.10;
                    break;
                case 'ajio':
                    priceMultiplier = 0.96 + Math.random() * 0.08;
                    discountMultiplier = 0.87 + Math.random() * 0.08;
                    break;
                case 'tatacliq':
                    priceMultiplier = 0.98 + Math.random() * 0.05;
                    discountMultiplier = 0.92 + Math.random() * 0.05;
                    break;
                case 'jiomart':
                    priceMultiplier = 0.94 + Math.random() * 0.08;
                    discountMultiplier = 0.90 + Math.random() * 0.06;
                    break;
                case 'meesho':
                    priceMultiplier = 0.90 + Math.random() * 0.08;
                    discountMultiplier = 0.85 + Math.random() * 0.10;
                    break;
                case 'snapdeal':
                    priceMultiplier = 0.92 + Math.random() * 0.10;
                    discountMultiplier = 0.88 + Math.random() * 0.08;
                    break;
            }
            const originalPrice = Math.round(basePrice * priceMultiplier);
            const currentPrice = Math.round(originalPrice * discountMultiplier);
            const availabilityRoll = Math.random();
            let availability = 'in_stock';
            if (availabilityRoll > 0.95)
                availability = 'out_of_stock';
            else if (availabilityRoll > 0.85)
                availability = 'limited';
            const baseRating = 3.5 + Math.random() * 1.4;
            const rating = Math.round(baseRating * 10) / 10;
            const isPremium = basePrice > 50000;
            const minReviews = isPremium ? 500 : 50;
            const maxReviews = isPremium ? 50000 : 5000;
            const reviewCount = Math.floor(minReviews + Math.random() * (maxReviews - minReviews));
            const productSlug = product.product_name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
            const productUrl = `https://${platform}.in/product/${productSlug}`;
            const affiliateUrl = `https://${platform}.in/aff/${productSlug}?ref=retailiq`;
            prices.push({
                id: (0, uuid_1.v4)(),
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
    const insert = db.prepare(`
    INSERT INTO platform_prices (
      id, product_id, platform, current_price, original_price,
      availability, product_url, affiliate_url, rating, review_count, last_checked
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertMany = db.transaction((prices) => {
        for (const price of prices) {
            insert.run(price.id, price.product_id, price.platform, price.current_price, price.original_price, price.availability, price.product_url, price.affiliate_url, price.rating, price.review_count, price.last_checked);
        }
    });
    insertMany(prices);
    console.log(`✓ Seeded ${prices.length} platform prices`);
    return prices;
};
exports.seedPrices = seedPrices;
//# sourceMappingURL=prices.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPlans = void 0;
const uuid_1 = require("uuid");
const seedPlans = (db) => {
    console.log('Seeding subscription plans and promo codes...');
    const plans = [
        {
            id: (0, uuid_1.v4)(),
            name: 'Free',
            price_monthly: 0,
            price_yearly: 0,
            max_products: 10,
            max_alerts: 10,
            price_history_days: 30,
            api_access: 0,
            team_access: 0,
            features: JSON.stringify([
                '10 products tracking',
                '10 price alerts',
                '30 days price history',
                'Basic notifications',
                'Web access',
            ]),
        },
        {
            id: (0, uuid_1.v4)(),
            name: 'Basic',
            price_monthly: 999,
            price_yearly: 9590,
            max_products: 50,
            max_alerts: 50,
            price_history_days: 90,
            api_access: 0,
            team_access: 0,
            features: JSON.stringify([
                '50 products tracking',
                '50 price alerts',
                '90 days price history',
                'Priority notifications',
                'Email alerts',
                'Festival predictions',
                'Price comparison',
                'Ad-free experience',
            ]),
        },
        {
            id: (0, uuid_1.v4)(),
            name: 'Pro',
            price_monthly: 2999,
            price_yearly: 28790,
            max_products: null,
            max_alerts: null,
            price_history_days: 365,
            api_access: 1,
            team_access: 0,
            features: JSON.stringify([
                'Unlimited products tracking',
                'Unlimited price alerts',
                '1 year price history',
                'API access (1000 calls/day)',
                'Advanced analytics',
                'Custom reports',
                'WhatsApp alerts',
                'SMS alerts',
                'Festival predictions',
                'Price trends & forecasting',
                'Export data (CSV, Excel)',
                'Priority support',
            ]),
        },
        {
            id: (0, uuid_1.v4)(),
            name: 'Enterprise',
            price_monthly: 9999,
            price_yearly: 95990,
            max_products: null,
            max_alerts: null,
            price_history_days: null,
            api_access: 1,
            team_access: 1,
            features: JSON.stringify([
                'Everything in Pro',
                'Unlimited price history',
                'API access (unlimited)',
                'Team collaboration (up to 10 users)',
                'Dedicated account manager',
                'Custom integrations',
                'White-label options',
                'Advanced ML predictions',
                'Custom alerts & workflows',
                'Bulk product import',
                'Priority 24/7 support',
                'SLA guarantee',
            ]),
        },
    ];
    const promoCodes = [
        {
            id: (0, uuid_1.v4)(),
            code: 'SAVE10',
            discount_type: 'percentage',
            discount_value: 10,
            valid_from: '2025-01-01',
            valid_until: '2025-12-31',
            max_uses: null,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic', 'Pro', 'Enterprise']),
            is_active: 1,
        },
        {
            id: (0, uuid_1.v4)(),
            code: 'FIRST20',
            discount_type: 'percentage',
            discount_value: 20,
            valid_from: '2025-01-01',
            valid_until: '2025-12-31',
            max_uses: null,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic', 'Pro', 'Enterprise']),
            is_active: 1,
        },
        {
            id: (0, uuid_1.v4)(),
            code: 'DIWALI30',
            discount_type: 'percentage',
            discount_value: 30,
            valid_from: '2025-10-01',
            valid_until: '2025-11-15',
            max_uses: 1000,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic', 'Pro', 'Enterprise']),
            is_active: 1,
        },
        {
            id: (0, uuid_1.v4)(),
            code: 'RETAILIQ50',
            discount_type: 'percentage',
            discount_value: 50,
            valid_from: '2025-01-01',
            valid_until: '2025-03-31',
            max_uses: 500,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic', 'Pro']),
            is_active: 1,
        },
        {
            id: (0, uuid_1.v4)(),
            code: 'NEWYEAR2025',
            discount_type: 'percentage',
            discount_value: 25,
            valid_from: '2024-12-20',
            valid_until: '2025-01-31',
            max_uses: 2000,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic', 'Pro', 'Enterprise']),
            is_active: 1,
        },
        {
            id: (0, uuid_1.v4)(),
            code: 'LAUNCH100',
            discount_type: 'fixed',
            discount_value: 100,
            valid_from: '2025-01-01',
            valid_until: '2025-02-28',
            max_uses: 100,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic']),
            is_active: 1,
        },
        {
            id: (0, uuid_1.v4)(),
            code: 'STUDENT15',
            discount_type: 'percentage',
            discount_value: 15,
            valid_from: '2025-01-01',
            valid_until: '2025-12-31',
            max_uses: null,
            current_uses: 0,
            applicable_plans: JSON.stringify(['Basic', 'Pro']),
            is_active: 1,
        },
    ];
    const insertPlan = db.prepare(`
    INSERT INTO subscription_plans (
      id, name, price_monthly, price_yearly, max_products, max_alerts,
      price_history_days, api_access, team_access, features
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertPlans = db.transaction((plans) => {
        for (const plan of plans) {
            insertPlan.run(plan.id, plan.name, plan.price_monthly, plan.price_yearly, plan.max_products, plan.max_alerts, plan.price_history_days, plan.api_access, plan.team_access, plan.features);
        }
    });
    insertPlans(plans);
    const insertPromo = db.prepare(`
    INSERT INTO promo_codes (
      id, code, discount_type, discount_value, valid_from, valid_until,
      max_uses, current_uses, applicable_plans, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const insertPromos = db.transaction((promoCodes) => {
        for (const promo of promoCodes) {
            insertPromo.run(promo.id, promo.code, promo.discount_type, promo.discount_value, promo.valid_from, promo.valid_until, promo.max_uses, promo.current_uses, promo.applicable_plans, promo.is_active);
        }
    });
    insertPromos(promoCodes);
    console.log(`✓ Seeded ${plans.length} subscription plans`);
    console.log(`✓ Seeded ${promoCodes.length} promo codes`);
    return { plans, promoCodes };
};
exports.seedPlans = seedPlans;
//# sourceMappingURL=plans.js.map
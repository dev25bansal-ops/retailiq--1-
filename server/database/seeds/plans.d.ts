import Database from 'better-sqlite3';
export declare const seedPlans: (db: Database.Database) => {
    plans: ({
        id: any;
        name: string;
        price_monthly: number;
        price_yearly: number;
        max_products: number;
        max_alerts: number;
        price_history_days: number;
        api_access: number;
        team_access: number;
        features: string;
    } | {
        id: any;
        name: string;
        price_monthly: number;
        price_yearly: number;
        max_products: null;
        max_alerts: null;
        price_history_days: number;
        api_access: number;
        team_access: number;
        features: string;
    } | {
        id: any;
        name: string;
        price_monthly: number;
        price_yearly: number;
        max_products: null;
        max_alerts: null;
        price_history_days: null;
        api_access: number;
        team_access: number;
        features: string;
    })[];
    promoCodes: ({
        id: any;
        code: string;
        discount_type: string;
        discount_value: number;
        valid_from: string;
        valid_until: string;
        max_uses: null;
        current_uses: number;
        applicable_plans: string;
        is_active: number;
    } | {
        id: any;
        code: string;
        discount_type: string;
        discount_value: number;
        valid_from: string;
        valid_until: string;
        max_uses: number;
        current_uses: number;
        applicable_plans: string;
        is_active: number;
    })[];
};
//# sourceMappingURL=plans.d.ts.map
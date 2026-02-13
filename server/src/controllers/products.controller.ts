import { Request, Response } from 'express';
import { getDatabase } from '../config/database';
import { Product, PlatformPrice, PriceHistory, ApiResponse, PaginationMeta } from '../types';

// Alias for consistency
const getDb = getDatabase;

// Helper function to parse JSON fields
const parseJsonField = (field: string | null | undefined, defaultValue: any = null) => {
  if (!field) return defaultValue;
  try {
    return JSON.parse(field);
  } catch {
    return defaultValue;
  }
};

// GET /api/products - List products with pagination and filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const db = getDb();

    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const platform = req.query.platform as string;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const brand = req.query.brand as string;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const order = (req.query.order as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];

    if (category) {
      conditions.push('p.category = ?');
      params.push(category);
    }

    if (brand) {
      conditions.push('p.brand = ?');
      params.push(brand);
    }

    if (search) {
      conditions.push('(p.product_name LIKE ? OR p.brand LIKE ? OR p.tags LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Price filtering requires joining with platform_prices
    let priceJoin = '';
    if (minPrice || maxPrice || platform) {
      priceJoin = `
        INNER JOIN platform_prices pp ON p.id = pp.product_id
      `;
      if (platform) {
        conditions.push('pp.platform = ?');
        params.push(platform);
      }
      if (minPrice) {
        conditions.push('pp.current_price >= ?');
        params.push(minPrice);
      }
      if (maxPrice) {
        conditions.push('pp.current_price <= ?');
        params.push(maxPrice);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      ${priceJoin}
      ${whereClause}
    `;
    const countResult = db.prepare(countQuery).get(...params) as { total: number };
    const total = countResult.total;

    // Determine sort column
    let sortColumn = 'p.created_at';
    if (sortBy === 'name') sortColumn = 'p.product_name';
    else if (sortBy === 'brand') sortColumn = 'p.brand';
    else if (sortBy === 'price' && priceJoin) sortColumn = 'pp.current_price';

    // Get products
    const productsQuery = `
      SELECT DISTINCT p.*
      FROM products p
      ${priceJoin}
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;
    const products = db.prepare(productsQuery).all(...params, limit, offset) as Product[];

    // Get prices for each product
    const productIds = products.map(p => p.id);
    let productsWithPrices = products.map(p => ({
      ...p,
      specifications: parseJsonField(p.specifications as string, {}),
      tags: parseJsonField(p.tags as string, []),
      prices: [] as PlatformPrice[],
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
    }));

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const pricesQuery = `
        SELECT * FROM platform_prices
        WHERE product_id IN (${placeholders})
        ORDER BY current_price ASC
      `;
      const allPrices = db.prepare(pricesQuery).all(...productIds) as PlatformPrice[];

      // Group prices by product_id
      const pricesByProduct = allPrices.reduce((acc, price) => {
        if (!acc[price.product_id]) acc[price.product_id] = [];
        acc[price.product_id].push(price);
        return acc;
      }, {} as Record<string, PlatformPrice[]>);

      // Attach prices to products and calculate min/max/avg
      productsWithPrices = productsWithPrices.map(product => {
        const prices = pricesByProduct[product.id] || [];
        const priceValues = prices.map(p => p.current_price);

        return {
          ...product,
          prices,
          minPrice: prices.length > 0 ? Math.min(...priceValues) : 0,
          maxPrice: prices.length > 0 ? Math.max(...priceValues) : 0,
          avgPrice: prices.length > 0 ? priceValues.reduce((a, b) => a + b, 0) / prices.length : 0,
        };
      });
    }

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    const response: ApiResponse<typeof productsWithPrices> = {
      success: true,
      data: productsWithPrices,
      meta,
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
};

// GET /api/products/trending - Top products by rating and discount
export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const limit = parseInt(req.query.limit as string) || 10;

    const query = `
      SELECT
        p.*,
        pp.current_price,
        pp.original_price,
        pp.rating,
        pp.review_count,
        pp.platform,
        CASE
          WHEN pp.original_price > 0 THEN
            ((pp.original_price - pp.current_price) / pp.original_price * 100)
          ELSE 0
        END as discount_percentage
      FROM products p
      INNER JOIN platform_prices pp ON p.id = pp.product_id
      WHERE pp.rating IS NOT NULL
        AND pp.original_price IS NOT NULL
        AND pp.original_price > pp.current_price
      ORDER BY
        (pp.rating * 0.4 +
         ((pp.original_price - pp.current_price) / pp.original_price * 100) * 0.6) DESC,
        pp.review_count DESC
      LIMIT ?
    `;

    const results = db.prepare(query).all(limit) as any[];

    const trending = results.map(row => ({
      id: row.id,
      product_name: row.product_name,
      brand: row.brand,
      category: row.category,
      image_url: row.image_url,
      specifications: parseJsonField(row.specifications, {}),
      tags: parseJsonField(row.tags, []),
      current_price: row.current_price,
      original_price: row.original_price,
      discount_percentage: Math.round(row.discount_percentage * 10) / 10,
      rating: row.rating,
      review_count: row.review_count,
      platform: row.platform,
    }));

    return res.json({
      success: true,
      data: trending,
    });
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch trending products',
    });
  }
};

// GET /api/products/search - Full text search
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const q = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const searchPattern = `%${q.trim()}%`;

    // Count total results
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products
      WHERE product_name LIKE ?
        OR brand LIKE ?
        OR category LIKE ?
        OR tags LIKE ?
    `;
    const countResult = db.prepare(countQuery).get(
      searchPattern, searchPattern, searchPattern, searchPattern
    ) as { total: number };

    // Get products
    const query = `
      SELECT * FROM products
      WHERE product_name LIKE ?
        OR brand LIKE ?
        OR category LIKE ?
        OR tags LIKE ?
      ORDER BY
        CASE
          WHEN product_name LIKE ? THEN 1
          WHEN brand LIKE ? THEN 2
          ELSE 3
        END,
        product_name ASC
      LIMIT ? OFFSET ?
    `;

    const products = db.prepare(query).all(
      searchPattern, searchPattern, searchPattern, searchPattern,
      searchPattern, searchPattern,
      limit, offset
    ) as Product[];

    // Get prices for products
    const productIds = products.map(p => p.id);
    let productsWithPrices = products.map(p => ({
      ...p,
      specifications: parseJsonField(p.specifications as string, {}),
      tags: parseJsonField(p.tags as string, []),
      prices: [] as PlatformPrice[],
      minPrice: 0,
      maxPrice: 0,
    }));

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const pricesQuery = `
        SELECT * FROM platform_prices
        WHERE product_id IN (${placeholders})
        ORDER BY current_price ASC
      `;
      const allPrices = db.prepare(pricesQuery).all(...productIds) as PlatformPrice[];

      const pricesByProduct = allPrices.reduce((acc, price) => {
        if (!acc[price.product_id]) acc[price.product_id] = [];
        acc[price.product_id].push(price);
        return acc;
      }, {} as Record<string, PlatformPrice[]>);

      productsWithPrices = productsWithPrices.map(product => {
        const prices = pricesByProduct[product.id] || [];
        const priceValues = prices.map(p => p.current_price);

        return {
          ...product,
          prices,
          minPrice: prices.length > 0 ? Math.min(...priceValues) : 0,
          maxPrice: prices.length > 0 ? Math.max(...priceValues) : 0,
        };
      });
    }

    const meta: PaginationMeta = {
      page,
      limit,
      total: countResult.total,
      totalPages: Math.ceil(countResult.total / limit),
    };

    return res.json({
      success: true,
      data: productsWithPrices,
      meta,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search products',
    });
  }
};

// GET /api/products/compare?ids=id1,id2,id3 - Compare multiple products
export const compareProducts = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const ids = (req.query.ids as string)?.split(',').filter(Boolean) || [];

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No product IDs provided',
      });
    }

    if (ids.length > 5) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 5 products can be compared at once',
      });
    }

    const placeholders = ids.map(() => '?').join(',');

    // Get products
    const productsQuery = `
      SELECT * FROM products
      WHERE id IN (${placeholders})
    `;
    const products = db.prepare(productsQuery).all(...ids) as Product[];

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No products found',
      });
    }

    // Get all prices for these products
    const pricesQuery = `
      SELECT * FROM platform_prices
      WHERE product_id IN (${placeholders})
      ORDER BY platform, current_price
    `;
    const prices = db.prepare(pricesQuery).all(...ids) as PlatformPrice[];

    // Group prices by product
    const pricesByProduct = prices.reduce((acc, price) => {
      if (!acc[price.product_id]) acc[price.product_id] = [];
      acc[price.product_id].push(price);
      return acc;
    }, {} as Record<string, PlatformPrice[]>);

    // Build comparison data
    const comparison = products.map(product => {
      const productPrices = pricesByProduct[product.id] || [];
      const priceValues = productPrices.map(p => p.current_price);
      const specs = parseJsonField(product.specifications as string, {});

      return {
        ...product,
        specifications: specs,
        tags: parseJsonField(product.tags as string, []),
        prices: productPrices,
        priceStats: {
          minPrice: priceValues.length > 0 ? Math.min(...priceValues) : 0,
          maxPrice: priceValues.length > 0 ? Math.max(...priceValues) : 0,
          avgPrice: priceValues.length > 0 ? priceValues.reduce((a, b) => a + b, 0) / priceValues.length : 0,
          platformCount: productPrices.length,
        },
        bestDeal: productPrices.length > 0 ? productPrices.reduce((best, curr) =>
          curr.current_price < best.current_price ? curr : best
        ) : null,
      };
    });

    return res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to compare products',
    });
  }
};

// GET /api/products/:id - Single product with all platform prices
export const getProductById = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;

    // Get product
    const productQuery = `SELECT * FROM products WHERE id = ?`;
    const product = db.prepare(productQuery).get(id) as Product | undefined;

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Get all platform prices
    const pricesQuery = `
      SELECT * FROM platform_prices
      WHERE product_id = ?
      ORDER BY current_price ASC
    `;
    const prices = db.prepare(pricesQuery).all(id) as PlatformPrice[];

    const priceValues = prices.map(p => p.current_price);

    const productWithPrices = {
      ...product,
      specifications: parseJsonField(product.specifications as string, {}),
      tags: parseJsonField(product.tags as string, []),
      prices,
      priceStats: {
        minPrice: prices.length > 0 ? Math.min(...priceValues) : 0,
        maxPrice: prices.length > 0 ? Math.max(...priceValues) : 0,
        avgPrice: prices.length > 0 ? priceValues.reduce((a, b) => a + b, 0) / prices.length : 0,
        platformCount: prices.length,
      },
      bestDeal: prices.length > 0 ? prices[0] : null,
    };

    return res.json({
      success: true,
      data: productWithPrices,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
};

// GET /api/products/:id/prices - Cross-platform prices for a product
export const getProductPrices = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;

    // Verify product exists
    const productExists = db.prepare('SELECT id FROM products WHERE id = ?').get(id);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Get all platform prices
    const query = `
      SELECT * FROM platform_prices
      WHERE product_id = ?
      ORDER BY current_price ASC
    `;
    const prices = db.prepare(query).all(id) as PlatformPrice[];

    // Calculate savings compared to highest price
    const maxPrice = prices.length > 0 ? Math.max(...prices.map(p => p.current_price)) : 0;

    const pricesWithSavings = prices.map(price => ({
      ...price,
      savings: maxPrice - price.current_price,
      savingsPercent: maxPrice > 0 ? ((maxPrice - price.current_price) / maxPrice * 100) : 0,
      discount: price.original_price && price.original_price > price.current_price
        ? ((price.original_price - price.current_price) / price.original_price * 100)
        : 0,
    }));

    return res.json({
      success: true,
      data: pricesWithSavings,
    });
  } catch (error) {
    console.error('Error fetching product prices:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch product prices',
    });
  }
};

// GET /api/products/:id/history - Price history with date range filter
export const getProductPriceHistory = async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const platform = req.query.platform as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    // Verify product exists
    const productExists = db.prepare('SELECT id FROM products WHERE id = ?').get(id);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Build query with filters
    const conditions: string[] = ['product_id = ?'];
    const params: any[] = [id];

    if (platform) {
      conditions.push('platform = ?');
      params.push(platform);
    }

    if (startDate) {
      conditions.push('recorded_at >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('recorded_at <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT * FROM price_history
      WHERE ${whereClause}
      ORDER BY recorded_at ASC
    `;

    const history = db.prepare(query).all(...params) as PriceHistory[];

    // Group by platform
    const historyByPlatform = history.reduce((acc, record) => {
      if (!acc[record.platform]) {
        acc[record.platform] = [];
      }
      acc[record.platform].push({
        price: record.price,
        recorded_at: record.recorded_at,
      });
      return acc;
    }, {} as Record<string, Array<{ price: number; recorded_at: string }>>);

    // Calculate statistics for each platform
    const statistics = Object.entries(historyByPlatform).map(([platform, data]) => {
      const prices = data.map(d => d.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const currentPrice = prices[prices.length - 1];
      const firstPrice = prices[0];
      const priceChange = currentPrice - firstPrice;
      const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice * 100) : 0;

      return {
        platform,
        minPrice: Math.round(minPrice * 100) / 100,
        maxPrice: Math.round(maxPrice * 100) / 100,
        avgPrice: Math.round(avgPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        priceChange: Math.round(priceChange * 100) / 100,
        priceChangePercent: Math.round(priceChangePercent * 100) / 100,
        dataPoints: data.length,
      };
    });

    return res.json({
      success: true,
      data: {
        history: historyByPlatform,
        statistics,
      },
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch price history',
    });
  }
};

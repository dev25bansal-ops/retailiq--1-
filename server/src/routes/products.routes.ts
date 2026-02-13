import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getTrendingProducts,
  searchProducts,
  compareProducts,
  getProductPrices,
  getProductPriceHistory,
} from '../controllers/products.controller';

const router = Router();

// GET /api/products - List products with pagination and filters
router.get('/', getProducts);

// GET /api/products/trending - Top products by rating and discount
router.get('/trending', getTrendingProducts);

// GET /api/products/search - Full text search
router.get('/search', searchProducts);

// GET /api/products/compare - Compare multiple products
router.get('/compare', compareProducts);

// GET /api/products/:id - Single product with all platform prices
router.get('/:id', getProductById);

// GET /api/products/:id/prices - Cross-platform prices for a product
router.get('/:id/prices', getProductPrices);

// GET /api/products/:id/history - Price history with date range filter
router.get('/:id/history', getProductPriceHistory);

export default router;

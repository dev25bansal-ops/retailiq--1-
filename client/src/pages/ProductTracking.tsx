import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Stack,
  Pagination,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ProductCard,
  SearchBar,
  ProductCardSkeleton,
  EmptyState,
} from '../components/common';
import { productsApi, watchlistApi } from '../api';
import type { Product, ProductCategory, Platform } from '../types';

const ProductTracking: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<ProductCategory | 'all'>(
    (searchParams.get('category') as ProductCategory) || 'all'
  );
  const [platform, setPlatform] = useState<Platform | 'all'>(
    (searchParams.get('platform') as Platform) || 'all'
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(Number(searchParams.get('minRating')) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const categories: (ProductCategory | 'all')[] = [
    'all',
    'Electronics',
    'Smartphones',
    'Laptops',
    'Audio',
    'Wearables',
    'Cameras',
    'TVs',
    'Gaming',
    'Home',
    'Fashion',
    'Beauty',
    'Kitchen',
  ];

  const platforms: (Platform | 'all')[] = [
    'all',
    'amazon_india',
    'flipkart',
    'myntra',
    'ajio',
    'tatacliq',
    'jiomart',
    'meesho',
    'snapdeal',
  ];

  useEffect(() => {
    loadProducts();
  }, [searchQuery, category, platform, minPrice, maxPrice, minRating, sortBy, page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {
        page,
        limit: 20,
        sortBy,
      };

      if (category !== 'all') filters.category = category;
      if (platform !== 'all') filters.platform = platform;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (minRating) filters.minRating = minRating;

      let response;
      if (searchQuery.trim()) {
        response = await productsApi.searchProducts(searchQuery, filters);
      } else {
        response = await productsApi.getProducts(filters);
      }

      setProducts(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    updateURL({ q: query, page: '1' });
  };

  const handleCategoryChange = (newCategory: ProductCategory | 'all') => {
    setCategory(newCategory);
    setPage(1);
    updateURL({ category: newCategory === 'all' ? '' : newCategory, page: '1' });
  };

  const handlePlatformChange = (event: any) => {
    const newPlatform = event.target.value;
    setPlatform(newPlatform);
    setPage(1);
    updateURL({ platform: newPlatform === 'all' ? '' : newPlatform, page: '1' });
  };

  const handleSortChange = (event: any) => {
    const newSort = event.target.value;
    setSortBy(newSort);
    setPage(1);
    updateURL({ sortBy: newSort, page: '1' });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    updateURL({ page: value.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToWatchlist = async (productId: string) => {
    try {
      await watchlistApi.addToWatchlist(productId);
      // Show success notification
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  const handleClearFilters = () => {
    setCategory('all');
    setPlatform('all');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setSortBy('popularity');
    setPage(1);
    setSearchParams({});
  };

  const updateURL = (params: Record<string, string>) => {
    const current = Object.fromEntries(searchParams);
    const updated = { ...current, ...params };
    Object.keys(updated).forEach(key => {
      if (!updated[key]) delete updated[key];
    });
    setSearchParams(updated);
  };

  const hasActiveFilters = category !== 'all' || platform !== 'all' || minPrice || maxPrice || minRating > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {t('productTracking.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t('productTracking.subtitle')}
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <SearchBar
          onSearch={handleSearch}
          placeholder={t('productTracking.searchPlaceholder')}
          defaultValue={searchQuery}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Category Filters */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat === 'all' ? 'All Categories' : cat}
              onClick={() => handleCategoryChange(cat)}
              color={category === cat ? 'primary' : 'default'}
              variant={category === cat ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Box>

      {/* Advanced Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Platform</InputLabel>
            <Select value={platform} onChange={handlePlatformChange} label="Platform">
              {platforms.map((p) => (
                <MenuItem key={p} value={p}>
                  {p === 'all' ? 'All Platforms' : p.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateURL({ minPrice })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateURL({ maxPrice })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Min Rating</InputLabel>
            <Select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} label="Min Rating">
              <MenuItem value={0}>All Ratings</MenuItem>
              <MenuItem value={3}>3+ Stars</MenuItem>
              <MenuItem value={4}>4+ Stars</MenuItem>
              <MenuItem value={4.5}>4.5+ Stars</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={handleSortChange} label="Sort By">
              <MenuItem value="popularity">Popularity</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="discount">Discount</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box sx={{ mb: 2 }}>
          <Chip label="Clear All Filters" onDelete={handleClearFilters} color="secondary" />
        </Box>
      )}

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query"
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {products.length} products
          </Typography>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/consumer/history?product=${product.id}`)}
                  onAddToWatchlist={() => handleAddToWatchlist(product.id)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductTracking;

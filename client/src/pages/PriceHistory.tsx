import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  Alert,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingDown,
  TrendingUp,
  ShowChart,
  ShoppingCart,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ProductCard, PlatformBadge, SkeletonLoader, DateRangePicker } from '../components/common';
import { productsApi, watchlistApi, predictionsApi } from '../api';
import type { Product, PriceRecord, Platform } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PriceHistory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceRecord[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (productId) {
      loadProductData();
    }
  }, [productId, selectedPlatform, dateRange]);

  const loadProductData = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const [productRes, historyRes, predictionRes, relatedRes] = await Promise.allSettled([
        productsApi.getProduct(productId),
        productsApi.getProductHistory(productId, {
          platform: selectedPlatform !== 'all' ? selectedPlatform : undefined,
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined,
        }),
        predictionsApi.getBuyOrWait(productId),
        productsApi.getRecommendations(productId),
      ]);

      if (productRes.status === 'fulfilled') {
        setProduct(productRes.value.data);
      }

      if (historyRes.status === 'fulfilled') {
        setPriceHistory(historyRes.value.data || []);
      }

      if (predictionRes.status === 'fulfilled') {
        setPrediction(predictionRes.value.data);
      }

      if (relatedRes.status === 'fulfilled') {
        setRelatedProducts(relatedRes.value.data?.slice(0, 4) || []);
      }
    } catch (err) {
      console.error('Failed to load product data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!productId) return;
    try {
      await watchlistApi.addToWatchlist(productId);
      setIsInWatchlist(true);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!productId) return;
    try {
      await watchlistApi.removeFromWatchlist(productId);
      setIsInWatchlist(false);
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  if (!productId) {
    return (
      <Container>
        <Alert severity="warning">No product selected</Alert>
      </Container>
    );
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!product) {
    return (
      <Container>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  const chartData = {
    labels: priceHistory.map((record) => new Date(record.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Price',
        data: priceHistory.map((record) => record.price),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `₹${value}`,
        },
      },
    },
  };

  const stats = {
    current: product.current_price,
    lowest: Math.min(...priceHistory.map((r) => r.price)),
    highest: Math.max(...priceHistory.map((r) => r.price)),
    average: priceHistory.reduce((sum, r) => sum + r.price, 0) / priceHistory.length,
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Product Header */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <Box
              component="img"
              src={product.image_url}
              alt={product.product_name}
              sx={{ width: '100%', height: 250, objectFit: 'contain', p: 2 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {product.product_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.brand}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ my: 2 }}>
            <PlatformBadge platform={product.platform} />
            <Chip label={`${product.rating} ★`} size="small" color="primary" />
          </Stack>

          <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
            ₹{product.current_price.toLocaleString()}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => window.open(product.product_url, '_blank')}
            >
              Buy Now
            </Button>
            <Button
              variant="outlined"
              startIcon={isInWatchlist ? <Bookmark /> : <BookmarkBorder />}
              onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
            >
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Buy Recommendation */}
      {prediction && (
        <Alert
          severity={
            prediction.action === 'buy_now' ? 'success' : prediction.action === 'wait' ? 'warning' : 'info'
          }
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {prediction.action === 'buy_now' ? 'Good time to buy!' : 'Consider waiting'}
          </Typography>
          <Typography variant="body2">{prediction.reasoning}</Typography>
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Price History" />
          <Tab label="Statistics" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Price Trend
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
                  label="Platform"
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="amazon_india">Amazon</MenuItem>
                  <MenuItem value="flipkart">Flipkart</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              label="Date Range"
              showPresets
            />

            <Box sx={{ height: 400, mt: 3 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Current Price
                </Typography>
                <Typography variant="h5">₹{stats.current.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Lowest Price
                </Typography>
                <Typography variant="h5" color="success.main">
                  ₹{stats.lowest.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Highest Price
                </Typography>
                <Typography variant="h5" color="error.main">
                  ₹{stats.highest.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Average Price
                </Typography>
                <Typography variant="h5">₹{stats.average.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p.id}>
                <ProductCard product={p} onClick={() => navigate(`/consumer/history?product=${p.id}`)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default PriceHistory;

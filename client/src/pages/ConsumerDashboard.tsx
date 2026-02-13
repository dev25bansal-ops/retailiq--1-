import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Savings as SavingsIcon,
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  StatsCard,
  ProductCard,
  DashboardSkeleton,
  SearchBar,
} from '../components/common';
import { productsApi, alertsApi, watchlistApi } from '../api';
import type { Product, Alert } from '../types';

const ConsumerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    productsTracked: 0,
    activeAlerts: 0,
    priceDropsToday: 0,
    totalSavings: 0,
  });
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recentPriceDrops, setRecentPriceDrops] = useState<Product[]>([]);
  const [upcomingFestival, setUpcomingFestival] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        watchlistResponse,
        alertsResponse,
        trendingResponse,
        priceDropsResponse,
      ] = await Promise.allSettled([
        watchlistApi.getWatchlistStats(),
        alertsApi.getUnreadCount(),
        productsApi.getTrending(8),
        productsApi.getPriceDrops(24),
      ]);

      // Update stats
      if (watchlistResponse.status === 'fulfilled') {
        const watchlistData = watchlistResponse.value.data;
        setStats(prev => ({
          ...prev,
          productsTracked: watchlistData.totalItems || 0,
          priceDropsToday: watchlistData.priceDrops || 0,
          totalSavings: watchlistData.totalSavings || 0,
        }));
      }

      if (alertsResponse.status === 'fulfilled') {
        setStats(prev => ({
          ...prev,
          activeAlerts: alertsResponse.value.data.count || 0,
        }));
      }

      // Load trending products
      if (trendingResponse.status === 'fulfilled') {
        setTrendingProducts(trendingResponse.value.data || []);
      }

      // Load recent price drops
      if (priceDropsResponse.status === 'fulfilled') {
        setRecentPriceDrops(priceDropsResponse.value.data?.slice(0, 4) || []);
      }

      // Mock upcoming festival data
      setUpcomingFestival({
        name: 'Diwali Sale 2024',
        daysLeft: 15,
        expectedDiscount: '40-70%',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    navigate(`/consumer/track?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {t('dashboard.welcome')}, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Quick Search */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          onSearch={handleSearch}
          placeholder={t('dashboard.searchPlaceholder')}
          autoFocus={false}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.productsTracked')}
            value={stats.productsTracked}
            icon={<ShoppingCartIcon />}
            color="primary"
            onClick={() => navigate('/consumer/track')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.activeAlerts')}
            value={stats.activeAlerts}
            icon={<NotificationsIcon />}
            color="warning"
            onClick={() => navigate('/consumer/alerts')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.priceDropsToday')}
            value={stats.priceDropsToday}
            icon={<TrendingUpIcon />}
            color="success"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title={t('dashboard.totalSavings')}
            value={`₹${stats.totalSavings.toLocaleString()}`}
            icon={<SavingsIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Upcoming Festival */}
      {upcomingFestival && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'white' }}>
                <EventIcon sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {upcomingFestival.name}
                  </Typography>
                  <Typography variant="body2">
                    {upcomingFestival.daysLeft} days left • Expected discount: {upcomingFestival.expectedDiscount}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate('/consumer/festivals')}
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                View Deals
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Trending Products */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {t('dashboard.trendingProducts')}
          </Typography>
          <Button
            endIcon={<TrendingUpIcon />}
            onClick={() => navigate('/consumer/track')}
          >
            View All
          </Button>
        </Box>

        {trendingProducts.length === 0 ? (
          <Alert severity="info">No trending products available at the moment.</Alert>
        ) : (
          <Grid container spacing={3}>
            {trendingProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/consumer/history?product=${product.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Recent Price Drops */}
      {recentPriceDrops.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              {t('dashboard.recentPriceDrops')}
            </Typography>
            <Chip label="Last 24 hours" color="success" size="small" />
          </Box>

          <Grid container spacing={3}>
            {recentPriceDrops.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/consumer/history?product=${product.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Quick Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={() => navigate('/consumer/track')}
        >
          Track New Product
        </Button>
        <Button
          variant="outlined"
          startIcon={<EventIcon />}
          onClick={() => navigate('/consumer/festivals')}
        >
          Festival Deals
        </Button>
        <Button
          variant="outlined"
          startIcon={<TrendingUpIcon />}
          onClick={() => navigate('/consumer/predictive')}
        >
          Price Predictions
        </Button>
      </Box>
    </Container>
  );
};

export default ConsumerDashboard;

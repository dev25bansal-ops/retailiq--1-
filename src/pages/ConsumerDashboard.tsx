import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Grid,
  Paper,
  Stack,
  alpha,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ChatBubbleOutline,
  AddCircleOutline,
  NotificationsActive,
  Celebration,
  ArrowForward,
  PriceChange,
  Inventory,
  AutoAwesome,
  LocalFireDepartment,
  Shield,
  Speed,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { formatINR, formatPercentage, formatRelativeTime } from '../utils/formatters';
import {
  watchlistProducts,
  getRecentAlerts,
  getNextFestival,
  trendingProducts,
  recommendedProducts,
} from '../data/sampleData';

const ConsumerDashboard: React.FC = () => {
  const [trackUrl, setTrackUrl] = useState('');
  const nextFestival = getNextFestival();
  const recentAlerts = getRecentAlerts();

  const handleTrackProduct = () => {
    if (trackUrl) {
      setTrackUrl('');
    }
  };

  const quickStats = [
    { label: 'Products Tracked', value: watchlistProducts.length.toString(), icon: <Inventory />, color: '#1a237e' },
    { label: 'Price Drops Today', value: '3', icon: <TrendingDown />, color: '#10b981' },
    { label: 'Active Alerts', value: recentAlerts.length.toString(), icon: <NotificationsActive />, color: '#f59e0b' },
    { label: 'Avg Savings', value: '18%', icon: <Shield />, color: '#8b5cf6' },
  ];

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Festival Alert Banner */}
      {nextFestival && (
        <Paper
          sx={{
            mb: 3,
            p: 2.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
            <Celebration sx={{ fontSize: 200 }} />
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" position="relative">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                <Celebration />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25 }}>
                  {nextFestival.name} in {nextFestival.days_until} days
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={`Up to ${nextFestival.historical_discount_avg}% OFF`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    on {nextFestival.affected_categories.slice(0, 3).join(', ')}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Button
              component={Link}
              to="/consumer/festivals"
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              View Deals
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }} className="stagger-children">
        {quickStats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(stat.color, 0.08),
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main 2-Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            {/* AI Shopping Agent */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, #0d1642 0%, #1a237e 60%, #283593 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.06 }}>
                <AutoAwesome sx={{ fontSize: 240 }} />
              </Box>
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 48, height: 48 }}>
                    <AutoAwesome />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      AI Shopping Agent
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                      Your personal deal finder across Amazon & Flipkart
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} mb={2.5} flexWrap="wrap" gap={0.5}>
                  {['Best phone under 50k', 'Compare prices', 'When to buy?'].map((q) => (
                    <Chip
                      key={q}
                      label={q}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.15)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Stack>
                <Button
                  component={Link}
                  to="/consumer/chat"
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ChatBubbleOutline />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)', transform: 'translateY(-1px)' },
                    backdropFilter: 'blur(10px)',
                    fontWeight: 700,
                    py: 1.5,
                  }}
                >
                  Start Shopping Chat
                </Button>
              </CardContent>
            </Card>

            {/* Track New Product */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) }}>
                    <AddCircleOutline color="primary" sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>Track New Product</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Paste a URL from Amazon India or Flipkart
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="https://amazon.in/product... or https://flipkart.com/..."
                    value={trackUrl}
                    onChange={(e) => setTrackUrl(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f8f9fb' } }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleTrackProduct}
                    disabled={!trackUrl}
                    sx={{ minWidth: 110, fontWeight: 700 }}
                  >
                    Track
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Trending Products */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <LocalFireDepartment sx={{ color: '#ef4444' }} />
                  <Typography variant="h6" fontWeight={700}>Trending Now</Typography>
                </Stack>
                <Stack spacing={1}>
                  {trendingProducts.map((item) => (
                    <Paper
                      key={item.rank}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(26,35,126,0.02)', borderColor: 'primary.light' },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            bgcolor: item.rank <= 3 ? alpha('#1a237e', 0.08) : 'rgba(0,0,0,0.04)',
                            color: item.rank <= 3 ? '#1a237e' : 'text.secondary',
                          }}
                        >
                          {item.rank}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {item.product.product_name}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" color="primary" fontWeight={700}>
                              {formatINR(item.product.current_price)}
                            </Typography>
                            <Chip label={item.product.brand} size="small" sx={{ height: 20, fontSize: '0.625rem' }} />
                          </Stack>
                        </Box>
                        <Speed sx={{ color: 'text.disabled', fontSize: 18 }} />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            {/* Watchlist */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Inventory color="primary" sx={{ fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700}>My Watchlist</Typography>
                  </Stack>
                  <Chip label={`${watchlistProducts.length} items`} size="small" color="primary" variant="outlined" />
                </Stack>
                <Stack spacing={1} sx={{ maxHeight: 420, overflowY: 'auto', pr: 0.5 }}>
                  {watchlistProducts.slice(0, 8).map((product) => {
                    const priceChange =
                      ((product.current_price - product.original_price) / product.original_price) * 100;
                    const isPriceDown = priceChange < 0;

                    return (
                      <Paper
                        key={product.product_id}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { bgcolor: 'rgba(26,35,126,0.02)', borderColor: 'primary.light' },
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ mb: 0.75 }}>
                          {product.product_name}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="primary" fontWeight={700}>
                            {formatINR(product.current_price)}
                          </Typography>
                          <Chip
                            icon={isPriceDown ? <TrendingDown sx={{ fontSize: '14px !important' }} /> : <TrendingUp sx={{ fontSize: '14px !important' }} />}
                            label={formatPercentage(priceChange)}
                            size="small"
                            color={isPriceDown ? 'success' : 'error'}
                            sx={{ fontWeight: 700, height: 24, '& .MuiChip-label': { px: 0.75 } }}
                          />
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
                <Button
                  component={Link}
                  to="/consumer/track"
                  fullWidth
                  variant="text"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                >
                  View All Products
                </Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NotificationsActive color="warning" sx={{ fontSize: 22 }} />
                    <Typography variant="h6" fontWeight={700}>Recent Alerts</Typography>
                  </Stack>
                  <Chip label={`${recentAlerts.length} new`} size="small" color="warning" />
                </Stack>
                <Stack spacing={1}>
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map((alert) => {
                      const isPriceDrop = alert.alert_type === 'price_drop';
                      const isFestival = alert.alert_type === 'festival';
                      const borderColor = isPriceDrop ? '#10b981' : isFestival ? '#f59e0b' : '#ef4444';

                      return (
                        <Paper
                          key={alert.alert_id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderLeft: `3px solid ${borderColor}`,
                            transition: 'all 0.15s ease',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' },
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor: alpha(borderColor, 0.1),
                                mt: 0.25,
                              }}
                            >
                              {isPriceDrop ? (
                                <TrendingDown sx={{ color: borderColor, fontSize: 16 }} />
                              ) : isFestival ? (
                                <Celebration sx={{ color: borderColor, fontSize: 16 }} />
                              ) : (
                                <TrendingUp sx={{ color: borderColor, fontSize: 16 }} />
                              )}
                            </Avatar>
                            <Box flex={1} minWidth={0}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {alert.product_name}
                              </Typography>
                              <Stack direction="row" spacing={0.75} alignItems="center" mt={0.25}>
                                <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                  {formatINR(alert.old_price)}
                                </Typography>
                                <Typography variant="caption" fontWeight={700} color={isPriceDrop ? 'success.main' : 'error.main'}>
                                  {formatINR(alert.new_price)}
                                </Typography>
                                <Chip
                                  label={formatPercentage(alert.percentage_change)}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.625rem',
                                    fontWeight: 700,
                                    bgcolor: isPriceDrop ? '#ecfdf5' : '#fef2f2',
                                    color: isPriceDrop ? '#10b981' : '#ef4444',
                                  }}
                                />
                              </Stack>
                              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
                                {formatRelativeTime(alert.timestamp)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      );
                    })
                  ) : (
                    <Box textAlign="center" py={3}>
                      <NotificationsActive sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No new alerts yet
                      </Typography>
                    </Box>
                  )}
                </Stack>
                <Button
                  component={Link}
                  to="/consumer/alerts"
                  fullWidth
                  variant="text"
                  sx={{ mt: 1.5, fontWeight: 600 }}
                  endIcon={<ArrowForward sx={{ fontSize: '16px !important' }} />}
                >
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Smart Recommendations */}
      <Box mt={4}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <PriceChange color="primary" />
          <Typography variant="h5" fontWeight={700}>Smart Recommendations</Typography>
          <Chip label="Based on your interests" size="small" variant="outlined" />
        </Stack>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.12)', borderRadius: 2 },
          }}
        >
          {recommendedProducts.map((product) => {
            const discount = product.original_price > product.current_price
              ? Math.round(((product.original_price - product.current_price) / product.original_price) * 100)
              : 0;

            return (
              <Card
                key={product.product_id}
                sx={{
                  minWidth: 260,
                  maxWidth: 260,
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    height: 180,
                    bgcolor: '#f8f9fb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                  />
                  {discount > 0 && (
                    <Chip
                      label={`${discount}% OFF`}
                      size="small"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontWeight: 700,
                        fontSize: '0.625rem',
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="body2" noWrap fontWeight={600} gutterBottom>
                    {product.product_name}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography variant="h6" color="primary" fontWeight={800}>
                      {formatINR(product.current_price)}
                    </Typography>
                    {product.original_price > product.current_price && (
                      <Typography variant="caption" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                        {formatINR(product.original_price)}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={0.75} mb={1.5}>
                    <Chip label={product.brand} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.625rem' }} />
                    <Chip
                      label={product.platform === 'amazon_india' ? 'Amazon' : 'Flipkart'}
                      size="small"
                      color="primary"
                      sx={{ height: 22, fontSize: '0.625rem' }}
                    />
                  </Stack>
                  <Button fullWidth variant="outlined" size="small" sx={{ fontWeight: 600 }}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default ConsumerDashboard;

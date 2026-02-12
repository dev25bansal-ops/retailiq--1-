import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  Chip,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Celebration,
  NotificationsActive,
  EmojiEvents,
} from '@mui/icons-material';
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
import { Line } from 'react-chartjs-2';
import { formatINR } from '../utils/formatters';
import { sampleProducts, samplePriceHistory, getNextFestival } from '../data/sampleData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceHistory: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState(sampleProducts[0].product_id);
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [targetPrice, setTargetPrice] = useState('');

  const selectedProduct = sampleProducts.find((p) => p.product_id === selectedProductId)!;
  const nextFestival = getNextFestival();

  // Get price history for selected product
  const priceHistory = useMemo(() => {
    const history = samplePriceHistory.filter((h) => h.product_id === selectedProductId);

    // Group by platform
    const amazonHistory = history.filter((h) => h.platform === 'amazon_india');
    const flipkartHistory = history.filter((h) => h.platform === 'flipkart');

    return {
      amazon: amazonHistory,
      flipkart: flipkartHistory,
      all: history,
    };
  }, [selectedProductId]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const allPrices = priceHistory.all.map((h) => h.price);
    if (allPrices.length === 0) {
      return { lowest: 0, highest: 0, average: 0, trend: 'stable' as const };
    }

    const lowest = Math.min(...allPrices);
    const highest = Math.max(...allPrices);
    const average = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;

    // Determine trend
    const recentPrices = allPrices.slice(-3);
    const olderPrices = allPrices.slice(0, 3);
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;

    let trend: 'rising' | 'falling' | 'stable' = 'stable';
    if (recentAvg < olderAvg * 0.95) trend = 'falling';
    else if (recentAvg > olderAvg * 1.05) trend = 'rising';

    return { lowest, highest, average, trend };
  }, [priceHistory]);

  // Current prices on different platforms
  const currentPrices = useMemo(() => {
    const amazonPrice =
      priceHistory.amazon.length > 0
        ? priceHistory.amazon[priceHistory.amazon.length - 1].price
        : null;
    const flipkartPrice =
      priceHistory.flipkart.length > 0
        ? priceHistory.flipkart[priceHistory.flipkart.length - 1].price
        : null;

    const bestPrice =
      amazonPrice && flipkartPrice
        ? Math.min(amazonPrice, flipkartPrice)
        : amazonPrice || flipkartPrice || selectedProduct.current_price;

    return { amazon: amazonPrice, flipkart: flipkartPrice, best: bestPrice };
  }, [priceHistory, selectedProduct]);

  // Chart data
  const chartData = useMemo(() => {
    const labels = priceHistory.amazon.map((h) => {
      const date = new Date(h.timestamp);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Amazon India',
          data: priceHistory.amazon.map((h) => h.price),
          borderColor: '#FF9900',
          backgroundColor: 'rgba(255, 153, 0, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Flipkart',
          data: priceHistory.flipkart.map((h) => h.price),
          borderColor: '#2874F0',
          backgroundColor: 'rgba(40, 116, 240, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [priceHistory]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.dataset.label + ': ' + formatINR(context.parsed.y);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: any) {
            return '₹' + (value / 1000).toFixed(0) + 'k';
          },
        },
      },
    },
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Price History & Comparison
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track and compare prices across platforms over time
        </Typography>
      </Box>

      {/* Product Selector */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Product</InputLabel>
        <Select
          value={selectedProductId}
          label="Select Product"
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          {sampleProducts.slice(0, 12).map((product) => (
            <MenuItem key={product.product_id} value={product.product_id}>
              {product.product_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Product Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Box
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'grey.100',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.product_name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                {selectedProduct.product_name}
              </Typography>
              <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                <Chip label={selectedProduct.brand} size="small" />
                <Chip label={selectedProduct.category} size="small" variant="outlined" />
                <Chip
                  label={`${selectedProduct.rating} ⭐ (${selectedProduct.review_count} reviews)`}
                  size="small"
                  color="primary"
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Current Prices Comparison */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom>
            Current Prices
          </Typography>
          <Grid container spacing={2}>
            {currentPrices.amazon && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderLeft:
                      currentPrices.amazon === currentPrices.best
                        ? '4px solid'
                        : undefined,
                    borderLeftColor: currentPrices.amazon === currentPrices.best ? 'success.main' : undefined,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Amazon India
                      </Typography>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        {formatINR(currentPrices.amazon)}
                      </Typography>
                    </Box>
                    {currentPrices.amazon === currentPrices.best && (
                      <Chip
                        label="BEST PRICE"
                        color="success"
                        size="small"
                        icon={<EmojiEvents />}
                      />
                    )}
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    sx={{ mt: 2, bgcolor: '#FF9900', '&:hover': { bgcolor: '#e68a00' } }}
                  >
                    Buy Now
                  </Button>
                </Paper>
              </Grid>
            )}
            {currentPrices.flipkart && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderLeft:
                      currentPrices.flipkart === currentPrices.best
                        ? '4px solid'
                        : undefined,
                    borderLeftColor: currentPrices.flipkart === currentPrices.best ? 'success.main' : undefined,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Flipkart
                      </Typography>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        {formatINR(currentPrices.flipkart)}
                      </Typography>
                    </Box>
                    {currentPrices.flipkart === currentPrices.best && (
                      <Chip
                        label="BEST PRICE"
                        color="success"
                        size="small"
                        icon={<EmojiEvents />}
                      />
                    )}
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    sx={{ mt: 2, bgcolor: '#2874F0', '&:hover': { bgcolor: '#1c5db8' } }}
                  >
                    Buy Now
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
          {currentPrices.amazon && currentPrices.flipkart && (
            <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
              Price difference:{' '}
              {formatINR(Math.abs(currentPrices.amazon - currentPrices.flipkart))}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* 30-Day Price History Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <ShowChart color="primary" />
            <Typography variant="h6">30-Day Price History</Typography>
          </Stack>
          <Box sx={{ height: 400, mb: 3 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>

          {/* Statistics */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Lowest
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {formatINR(statistics.lowest)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Highest
                </Typography>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  {formatINR(statistics.highest)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Average
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatINR(Math.round(statistics.average))}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Trend
                </Typography>
                <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                  {statistics.trend === 'falling' ? (
                    <>
                      <TrendingDown sx={{ color: 'success.main' }} />
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        Falling
                      </Typography>
                    </>
                  ) : statistics.trend === 'rising' ? (
                    <>
                      <TrendingUp sx={{ color: 'error.main' }} />
                      <Typography variant="h6" color="error.main" fontWeight="bold">
                        Rising
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6" fontWeight="bold">
                      Stable
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Festival Intelligence */}
      {nextFestival && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Celebration color="warning" />
              <Typography variant="h6">Festival Intelligence</Typography>
            </Stack>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'warning.lighter' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {nextFestival.name} - {nextFestival.days_until} days away
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Historical average discount: {nextFestival.historical_discount_avg}%
              </Typography>
              <Stack spacing={1}>
                {nextFestival.historical_discounts.map((h) => (
                  <Stack key={h.year} direction="row" justifyContent="space-between">
                    <Typography variant="body2">{h.year}</Typography>
                    <Chip label={`${h.discount}% OFF`} size="small" color="warning" />
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight="bold" color="primary">
                AI Recommendation: Wait for {nextFestival.name} to potentially save around{' '}
                {formatINR(
                  Math.round((currentPrices.best * nextFestival.historical_discount_avg) / 100)
                )}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Price Alerts Settings */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <NotificationsActive color="primary" />
            <Typography variant="h6">Price Alerts</Typography>
          </Stack>
          <FormControlLabel
            control={
              <Switch checked={enableAlerts} onChange={(e) => setEnableAlerts(e.target.checked)} />
            }
            label="Enable price alerts for this product"
          />
          {enableAlerts && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Set a target price to get notified when the price drops below this amount
              </Typography>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <TextField
                  label="Target Price"
                  placeholder="Enter target price"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  type="number"
                  size="small"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
                <Button variant="contained" size="medium">
                  Set Alert
                </Button>
              </Stack>
              {targetPrice && Number(targetPrice) > 0 && (
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                  You'll be notified when the price drops to or below {formatINR(Number(targetPrice))}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PriceHistory;

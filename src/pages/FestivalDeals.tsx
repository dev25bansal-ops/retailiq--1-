import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
} from '@mui/material';
import {
  Celebration,
  TrendingDown,
  AccessTime,
  Category,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatINR, calculateSavings } from '../utils/formatters';
import { sampleFestivals, watchlistProducts } from '../data/sampleData';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FestivalDeals: React.FC = () => {
  // Get next upcoming festival
  const nextFestival = useMemo(() => {
    return sampleFestivals.sort((a, b) => a.days_until - b.days_until)[0];
  }, []);

  // Calculate expected savings for watchlist products
  const expectedSavings = useMemo(() => {
    if (!nextFestival) return [];

    return watchlistProducts.slice(0, 8).map((product) => {
      const expectedDiscount = nextFestival.historical_discount_avg;
      const expectedPrice = product.current_price * (1 - expectedDiscount / 100);
      const savings = calculateSavings(product.current_price, expectedPrice);

      // Confidence rating (1-5 stars) based on category match and historical consistency
      const categoryMatch = nextFestival.affected_categories.some((cat) =>
        product.category.toLowerCase().includes(cat.toLowerCase())
      );
      const historicalVariance =
        Math.max(...nextFestival.historical_discounts.map((h) => h.discount)) -
        Math.min(...nextFestival.historical_discounts.map((h) => h.discount));

      let confidence = 3; // Default
      if (categoryMatch) confidence += 1;
      if (historicalVariance <= 5) confidence += 1;
      if (!categoryMatch) confidence -= 1;

      return {
        product,
        currentPrice: product.current_price,
        expectedPrice: Math.round(expectedPrice),
        savings: savings.amount,
        savingsPercentage: savings.percentage,
        confidence: Math.max(1, Math.min(5, confidence)),
      };
    });
  }, [nextFestival, watchlistProducts]);

  // Prepare bar chart data for historical trends
  const historicalTrendsChart = useMemo(() => {
    if (!nextFestival) return null;

    const labels = nextFestival.historical_discounts.map((h) => h.year.toString());
    const data = nextFestival.historical_discounts.map((h) => h.discount);

    return {
      labels,
      datasets: [
        {
          label: 'Average Discount (%)',
          data,
          backgroundColor: 'rgba(255, 152, 0, 0.7)',
          borderColor: 'rgba(255, 152, 0, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [nextFestival]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value + '%';
          },
        },
      },
    },
  };

  if (!nextFestival) {
    return (
      <Container maxWidth="xl" disableGutters>
        <Typography variant="h5" color="text.secondary">
          No upcoming festivals found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Festival Deals Tracker
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Track upcoming festivals and plan your purchases to maximize savings
      </Typography>

      {/* Featured Festival Card */}
      <Card
        sx={{
          mb: 3,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Celebration sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {nextFestival.name}
                </Typography>
                <Chip
                  label={nextFestival.type.replace('_', ' ').toUpperCase()}
                  size="small"
                  sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AccessTime />
                    <Typography variant="subtitle2">Countdown</Typography>
                  </Stack>
                  <Typography variant="h3" fontWeight="bold">
                    {nextFestival.days_until}
                  </Typography>
                  <Typography variant="body2">days remaining</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <TrendingDown />
                    <Typography variant="subtitle2">Avg Discount</Typography>
                  </Stack>
                  <Typography variant="h3" fontWeight="bold">
                    {nextFestival.historical_discount_avg}%
                  </Typography>
                  <Typography variant="body2">based on history</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Category />
                    <Typography variant="subtitle2">Affected Categories</Typography>
                  </Stack>
                  <Typography variant="h5" fontWeight="bold">
                    {nextFestival.affected_categories.length}+
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {nextFestival.affected_categories.slice(0, 2).join(', ')}...
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" mb={1}>
                Affected Categories:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {nextFestival.affected_categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Expected Savings Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom>
            Expected Savings on Your Watchlist
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Based on historical {nextFestival.name} discounts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Expected Price</TableCell>
                  <TableCell align="right">Potential Savings</TableCell>
                  <TableCell align="center">Confidence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expectedSavings.map((item) => (
                  <TableRow key={item.product.product_id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" noWrap maxWidth={300}>
                        {item.product.product_name}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={0.5}>
                        <Chip label={item.product.brand} size="small" />
                        <Chip label={item.product.category} size="small" variant="outlined" />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{formatINR(item.currentPrice)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {formatINR(item.expectedPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack alignItems="flex-end">
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {formatINR(item.savings)}
                        </Typography>
                        <Chip
                          label={`${item.savingsPercentage.toFixed(1)}% OFF`}
                          size="small"
                          color="success"
                          sx={{ mt: 0.5 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Rating value={item.confidence} readOnly size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'success.50' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                Total Potential Savings:
              </Typography>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                {formatINR(expectedSavings.reduce((sum, item) => sum + item.savings, 0))}
              </Typography>
            </Stack>
          </Paper>
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom>
            Historical Discount Trends
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Average discount percentages for {nextFestival.name} over the years
          </Typography>
          {historicalTrendsChart && (
            <Box sx={{ height: 300 }}>
              <Bar data={historicalTrendsChart} options={chartOptions} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Festivals List */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom>
            All Upcoming Festivals
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Plan your purchases around these major sale events
          </Typography>
          <Stack spacing={2}>
            {sampleFestivals
              .sort((a, b) => a.days_until - b.days_until)
              .map((festival) => (
                <Paper
                  key={festival.festival_id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                    borderLeft:
                      festival.festival_id === nextFestival.festival_id
                        ? '4px solid'
                        : undefined,
                    borderColor: 'primary.main',
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Celebration color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {festival.name}
                        </Typography>
                        {festival.festival_id === nextFestival.festival_id && (
                          <Chip label="NEXT" size="small" color="primary" />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(festival.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Days Until
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {festival.days_until}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Avg Discount
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <TrendingDown color="success" fontSize="small" />
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {festival.historical_discount_avg}%
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                        Categories
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        {festival.affected_categories.slice(0, 3).map((cat) => (
                          <Chip key={cat} label={cat} size="small" />
                        ))}
                        {festival.affected_categories.length > 3 && (
                          <Chip
                            label={`+${festival.affected_categories.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                  {festival.days_until <= 30 && (
                    <Box mt={2}>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Time until festival
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.max(0, 100 - (festival.days_until / 30) * 100)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}
                </Paper>
              ))}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FestivalDeals;

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatINR } from '../utils/formatters';
import { sampleCompetitors, sampleOpportunities, sampleThreats, priceDistribution } from '../data/sampleData';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompetitiveIntel() {
  const userPosition = 25200; // User's average price
  const marketAvg = 23500;

  // Price Distribution Chart Data
  const chartData = {
    labels: priceDistribution.map((d) => d.range),
    datasets: [
      {
        label: 'Number of Competitors',
        data: priceDistribution.map((d) => d.count),
        backgroundColor: priceDistribution.map((d) =>
          d.range === '25k-30k' ? 'rgba(33, 150, 243, 0.7)' : 'rgba(158, 158, 158, 0.5)'
        ),
        borderColor: priceDistribution.map((d) => (d.range === '25k-30k' ? '#2196f3' : '#9e9e9e')),
        borderWidth: 2,
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
      title: {
        display: true,
        text: 'Market Price Distribution (Your position highlighted)',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} retailers in this range`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Retailers',
        },
        ticks: {
          stepSize: 10,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Price Range',
        },
      },
    },
  };

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          Competitive Intelligence Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Market: Mumbai
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" color="text.secondary">
            Period: Last 30 Days
          </Typography>
        </Box>
      </Box>

      {/* Market Overview KPIs */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Market Size */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Market Size
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                ₹45.2 Cr
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Transaction Volume
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Competitors */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StoreIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Active Competitors
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  23
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  in your area
                </Typography>
              </Box>
              <Chip label="Your Rank: #8" color="info" size="small" sx={{ fontWeight: 600 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Market Growth */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Market Growth
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  +12%
                </Typography>
                <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                vs Previous Period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Competitive Position Visualization */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Your Competitive Position
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Lowest Price: {formatINR(20800)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Your Price: {formatINR(userPosition)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highest Price: {formatINR(26100)}
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 40, bgcolor: 'grey.300', borderRadius: 1, overflow: 'visible' }}>
              {/* Market Average Marker */}
              <Box
                sx={{
                  position: 'absolute',
                  left: `${((marketAvg - 20800) / (26100 - 20800)) * 100}%`,
                  top: -8,
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 56,
                  bgcolor: 'grey.500',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    color: 'grey.500',
                    fontWeight: 600,
                  }}
                >
                  Market Avg
                </Typography>
              </Box>

              {/* User Position Marker */}
              <Box
                sx={{
                  position: 'absolute',
                  left: `${((userPosition - 20800) / (26100 - 20800)) * 100}%`,
                  top: 0,
                  transform: 'translateX(-50%)',
                  width: 4,
                  height: 40,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  boxShadow: 3,
                }}
              />

              {/* Price Range Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 15,
                  width: '100%',
                  height: 10,
                  background: 'linear-gradient(to right, #4caf50, #ffc107, #f44336)',
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="success.main">
                Competitive
              </Typography>
              <Typography variant="caption" color="warning.main">
                Market Average
              </Typography>
              <Typography variant="caption" color="error">
                Premium
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Position Status
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                    7% Above Market
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Competitive Advantage
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    Service Quality
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined">
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Recommended Action
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Reduce by 3-5%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Top Competitors Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Top Competitors Analysis
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Retailer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Avg Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Market Share
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Strategy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleCompetitors.map((competitor) => (
                  <TableRow
                    key={competitor.rank}
                    sx={{
                      bgcolor: competitor.isUser ? 'primary.50' : 'transparent',
                      fontWeight: competitor.isUser ? 600 : 400,
                      '&:hover': { bgcolor: competitor.isUser ? 'primary.50' : 'grey.50' },
                    }}
                  >
                    <TableCell>
                      {competitor.isUser ? (
                        <Chip label={`#${competitor.rank}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                      ) : (
                        `#${competitor.rank}`
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: competitor.isUser ? 600 : 400 }}>
                        {competitor.name}
                        {competitor.isUser && (
                          <Chip label="YOU" color="primary" size="small" sx={{ ml: 1, fontWeight: 700 }} />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatINR(competitor.avg_price)}</TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {competitor.market_share.toFixed(1)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={competitor.market_share}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{competitor.strategy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Price Distribution Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Market Price Distribution
          </Typography>

          <Box sx={{ height: 350 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Insight:</strong> Most competitors (78 retailers) are clustered in the 20k-25k range. Your
              pricing puts you in the 25k-30k bracket with 52 other retailers, which represents the premium segment.
              Consider competitive repositioning to capture more market share.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Market Opportunities and Threats */}
      <Grid container spacing={3}>
        {/* Market Opportunities */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LightbulbIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Market Opportunities
                </Typography>
              </Box>

              <Stack spacing={2}>
                {sampleOpportunities.map((opp, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      bgcolor: 'success.50',
                      borderColor: 'success.main',
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {opp.product}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            Demand Change
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {opp.demand_change}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            Competition
                          </Typography>
                          <Chip
                            label={opp.competition}
                            size="small"
                            color={opp.competition === 'Low' ? 'success' : 'warning'}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            Avg Price
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatINR(opp.avg_price)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            Potential Margin
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {opp.potential_margin}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Competitive Threats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WarningIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Competitive Threats
                </Typography>
              </Box>

              <List>
                {sampleThreats.map((threat, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        px: 0,
                        alignItems: 'flex-start',
                        bgcolor: 'error.50',
                        borderRadius: 1,
                        mb: 2,
                        p: 2,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {threat.competitor}
                            </Typography>
                            <Chip
                              label={`${threat.impact} Impact`}
                              size="small"
                              color={threat.impact === 'High' ? 'error' : 'warning'}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              {threat.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {threat.date}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

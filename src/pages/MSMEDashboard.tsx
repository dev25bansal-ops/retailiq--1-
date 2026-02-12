import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Stack,
  Avatar,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  Celebration as CelebrationIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AutoGraph,
  Speed,
  EmojiEvents,
} from '@mui/icons-material';
import { formatINR } from '../utils/formatters';
import { msmeProducts, topPerformers, needsAttention } from '../data/sampleData';

export default function MSMEDashboard() {
  const [aiQuery, setAiQuery] = useState('');

  const sampleQuestions = [
    'Why is my smartphone category underperforming?',
    'What pricing strategy should I use for Diwali?',
    'How can I improve my market position?',
    'Which products should I focus on this month?',
  ];

  const handleAskAI = () => {
    if (aiQuery.trim()) {
      setAiQuery('');
    }
  };

  const kpis = [
    {
      label: 'Market Position',
      value: '65th',
      subtitle: 'Percentile',
      badge: 'Above Average',
      badgeColor: 'success' as const,
      icon: <AutoGraph />,
      color: '#3b82f6',
      trend: '+5 pts',
    },
    {
      label: 'Revenue (30 Days)',
      value: formatINR(1245000),
      subtitle: 'vs Previous Period',
      badge: '+15%',
      badgeColor: 'success' as const,
      icon: <TrendingUpIcon />,
      color: '#10b981',
      trend: 'Growing',
    },
    {
      label: '30-Day Trend',
      value: '+8%',
      subtitle: 'Rising Trend',
      badge: 'Positive',
      badgeColor: 'success' as const,
      icon: <Speed />,
      color: '#8b5cf6',
      trend: 'Accelerating',
    },
  ];

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
            MSME Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered insights for your retail business
          </Typography>
        </Box>
        <Chip label="Pro" color="secondary" size="small" sx={{ fontWeight: 700, letterSpacing: '0.05em' }} />
      </Stack>

      {/* AI Analyst */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0d1642 0%, #1a237e 60%, #283593 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.05 }}>
          <AnalyticsIcon sx={{ fontSize: 250 }} />
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 40, height: 40 }}>
            <AnalyticsIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>Ask AI Analyst</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Get instant insights about performance, pricing & market position
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={0.5}>
          {sampleQuestions.map((q) => (
            <Chip
              key={q}
              label={q}
              size="small"
              onClick={() => setAiQuery(q)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                cursor: 'pointer',
                fontSize: '0.6875rem',
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} position="relative">
          <TextField
            fullWidth
            placeholder="Ask me anything about your business..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAskAI(); }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleAskAI}
            disabled={!aiQuery.trim()}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              minWidth: 90,
              fontWeight: 700,
            }}
          >
            Ask
          </Button>
        </Stack>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }} className="stagger-children">
        {kpis.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6875rem' }}>
                    {kpi.label}
                  </Typography>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(kpi.color, 0.08), color: kpi.color }}>
                    {kpi.icon}
                  </Avatar>
                </Stack>
                <Typography variant="h3" fontWeight={800} sx={{ color: kpi.color, mb: 0.5, fontSize: '2rem' }}>
                  {kpi.value}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">{kpi.subtitle}</Typography>
                  <Chip label={kpi.badge} color={kpi.badgeColor} size="small" sx={{ height: 22, fontWeight: 700, fontSize: '0.625rem' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* AI Insights */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          AI Insights & Recommendations
        </Typography>
        <Stack spacing={1.5}>
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{ '& .MuiAlert-message': { width: '100%' } }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Pricing Alert: Products Overpriced
                </Typography>
                <Typography variant="body2">
                  2 products are priced 12% above market average, affecting sales velocity.
                </Typography>
              </Box>
              <Button variant="outlined" size="small" sx={{ flexShrink: 0 }}>Review</Button>
            </Stack>
          </Alert>

          <Alert
            severity="success"
            icon={<LightbulbIcon />}
            sx={{ '& .MuiAlert-message': { width: '100%' } }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Opportunity: Wireless Earbuds Category
                </Typography>
                <Typography variant="body2">
                  Demand up 45% in 30 days. Low competition (3 competitors). Potential margin: 35-40%.
                </Typography>
              </Box>
              <Button variant="contained" size="small" color="success" sx={{ flexShrink: 0 }}>Explore</Button>
            </Stack>
          </Alert>

          <Alert
            severity="info"
            icon={<CelebrationIcon />}
            sx={{ '& .MuiAlert-message': { width: '100%' } }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Festival Prep: Diwali Sale Strategy
                </Typography>
                <Typography variant="body2">
                  Diwali is 45 days away. Historical data shows 35% sales increase. Plan now.
                </Typography>
              </Box>
              <Button variant="outlined" size="small" color="info" sx={{ flexShrink: 0 }}>Plan Now</Button>
            </Stack>
          </Alert>
        </Stack>
      </Paper>

      {/* Product Portfolio */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Product Portfolio
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Your Price</TableCell>
                <TableCell align="right">Market Avg</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {msmeProducts.map((product) => {
                const isAbove = product.yourPrice > product.marketAvg;

                return (
                  <TableRow key={product.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700}>{formatINR(product.yourPrice)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="text.secondary">{formatINR(product.marketAvg)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {isAbove ? (
                          <ArrowUpwardIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ fontSize: 14, color: '#10b981' }} />
                        )}
                        <Typography variant="body2" fontWeight={500}>{product.position}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.status === 'success' ? 'Competitive' : 'Review'}
                        color={product.status === 'success' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small" sx={{ fontWeight: 600 }}>Optimize</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Top Performers & Needs Attention */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <EmojiEvents sx={{ color: '#f59e0b' }} />
              <Typography variant="h6" fontWeight={700}>Top Performers</Typography>
            </Stack>
            <Stack spacing={1.5}>
              {topPerformers.map((product, index) => (
                <Card
                  key={product.name}
                  variant="outlined"
                  sx={{
                    bgcolor: index === 0 ? alpha('#f59e0b', 0.04) : 'transparent',
                    borderColor: index === 0 ? alpha('#f59e0b', 0.3) : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.sales} units sold this month
                        </Typography>
                      </Box>
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Chip label={`${product.margin} margin`} color="success" size="small" sx={{ height: 22, fontWeight: 700, fontSize: '0.625rem' }} />
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {product.trend === 'up' ? (
                            <TrendingUpIcon sx={{ fontSize: 14, color: '#10b981' }} />
                          ) : (
                            <TrendingDownIcon sx={{ fontSize: 14, color: '#64748b' }} />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {product.trend === 'up' ? 'Growing' : 'Stable'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <WarningIcon sx={{ color: '#f59e0b' }} />
              <Typography variant="h6" fontWeight={700}>Needs Attention</Typography>
            </Stack>
            <Stack spacing={1.5}>
              {needsAttention.map((product) => (
                <Card
                  key={product.name}
                  variant="outlined"
                  sx={{ bgcolor: alpha('#f59e0b', 0.03), borderColor: alpha('#f59e0b', 0.2) }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" fontWeight={700} mb={1}>{product.name}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Issue: {product.issue}
                        </Typography>
                        <Typography variant="caption" color="error" fontWeight={700}>
                          Impact: {product.impact}
                        </Typography>
                      </Box>
                      <Button variant="contained" size="small" color="warning" sx={{ fontWeight: 700 }}>
                        Fix Now
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Chip,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Badge,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AutoAwesomeIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RepricingRule } from '../../types/index';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock repricing rules
const generateMockRules = (): RepricingRule[] => {
  return [
    {
      id: 'RPR-001',
      productName: 'Samsung Galaxy Buds',
      currentPrice: 5999,
      strategy: 'Match Lowest',
      minPrice: 5500,
      maxPrice: 6500,
      isActive: true,
      lastAdjusted: '2026-02-10',
      competitors: ['Amazon', 'Flipkart'],
    },
    {
      id: 'RPR-002',
      productName: 'Wireless Mouse Logitech',
      currentPrice: 699,
      strategy: 'Undercut by 5%',
      minPrice: 600,
      maxPrice: 799,
      isActive: true,
      lastAdjusted: '2026-02-11',
      competitors: ['Amazon', 'Snapdeal'],
    },
    {
      id: 'RPR-003',
      productName: 'Denim Jeans Black',
      currentPrice: 1299,
      strategy: 'Fixed Margin',
      minPrice: 1100,
      maxPrice: 1500,
      isActive: false,
      lastAdjusted: '2026-02-08',
      competitors: ['Myntra', 'Ajio'],
    },
    {
      id: 'RPR-004',
      productName: 'Smart LED Bulb',
      currentPrice: 499,
      strategy: 'Dynamic AI',
      minPrice: 450,
      maxPrice: 599,
      isActive: true,
      lastAdjusted: '2026-02-12',
      competitors: ['Amazon', 'Flipkart', 'Moglix'],
    },
    {
      id: 'RPR-005',
      productName: 'Bluetooth Speaker',
      currentPrice: 1899,
      strategy: 'Match Lowest',
      minPrice: 1700,
      maxPrice: 2100,
      isActive: true,
      lastAdjusted: '2026-02-09',
      competitors: ['Flipkart', 'Croma'],
    },
    {
      id: 'RPR-006',
      productName: 'Face Cream SPF 50',
      currentPrice: 599,
      strategy: 'Undercut by 3%',
      minPrice: 550,
      maxPrice: 699,
      isActive: true,
      lastAdjusted: '2026-02-11',
      competitors: ['Nykaa', 'Amazon'],
    },
    {
      id: 'RPR-007',
      productName: 'Basmati Rice 5kg',
      currentPrice: 499,
      strategy: 'Fixed Margin',
      minPrice: 450,
      maxPrice: 550,
      isActive: false,
      lastAdjusted: '2026-02-07',
      competitors: ['BigBasket', 'Blinkit'],
    },
    {
      id: 'RPR-008',
      productName: 'USB-C Cable 2m',
      currentPrice: 249,
      strategy: 'Dynamic AI',
      minPrice: 200,
      maxPrice: 299,
      isActive: true,
      lastAdjusted: '2026-02-12',
      competitors: ['Amazon', 'Flipkart'],
    },
  ];
};

const AutoRepricing: React.FC = () => {
  const { t } = useTranslation();
  const [rules, setRules] = useState<RepricingRule[]>(generateMockRules());
  const [systemActive, setSystemActive] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // New rule form
  const [newRule, setNewRule] = useState({
    productName: '',
    currentPrice: 0,
    strategy: 'Match Lowest',
    minPrice: 0,
    maxPrice: 0,
    undercutPercentage: 5,
    fixedMargin: 20,
    competitors: [] as string[],
    isActive: true,
  });

  // Mock product list for autocomplete
  const productList = [
    'Samsung Galaxy Buds',
    'Wireless Mouse Logitech',
    'Cotton T-Shirt Blue',
    'Denim Jeans Black',
    'Basmati Rice 5kg',
    'Smart LED Bulb',
    'Bluetooth Speaker',
    'Face Cream SPF 50',
    'USB-C Cable 2m',
  ];

  const competitorList = ['Amazon', 'Flipkart', 'Snapdeal', 'Myntra', 'Ajio', 'Nykaa', 'BigBasket', 'Blinkit', 'Croma', 'Moglix'];

  // Price adjustment history chart data
  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }),
    datasets: [
      {
        label: t('Average Price'),
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500),
        borderColor: '#1a237e',
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        tension: 0.4,
      },
      {
        label: t('Competitor Avg Price'),
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 480),
        borderColor: '#ff6f00',
        backgroundColor: 'rgba(255, 111, 0, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('Price Adjustment History - Last 30 Days'),
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return '₹' + value;
          },
        },
      },
    },
  };

  const handleToggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, isActive: !rule.isActive } : rule)));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleCreateRule = () => {
    const strategyDisplay =
      newRule.strategy === 'Undercut by %'
        ? `Undercut by ${newRule.undercutPercentage}%`
        : newRule.strategy === 'Fixed Margin'
        ? 'Fixed Margin'
        : newRule.strategy;

    const rule: RepricingRule = {
      id: `RPR-${String(rules.length + 1).padStart(3, '0')}`,
      productName: newRule.productName,
      currentPrice: newRule.currentPrice,
      strategy: strategyDisplay,
      minPrice: newRule.minPrice,
      maxPrice: newRule.maxPrice,
      isActive: newRule.isActive,
      lastAdjusted: new Date().toISOString().split('T')[0],
      competitors: newRule.competitors,
    };

    setRules([rule, ...rules]);
    setCreateDialogOpen(false);
    setNewRule({
      productName: '',
      currentPrice: 0,
      strategy: 'Match Lowest',
      minPrice: 0,
      maxPrice: 0,
      undercutPercentage: 5,
      fixedMargin: 20,
      competitors: [],
      isActive: true,
    });
  };

  // Statistics
  const totalAdjustments = 147;
  const avgPriceChange = -4.2;
  const revenueImpact = 28500;
  const activeRules = rules.filter((rule) => rule.isActive).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
            {t('Smart Auto-Repricing')}
          </Typography>
          <Badge badgeContent={systemActive ? t('Active') : t('Paused')} color={systemActive ? 'success' : 'error'} />
        </Box>
        <Switch checked={systemActive} onChange={(e) => setSystemActive(e.target.checked)} />
      </Box>

      {/* How It Works Section */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('How It Works')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <AssessmentIcon sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('1. Monitor Competitors')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Our system continuously tracks competitor prices across multiple platforms in real-time.')}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <AutoAwesomeIcon sx={{ fontSize: 60, color: '#ff6f00', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('2. Apply Smart Rules')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Based on your strategy, we calculate optimal prices while respecting min/max limits.')}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('3. Update Prices')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Prices are automatically adjusted across all your sales channels instantly.')}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('Total Adjustments This Month')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mt: 1 }}>
                {totalAdjustments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('Average Price Change')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: avgPriceChange < 0 ? '#4caf50' : '#f44336' }}>
                  {avgPriceChange}%
                </Typography>
                {avgPriceChange < 0 ? (
                  <TrendingDownIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                ) : (
                  <TrendingUpIcon sx={{ color: '#f44336', fontSize: 32 }} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('Revenue Impact')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50', mt: 1 }}>
                +₹{revenueImpact.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('Active Rules')}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mt: 1 }}>
                {activeRules}/{rules.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Price Adjustment History Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ height: 300 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      {/* Active Repricing Rules */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('Active Repricing Rules')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
        >
          {t('Create New Rule')}
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>{t('Product Name')}</TableCell>
                <TableCell align="right">{t('Current Price')}</TableCell>
                <TableCell>{t('Strategy')}</TableCell>
                <TableCell align="center">{t('Price Range')}</TableCell>
                <TableCell align="center">{t('Status')}</TableCell>
                <TableCell>{t('Last Adjusted')}</TableCell>
                <TableCell align="center">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {rule.productName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      ₹{rule.currentPrice.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={rule.strategy}
                      size="small"
                      sx={{
                        bgcolor:
                          rule.strategy === 'Dynamic AI'
                            ? '#e3f2fd'
                            : rule.strategy.includes('Undercut')
                            ? '#fff3e0'
                            : '#f1f8e9',
                        color:
                          rule.strategy === 'Dynamic AI'
                            ? '#1976d2'
                            : rule.strategy.includes('Undercut')
                            ? '#f57c00'
                            : '#689f38',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      ₹{rule.minPrice} - ₹{rule.maxPrice}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Switch checked={rule.isActive} onChange={() => handleToggleRule(rule.id)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(rule.lastAdjusted).toLocaleDateString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteRule(rule.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create New Rule Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('Create New Repricing Rule')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Product Selection */}
            <Autocomplete
              options={productList}
              value={newRule.productName}
              onChange={(_, value) => setNewRule({ ...newRule, productName: value || '' })}
              renderInput={(params) => <TextField {...params} label={t('Select Product')} />}
            />

            {/* Current Price */}
            <TextField
              label={t('Current Price (INR)')}
              type="number"
              value={newRule.currentPrice}
              onChange={(e) => setNewRule({ ...newRule, currentPrice: Number(e.target.value) })}
              fullWidth
            />

            {/* Strategy Selection */}
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {t('Repricing Strategy')}
              </Typography>
              <RadioGroup
                value={newRule.strategy}
                onChange={(e) => setNewRule({ ...newRule, strategy: e.target.value })}
              >
                <FormControlLabel
                  value="Match Lowest"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('Match Lowest')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('Automatically match the lowest competitor price')}
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="Undercut by %"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('Undercut by %')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('Set price X% below lowest competitor')}
                      </Typography>
                    </Box>
                  }
                />
                {newRule.strategy === 'Undercut by %' && (
                  <Box sx={{ ml: 4, mt: 1, mb: 2 }}>
                    <Typography variant="caption" gutterBottom>
                      {t('Undercut Percentage')}: {newRule.undercutPercentage}%
                    </Typography>
                    <Slider
                      value={newRule.undercutPercentage}
                      onChange={(_, value) => setNewRule({ ...newRule, undercutPercentage: value as number })}
                      min={1}
                      max={20}
                      valueLabelDisplay="auto"
                      sx={{ color: '#ff6f00' }}
                    />
                  </Box>
                )}
                <FormControlLabel
                  value="Fixed Margin"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('Fixed Margin')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('Maintain a fixed profit margin')}
                      </Typography>
                    </Box>
                  }
                />
                {newRule.strategy === 'Fixed Margin' && (
                  <Box sx={{ ml: 4, mt: 1, mb: 2 }}>
                    <TextField
                      label={t('Profit Margin %')}
                      type="number"
                      value={newRule.fixedMargin}
                      onChange={(e) => setNewRule({ ...newRule, fixedMargin: Number(e.target.value) })}
                      size="small"
                      fullWidth
                    />
                  </Box>
                )}
                <FormControlLabel
                  value="Dynamic AI"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('Dynamic AI')}{' '}
                        <Chip label="Pro" size="small" sx={{ ml: 1, bgcolor: '#ff6f00', color: 'white' }} />
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('AI optimizes price based on demand and competition')}
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Divider />

            {/* Price Range */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label={t('Minimum Price (INR)')}
                  type="number"
                  value={newRule.minPrice}
                  onChange={(e) => setNewRule({ ...newRule, minPrice: Number(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t('Maximum Price (INR)')}
                  type="number"
                  value={newRule.maxPrice}
                  onChange={(e) => setNewRule({ ...newRule, maxPrice: Number(e.target.value) })}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Competitor Selection */}
            <Autocomplete
              multiple
              options={competitorList}
              value={newRule.competitors}
              onChange={(_, value) => setNewRule({ ...newRule, competitors: value })}
              renderInput={(params) => <TextField {...params} label={t('Select Competitors to Track')} />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
              }
            />

            {/* Enable/Disable */}
            <FormControlLabel
              control={
                <Switch
                  checked={newRule.isActive}
                  onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                />
              }
              label={t('Enable this rule immediately')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>{t('Cancel')}</Button>
          <Button
            onClick={handleCreateRule}
            variant="contained"
            disabled={!newRule.productName || newRule.currentPrice <= 0 || newRule.competitors.length === 0}
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
          >
            {t('Create Rule')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutoRepricing;

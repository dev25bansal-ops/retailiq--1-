import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Slider,
  Divider,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { GSTInfo } from '../../types/index';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock GST data
const generateMockGSTData = (): GSTInfo[] => {
  const products = [
    { name: 'Samsung Galaxy Buds', hsn: '85183000', rate: 18, taxableValue: 509915 },
    { name: 'Wireless Mouse Logitech', hsn: '84716060', rate: 18, taxableValue: 83880 },
    { name: 'Cotton T-Shirt Blue', hsn: '61091000', rate: 5, taxableValue: 17955 },
    { name: 'Denim Jeans Black', hsn: '62034200', rate: 5, taxableValue: 10392 },
    { name: 'Basmati Rice 5kg', hsn: '10063010', rate: 0, taxableValue: 99800 },
    { name: 'Organic Honey 500g', hsn: '04090000', rate: 0, taxableValue: 24750 },
    { name: 'Stainless Steel Kadhai', hsn: '73239990', rate: 18, taxableValue: 25568 },
    { name: 'Face Cream SPF 50', hsn: '33049900', rate: 18, taxableValue: 8985 },
    { name: 'Shampoo Anti-Dandruff', hsn: '33051000', rate: 28, taxableValue: 33155 },
    { name: 'Notebook A4 Ruled', hsn: '48201030', rate: 12, taxableValue: 22250 },
    { name: 'Gel Pen Blue Pack', hsn: '96081010', rate: 18, taxableValue: 745 },
    { name: 'LEGO Building Blocks', hsn: '95030090', rate: 28, taxableValue: 35982 },
    { name: 'Smart LED Bulb', hsn: '85395000', rate: 18, taxableValue: 37425 },
    { name: 'Bluetooth Speaker', hsn: '85182200', rate: 18, taxableValue: 41778 },
    { name: 'Green Tea 100 Bags', hsn: '09021090', rate: 5, taxableValue: 30712 },
  ];

  return products.map((item, index) => {
    const cgst = (item.taxableValue * item.rate) / 200;
    const sgst = (item.taxableValue * item.rate) / 200;
    const totalTax = cgst + sgst;

    return {
      id: `GST-${1000 + index}`,
      productName: item.name,
      hsnCode: item.hsn,
      gstRate: item.rate,
      taxableValue: item.taxableValue,
      cgst,
      sgst,
      igst: 0,
      totalTax,
    };
  });
};

const GSTInsights: React.FC = () => {
  const { t } = useTranslation();
  const [gstData] = useState<GSTInfo[]>(generateMockGSTData());
  const [gstin, setGstin] = useState('27AABCU9603R1ZM');
  const [gstinValid, setGstinValid] = useState(true);
  const [priceAdjustment, setPriceAdjustment] = useState(0);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Validate GSTIN format (15 characters, specific pattern)
  const validateGSTIN = (value: string) => {
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    setGstinValid(gstinPattern.test(value));
  };

  const handleGSTINChange = (value: string) => {
    setGstin(value);
    if (value.length === 15) {
      validateGSTIN(value);
    }
  };

  // Calculate summaries
  const totalGSTCollected = gstData.reduce((sum, item) => sum + item.totalTax, 0);
  const totalCGST = gstData.reduce((sum, item) => sum + item.cgst, 0);
  const totalSGST = gstData.reduce((sum, item) => sum + item.sgst, 0);
  const totalIGST = gstData.reduce((sum, item) => sum + item.igst, 0);

  // Monthly GST trend data (last 6 months)
  const monthlyTrendData = {
    labels: ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'],
    datasets: [
      {
        label: t('GST Collected'),
        data: [98500, 112300, 125600, 138900, 145200, totalGSTCollected],
        backgroundColor: '#1a237e',
      },
    ],
  };

  const monthlyTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('Monthly GST Trend - Last 6 Months'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₹' + (value / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
  };

  // Tax slab distribution
  const slabDistribution: { [key: string]: number } = {};
  gstData.forEach((item) => {
    const slab = `${item.gstRate}%`;
    slabDistribution[slab] = (slabDistribution[slab] || 0) + 1;
  });

  const slabDistributionData = {
    labels: Object.keys(slabDistribution).sort((a, b) => parseInt(a) - parseInt(b)),
    datasets: [
      {
        label: t('Number of Products'),
        data: Object.keys(slabDistribution)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((key) => slabDistribution[key]),
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'],
      },
    ],
  };

  const slabDistributionOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: t('Tax Slab Distribution'),
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Calculate impact of price adjustment
  const adjustedTaxLiability = totalGSTCollected * (1 + priceAdjustment / 100);
  const taxDifference = adjustedTaxLiability - totalGSTCollected;

  const handleExportReport = () => {
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
        {t('GST & Tax Insights')}
      </Typography>

      {/* GSTIN Input */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label={t('GSTIN')}
              value={gstin}
              onChange={(e) => handleGSTINChange(e.target.value)}
              error={!gstinValid && gstin.length === 15}
              helperText={!gstinValid && gstin.length === 15 ? t('Invalid GSTIN format') : t('15-digit GSTIN')}
              sx={{ flex: 1 }}
            />
            {gstinValid && gstin.length === 15 && (
              <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('Total GST Collected')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mt: 1 }}>
                ₹{totalGSTCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('This Month')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('CGST')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#2196f3', mt: 1 }}>
                ₹{totalCGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('Central GST')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('SGST')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800', mt: 1 }}>
                ₹{totalSGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('State GST')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('IGST')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#9c27b0', mt: 1 }}>
                ₹{totalIGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('Integrated GST')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar data={monthlyTrendData} options={monthlyTrendOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ height: 300 }}>
                <Bar data={slabDistributionData} options={slabDistributionOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product-wise GST Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('Product-wise GST Breakdown')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportReport}
              sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
            >
              {t('Export GST Report')}
            </Button>
          </Box>
          {showExportSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('GST Report exported successfully!')}
            </Alert>
          )}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>{t('Product Name')}</TableCell>
                  <TableCell>{t('HSN Code')}</TableCell>
                  <TableCell align="center">{t('GST Rate')}</TableCell>
                  <TableCell align="right">{t('Taxable Value')}</TableCell>
                  <TableCell align="right">{t('CGST')}</TableCell>
                  <TableCell align="right">{t('SGST')}</TableCell>
                  <TableCell align="right">{t('Total Tax')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gstData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {item.hsnCode}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            item.gstRate === 0
                              ? '#4caf50'
                              : item.gstRate === 5
                              ? '#2196f3'
                              : item.gstRate === 12
                              ? '#ff9800'
                              : item.gstRate === 18
                              ? '#f44336'
                              : '#9c27b0',
                        }}
                      >
                        {item.gstRate}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      ₹{item.taxableValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell align="right">
                      ₹{item.cgst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell align="right">
                      ₹{item.sgst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                        ₹{item.totalTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell colSpan={3}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {t('Total')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      ₹{gstData.reduce((sum, item) => sum + item.taxableValue, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      ₹{totalCGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      ₹{totalSGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      ₹{totalGSTCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TrendingUpIcon sx={{ fontSize: 32, color: '#1a237e' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t('Impact Analysis')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('Adjust the slider to see how pricing changes affect your tax liability')}
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              {t('Price Adjustment')}: {priceAdjustment > 0 ? '+' : ''}
              {priceAdjustment}%
            </Typography>
            <Slider
              value={priceAdjustment}
              onChange={(_, value) => setPriceAdjustment(value as number)}
              min={-20}
              max={20}
              step={1}
              marks={[
                { value: -20, label: '-20%' },
                { value: -10, label: '-10%' },
                { value: 0, label: '0%' },
                { value: 10, label: '+10%' },
                { value: 20, label: '+20%' },
              ]}
              valueLabelDisplay="auto"
              sx={{ color: priceAdjustment >= 0 ? '#4caf50' : '#f44336' }}
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {t('Current Tax Liability')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mt: 1 }}>
                    ₹{totalGSTCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {t('Adjusted Tax Liability')}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800', mt: 1 }}>
                    ₹{adjustedTaxLiability.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: taxDifference >= 0 ? '#e8f5e9' : '#ffebee' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {t('Difference')}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: taxDifference >= 0 ? '#4caf50' : '#f44336', mt: 1 }}
                  >
                    {taxDifference >= 0 ? '+' : ''}₹{taxDifference.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GSTInsights;

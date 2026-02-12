import { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { formatINR } from '../utils/formatters';
import { msmeProducts } from '../data/sampleData';

interface CostInputs {
  costBasis: number;
  minimumMargin: number;
  shipping: number;
  overhead: number;
}

interface Scenario {
  label: string;
  price: number;
  margin: number;
  position: string;
  demand: number;
  risk: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
}

export default function PricingStrategy() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [costs, setCosts] = useState<CostInputs>({
    costBasis: 15000,
    minimumMargin: 15,
    shipping: 200,
    overhead: 300,
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  const totalCost = costs.costBasis + costs.shipping + costs.overhead;
  const floorPrice = totalCost * (1 + costs.minimumMargin / 100);

  const handleGenerateStrategy = () => {
    if (!selectedProduct) return;
    setShowAnalysis(true);
  };

  const recommendedPrice = 18999;
  const marketAvg = 19500;

  const scenarios: Scenario[] = [
    {
      label: 'Aggressive',
      price: 17499,
      margin: 14.2,
      position: 'Below Market (-10%)',
      demand: 5,
      risk: 'Medium',
      pros: ['High sales volume', 'Market penetration', 'Competitive edge'],
      cons: ['Lower margins', 'Price war risk', 'Brand perception'],
      recommended: false,
    },
    {
      label: 'Recommended',
      price: 18999,
      margin: 22.5,
      position: 'Competitive (-3%)',
      demand: 4,
      risk: 'Low',
      pros: ['Balanced margin & volume', 'Market aligned', 'Sustainable growth', 'Good ROI'],
      cons: ['Not the cheapest option'],
      recommended: true,
    },
    {
      label: 'Premium',
      price: 20999,
      margin: 35.8,
      position: 'Above Market (+8%)',
      demand: 2,
      risk: 'High',
      pros: ['High profit margins', 'Premium positioning', 'Value perception'],
      cons: ['Lower sales volume', 'Price sensitivity', 'Competition risk'],
      recommended: false,
    },
  ];

  const elasticityData = [
    { price: 16999, units: 85, revenue: 1444915, profit: 364915, roi: 33.8 },
    { price: 17999, units: 68, revenue: 1223932, profit: 383932, roi: 45.7 },
    { price: 18999, units: 52, revenue: 987948, profit: 347948, roi: 54.3 },
    { price: 19999, units: 38, revenue: 759962, profit: 279962, roi: 58.4 },
    { price: 20999, units: 25, revenue: 524975, profit: 184975, roi: 54.5 },
  ];

  const recommendations = [
    'Start with recommended price and monitor sales velocity for 2 weeks',
    'Set up automated price tracking for top 5 competitors',
    'Plan seasonal discounts (5-8%) during festival sales',
    'Bundle with accessories to increase perceived value',
    'Highlight unique features to justify pricing position',
  ];

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
          AI Pricing Strategy Tool
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data-driven pricing recommendations for optimal profitability
        </Typography>
      </Box>

      {/* Step 1: Product Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Step 1: Select Product
          </Typography>
          <TextField
            select
            fullWidth
            label="Choose a product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {msmeProducts.map((product) => (
              <MenuItem key={product.id} value={product.name}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {/* Step 2: Cost Inputs */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Step 2: Cost Structure
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Cost Basis (Product Cost)"
                type="number"
                value={costs.costBasis}
                onChange={(e) => setCosts({ ...costs, costBasis: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Minimum Margin"
                type="number"
                value={costs.minimumMargin}
                onChange={(e) => setCosts({ ...costs, minimumMargin: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Shipping Cost"
                type="number"
                value={costs.shipping}
                onChange={(e) => setCosts({ ...costs, shipping: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Overhead Cost"
                type="number"
                value={costs.overhead}
                onChange={(e) => setCosts({ ...costs, overhead: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Cost
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {formatINR(totalCost)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Floor Price (Min {costs.minimumMargin}% margin)
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {formatINR(floorPrice)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PsychologyIcon />}
          onClick={handleGenerateStrategy}
          disabled={!selectedProduct}
          sx={{ minWidth: 300, py: 1.5 }}
        >
          Generate AI Pricing Strategy
        </Button>
      </Box>

      {/* Analysis Results */}
      {showAnalysis && (
        <>
          {/* AI-Powered Pricing Analysis */}
          <Card sx={{ mb: 3, bgcolor: 'info.lighter' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalculateIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI-Powered Pricing Analysis
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <StarIcon sx={{ fontSize: 32, color: 'warning.main', mr: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatINR(recommendedPrice)}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Recommended Price
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Rationale
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Based on competitive analysis of 23 retailers in Mumbai market, this price positions you 3% below
                    market average while maintaining healthy 22.5% margin. Expected sales velocity: 52 units/month with
                    54.3% ROI.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip label={`Market Avg: ${formatINR(marketAvg)}`} size="small" />
                    <Chip label="22.5% Margin" color="success" size="small" />
                    <Chip label="54.3% ROI" color="success" size="small" />
                    <Chip label="3% Below Market" color="info" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Scenario Analysis */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Scenario Analysis
              </Typography>

              <Grid container spacing={3}>
                {scenarios.map((scenario) => (
                  <Grid size={{ xs: 12, md: 4 }} key={scenario.label}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        border: scenario.recommended ? 2 : 1,
                        borderColor: scenario.recommended ? 'success.main' : 'divider',
                        bgcolor: scenario.recommended ? 'success.lighter' : 'transparent',
                        position: 'relative',
                      }}
                    >
                      {scenario.recommended && (
                        <Chip
                          label="RECOMMENDED"
                          color="success"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 700,
                          }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {scenario.label}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 0.5 }}>
                            {formatINR(scenario.price)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {scenario.margin}% Margin
                          </Typography>
                        </Box>

                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Position:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {scenario.position}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Demand:
                            </Typography>
                            <Box>
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  sx={{
                                    fontSize: 16,
                                    color: i < scenario.demand ? 'warning.main' : 'action.disabled',
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Risk:
                            </Typography>
                            <Chip
                              label={scenario.risk}
                              size="small"
                              color={
                                scenario.risk === 'Low' ? 'success' : scenario.risk === 'Medium' ? 'warning' : 'error'
                              }
                            />
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Pros:
                        </Typography>
                        {scenario.pros.map((pro, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5, mt: 0.25 }} />
                            <Typography variant="body2">{pro}</Typography>
                          </Box>
                        ))}

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                          Cons:
                        </Typography>
                        {scenario.cons.map((con, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                            <CancelIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5, mt: 0.25 }} />
                            <Typography variant="body2">{con}</Typography>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Price Elasticity Analysis */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Price Elasticity Analysis
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Price Point</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Est. Units/Month
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Revenue
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        Profit
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">
                        ROI
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {elasticityData.map((row) => (
                      <TableRow
                        key={row.price}
                        sx={{
                          bgcolor: row.price === recommendedPrice ? 'success.lighter' : 'transparent',
                          '&:hover': { bgcolor: row.price === recommendedPrice ? 'success.lighter' : 'action.hover' },
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ fontWeight: row.price === recommendedPrice ? 600 : 400 }}>
                            {formatINR(row.price)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{row.units}</TableCell>
                        <TableCell align="right">{formatINR(row.revenue)}</TableCell>
                        <TableCell align="right">
                          <Typography sx={{ color: 'success.main', fontWeight: 600 }}>
                            {formatINR(row.profit)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={`${row.roi}%`} size="small" color="success" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Additional Recommendations */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Additional Recommendations
              </Typography>

              <List>
                {recommendations.map((rec, idx) => (
                  <ListItem key={idx} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <TrendingUpIcon sx={{ color: 'info.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Button variant="contained" fullWidth size="large" color="success">
                    Apply Recommended Price
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Button variant="outlined" fullWidth size="large">
                    Save Strategy
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Button variant="outlined" fullWidth size="large">
                    Export Report
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}

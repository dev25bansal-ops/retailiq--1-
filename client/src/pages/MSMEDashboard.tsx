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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Inventory,
  TrendingUp,
  Warning,
  AttachMoney,
  Storage,
  TrendingDown,
  Speed,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { StatsCard, DashboardSkeleton } from '../components/common';
import { msmeApi } from '../api';

const MSMEDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    repricingActivity: 0,
  });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [recentRepricing, setRecentRepricing] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [inventoryRes, opportunitiesRes, threatsRes, repricingRes] = await Promise.allSettled([
        msmeApi.getInventoryStats(),
        msmeApi.getMarketOpportunities(),
        msmeApi.getMarketThreats(),
        msmeApi.getRepricingHistory(),
      ]);

      if (inventoryRes.status === 'fulfilled') {
        const data = inventoryRes.value.data;
        setStats((prev) => ({
          ...prev,
          inStock: data.inStock,
          lowStock: data.lowStock,
          outOfStock: data.outOfStock,
          totalRevenue: data.totalValue || 0,
        }));
      }

      if (opportunitiesRes.status === 'fulfilled') {
        setOpportunities(opportunitiesRes.value.data?.slice(0, 3) || []);
      }

      if (threatsRes.status === 'fulfilled') {
        setThreats(threatsRes.value.data?.slice(0, 3) || []);
      }

      if (repricingRes.status === 'fulfilled') {
        setRecentRepricing(repricingRes.value.data?.slice(0, 5) || []);
        setStats((prev) => ({
          ...prev,
          repricingActivity: repricingRes.value.data?.length || 0,
        }));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 17000, 22000, 24000, 28000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        MSME Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor your business performance and market insights
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<AttachMoney />}
            color="success"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="In Stock"
            value={stats.inStock}
            icon={<Inventory />}
            color="primary"
            onClick={() => navigate('/msme/inventory')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Low Stock"
            value={stats.lowStock}
            icon={<Warning />}
            color="warning"
            onClick={() => navigate('/msme/inventory?status=low_stock')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Repricing Activity"
            value={stats.repricingActivity}
            icon={<Speed />}
            color="info"
            onClick={() => navigate('/msme/repricing')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Revenue Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={revenueData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Inventory Status
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">In Stock</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {stats.inStock}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                    <Box sx={{ height: '100%', width: '70%', bgcolor: 'success.main', borderRadius: 1 }} />
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Low Stock</Typography>
                    <Typography variant="body2" fontWeight="bold" color="warning.main">
                      {stats.lowStock}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                    <Box sx={{ height: '100%', width: '20%', bgcolor: 'warning.main', borderRadius: 1 }} />
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Out of Stock</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                      {stats.outOfStock}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                    <Box sx={{ height: '100%', width: '10%', bgcolor: 'error.main', borderRadius: 1 }} />
                  </Box>
                </Box>
              </Stack>

              <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/msme/inventory')}>
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Market Opportunities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Market Opportunities
              </Typography>
              {opportunities.length === 0 ? (
                <Alert severity="info">No opportunities detected</Alert>
              ) : (
                <Stack spacing={2}>
                  {opportunities.map((opp) => (
                    <Card key={opp.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {opp.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {opp.description}
                        </Typography>
                        <Chip label={`₹${opp.potential_revenue?.toLocaleString()} potential`} size="small" color="success" />
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
              <Button fullWidth variant="text" sx={{ mt: 2 }} onClick={() => navigate('/msme/competitive')}>
                View All Insights
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Market Threats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Market Threats
              </Typography>
              {threats.length === 0 ? (
                <Alert severity="success">No threats detected</Alert>
              ) : (
                <Stack spacing={2}>
                  {threats.map((threat) => (
                    <Card key={threat.id} variant="outlined">
                      <CardContent>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={threat.severity}
                            size="small"
                            color={
                              threat.severity === 'critical'
                                ? 'error'
                                : threat.severity === 'high'
                                ? 'warning'
                                : 'default'
                            }
                          />
                          <Typography variant="subtitle2" fontWeight="bold">
                            {threat.title}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {threat.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
              <Button fullWidth variant="text" sx={{ mt: 2 }} onClick={() => navigate('/msme/competitive')}>
                View All Threats
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="outlined" startIcon={<Inventory />} onClick={() => navigate('/msme/inventory')}>
          Add Inventory
        </Button>
        <Button variant="outlined" startIcon={<Speed />} onClick={() => navigate('/msme/repricing')}>
          Auto-Reprice
        </Button>
        <Button variant="outlined" startIcon={<TrendingUp />} onClick={() => navigate('/msme/pricing')}>
          Pricing Strategy
        </Button>
      </Box>
    </Container>
  );
};

export default MSMEDashboard;

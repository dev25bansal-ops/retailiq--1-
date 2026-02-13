import React, { useEffect, useState } from 'react';
import {
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
  Paper,
  Chip,
  Button,
  Box,
} from '@mui/material';
import { TrendingUp, TrendingDown, ShowChart } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { DashboardSkeleton } from '../components/common';
import { msmeApi } from '../api';

const PricingStrategy: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await msmeApi.getCompetitors();
      setCompetitors(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const chartData = {
    labels: competitors.map((c) => c.name),
    datasets: [
      {
        label: 'Price',
        data: competitors.map((c) => c.price),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Pricing Strategy
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Price Positioning
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={chartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommended Actions
              </Typography>
              <Box>
                <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => navigate('/msme/repricing')}>
                  Setup Auto-Repricing
                </Button>
                <Button fullWidth variant="outlined" onClick={() => navigate('/msme/competitive')}>
                  Competitive Intel
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Competitor Price Comparison
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Competitor</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Trend</TableCell>
                  <TableCell>Market Share</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {competitors.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell>{comp.name}</TableCell>
                    <TableCell>₹{comp.price.toLocaleString()}</TableCell>
                    <TableCell>{comp.rating} ★</TableCell>
                    <TableCell>
                      {comp.price_trend === 'up' ? (
                        <Chip icon={<TrendingUp />} label="Up" color="error" size="small" />
                      ) : comp.price_trend === 'down' ? (
                        <Chip icon={<TrendingDown />} label="Down" color="success" size="small" />
                      ) : (
                        <Chip label="Stable" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{comp.market_share}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PricingStrategy;

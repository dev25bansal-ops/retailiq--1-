import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import { TrendingUp, TrendingDown, Schedule, ShowChart } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { DashboardSkeleton, SearchBar } from '../components/common';
import { predictionsApi, productsApi } from '../api';
import type { Product, ProductCategory } from '../types';

const PredictivePricing: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [bestTimeToBuy, setBestTimeToBuy] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [seasonalData, setSeasonalData] = useState<any[]>([]);

  useEffect(() => {
    if (productId) {
      loadPredictions();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const loadPredictions = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const [productRes, predictionsRes, bestTimeRes, recommendationRes, seasonalRes] = await Promise.allSettled([
        productsApi.getProduct(productId),
        predictionsApi.getProductPredictions(productId, { days: 30 }),
        predictionsApi.getBestTimeToBuy(productId),
        predictionsApi.getBuyOrWait(productId),
        predictionsApi.getSeasonalPatterns(productId),
      ]);

      if (productRes.status === 'fulfilled') setSelectedProduct(productRes.value.data);
      if (predictionsRes.status === 'fulfilled') setPredictions(predictionsRes.value.data || []);
      if (bestTimeRes.status === 'fulfilled') setBestTimeToBuy(bestTimeRes.value.data);
      if (recommendationRes.status === 'fulfilled') setRecommendation(recommendationRes.value.data);
      if (seasonalRes.status === 'fulfilled') setSeasonalData(seasonalRes.value.data || []);
    } catch (err) {
      console.error('Failed to load predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = async (query: string) => {
    try {
      const response = await productsApi.searchProducts(query, { limit: 1 });
      if (response.data && response.data.length > 0) {
        const product = response.data[0];
        window.location.href = `/consumer/predictive?product=${product.id}`;
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (!productId || !selectedProduct) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          AI Price Predictions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Get AI-powered price predictions and buy recommendations
        </Typography>
        <SearchBar
          onSearch={handleProductSelect}
          placeholder="Search for a product to see predictions..."
        />
      </Container>
    );
  }

  const chartData = {
    labels: predictions.map((p) => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Predicted Price',
        data: predictions.map((p) => p.predictedPrice),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
      },
      {
        label: 'Upper Bound',
        data: predictions.map((p) => p.upperBound),
        borderColor: 'rgba(255, 99, 132, 0.3)',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Lower Bound',
        data: predictions.map((p) => p.lowerBound),
        borderColor: 'rgba(54, 162, 235, 0.3)',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const demandChartData = {
    labels: seasonalData.map((s) => s.month),
    datasets: [
      {
        label: 'Average Price',
        data: seasonalData.map((s) => s.avgPrice),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Predictive Pricing for {selectedProduct.product_name}
      </Typography>

      {/* Recommendation Alert */}
      {recommendation && (
        <Alert
          severity={
            recommendation.action === 'buy_now' ? 'success' : recommendation.action === 'wait' ? 'warning' : 'info'
          }
          sx={{ mb: 3 }}
          icon={recommendation.action === 'buy_now' ? <TrendingUp /> : <TrendingDown />}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {recommendation.action === 'buy_now' ? 'Good time to buy!' : 'Consider waiting'}
          </Typography>
          <Typography variant="body2">{recommendation.reasoning}</Typography>
          {recommendation.savingsIfWait > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Potential savings: ₹{recommendation.savingsIfWait.toLocaleString()}
            </Typography>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Best Time to Buy */}
        {bestTimeToBuy && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="primary" />
                  Best Time to Buy
                </Typography>
                <Typography variant="h4" color="primary" sx={{ my: 2 }}>
                  {new Date(bestTimeToBuy.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expected Price: ₹{bestTimeToBuy.price.toLocaleString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label={`${bestTimeToBuy.confidence}% confidence`} size="small" color="primary" />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {bestTimeToBuy.reasoning}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Price Prediction Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                30-Day Price Forecast
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={chartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Seasonal Patterns */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seasonal Price Patterns
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={demandChartData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Price Factors */}
        {predictions.length > 0 && predictions[0].factors && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Factors Influencing Price
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {predictions[0].factors.map((factor: string, index: number) => (
                    <Chip key={index} label={factor} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => window.open(selectedProduct.product_url, '_blank')}>
          Buy Now
        </Button>
        <Button variant="outlined" onClick={() => window.location.href = '/consumer/predictive'}>
          Check Another Product
        </Button>
      </Box>
    </Container>
  );
};

export default PredictivePricing;

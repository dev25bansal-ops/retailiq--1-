import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Stack,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Link as LinkIcon,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Celebration,
  Inventory,
} from '@mui/icons-material';
import { formatINR } from '../utils/formatters';
import { sampleProducts } from '../data/sampleData';

const ProductTracking: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [productUrl, setProductUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<'amazon_india' | 'flipkart' | null>(
    null
  );
  const [selectedProduct] = useState(sampleProducts[0]);
  const [alertSettings, setAlertSettings] = useState({
    priceDrop: true,
    priceIncrease: false,
    festivalDeals: true,
  });
  const [targetPrice, setTargetPrice] = useState('');
  const [trackingSuccess, setTrackingSuccess] = useState(false);

  const handleUrlChange = (url: string) => {
    setProductUrl(url);
    if (url.includes('amazon.in') || url.includes('amazon.com')) {
      setDetectedPlatform('amazon_india');
    } else if (url.includes('flipkart.com')) {
      setDetectedPlatform('flipkart');
    } else {
      setDetectedPlatform(null);
    }
  };

  const handleFetchProduct = () => {
    if (productUrl && detectedPlatform) {
      // Simulate fetching product details
      setTimeout(() => {
        setStep(2);
      }, 500);
    }
  };

  const handleContinueToSettings = () => {
    setStep(3);
  };

  const handleStartTracking = () => {
    setTrackingSuccess(true);
    setStep(4);
  };

  const handleTrackAnother = () => {
    setStep(1);
    setProductUrl('');
    setDetectedPlatform(null);
    setTargetPrice('');
    setTrackingSuccess(false);
    setAlertSettings({
      priceDrop: true,
      priceIncrease: false,
      festivalDeals: true,
    });
  };

  return (
    <Container maxWidth="md" disableGutters>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Track Product Price
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter a product URL from Amazon or Flipkart to start tracking price changes
      </Typography>

      {/* Step Indicators */}
      <Stack direction="row" spacing={2} mb={3} justifyContent="center">
        {[1, 2, 3].map((s) => (
          <Stack key={s} direction="row" alignItems="center" spacing={1}>
            <Chip
              label={s}
              color={step >= s ? 'primary' : 'default'}
              size="small"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                fontWeight: 'bold',
              }}
            />
            {s < 3 && (
              <Box
                sx={{
                  width: 40,
                  height: 2,
                  bgcolor: step > s ? 'primary.main' : 'grey.300',
                }}
              />
            )}
          </Stack>
        ))}
      </Stack>

      {/* Step 1: URL Input */}
      {step >= 1 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Chip label="Step 1" color="primary" size="small" />
              <Typography variant="h6">Enter Product URL</Typography>
            </Stack>
            <TextField
              fullWidth
              label="Product URL"
              placeholder="https://amazon.in/product-name or https://flipkart.com/product-name"
              value={productUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={step > 1}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            {detectedPlatform && (
              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  label={detectedPlatform === 'amazon_india' ? 'Amazon India' : 'Flipkart'}
                  color="primary"
                  size="small"
                />
                <Typography variant="caption" color="text.secondary" alignSelf="center">
                  Platform detected
                </Typography>
              </Stack>
            )}
            {step === 1 && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleFetchProduct}
                disabled={!productUrl || !detectedPlatform}
              >
                Fetch Product Details
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Product Details */}
      {step >= 2 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Chip label="Step 2" color="primary" size="small" />
              <Typography variant="h6">Product Details</Typography>
            </Stack>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Box
                  sx={{
                    width: { xs: '100%', sm: 150 },
                    height: 150,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
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
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={selectedProduct.brand} size="small" />
                      <Chip label={selectedProduct.category} size="small" variant="outlined" />
                      <Chip
                        label={
                          selectedProduct.platform === 'amazon_india'
                            ? 'Amazon India'
                            : 'Flipkart'
                        }
                        size="small"
                        color="primary"
                      />
                    </Stack>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {formatINR(selectedProduct.current_price)}
                    </Typography>
                    {selectedProduct.original_price > selectedProduct.current_price && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: 'line-through' }}
                          color="text.secondary"
                        >
                          {formatINR(selectedProduct.original_price)}
                        </Typography>
                        <Chip
                          label={`${Math.round(
                            ((selectedProduct.original_price - selectedProduct.current_price) /
                              selectedProduct.original_price) *
                              100
                          )}% OFF`}
                          size="small"
                          color="success"
                        />
                      </Stack>
                    )}
                    <Chip
                      label={
                        selectedProduct.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'
                      }
                      size="small"
                      color={selectedProduct.availability === 'in_stock' ? 'success' : 'error'}
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Paper>
            {step === 2 && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleContinueToSettings}
                sx={{ mt: 2 }}
              >
                Continue to Alert Settings
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Alert Settings */}
      {step >= 3 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Chip label="Step 3" color="primary" size="small" />
              <Typography variant="h6">Alert Settings</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Choose when you want to be notified about this product
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alertSettings.priceDrop}
                    onChange={(e) =>
                      setAlertSettings({ ...alertSettings, priceDrop: e.target.checked })
                    }
                    disabled={step > 3}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingDown color="success" fontSize="small" />
                    <Typography variant="body2">Price Drop Alerts</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alertSettings.priceIncrease}
                    onChange={(e) =>
                      setAlertSettings({ ...alertSettings, priceIncrease: e.target.checked })
                    }
                    disabled={step > 3}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUp color="error" fontSize="small" />
                    <Typography variant="body2">Price Increase Alerts</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alertSettings.festivalDeals}
                    onChange={(e) =>
                      setAlertSettings({ ...alertSettings, festivalDeals: e.target.checked })
                    }
                    disabled={step > 3}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Celebration color="warning" fontSize="small" />
                    <Typography variant="body2">Festival Deal Alerts</Typography>
                  </Stack>
                }
              />
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Target Price (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Get notified when the price drops to or below this amount
            </Typography>
            <TextField
              fullWidth
              label="Target Price"
              placeholder="Enter your target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              disabled={step > 3}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            {step === 3 && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleStartTracking}
                startIcon={<Inventory />}
              >
                Start Tracking Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success Confirmation */}
      {step === 4 && trackingSuccess && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
              <Typography variant="h5" fontWeight="bold" color="success.main">
                Product Tracking Started!
              </Typography>
              <Alert severity="success" sx={{ width: '100%' }}>
                <Typography variant="body2">
                  We're now monitoring <strong>{selectedProduct.product_name}</strong> for you.
                  You'll receive alerts based on your preferences.
                </Typography>
              </Alert>
              <Paper variant="outlined" sx={{ p: 2, width: '100%' }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Your Alert Settings:
                </Typography>
                <Stack spacing={1} mt={1}>
                  {alertSettings.priceDrop && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="body2">Price drop notifications enabled</Typography>
                    </Stack>
                  )}
                  {alertSettings.priceIncrease && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="body2">
                        Price increase notifications enabled
                      </Typography>
                    </Stack>
                  )}
                  {alertSettings.festivalDeals && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="body2">Festival deal notifications enabled</Typography>
                    </Stack>
                  )}
                  {targetPrice && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle fontSize="small" color="success" />
                      <Typography variant="body2">
                        Target price set to {formatINR(Number(targetPrice))}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>
              <Stack direction="row" spacing={2} width="100%">
                <Button variant="outlined" fullWidth onClick={handleTrackAnother}>
                  Track Another Product
                </Button>
                <Button variant="contained" fullWidth component={Link} to="/consumer/dashboard">
                  Go to Dashboard
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProductTracking;

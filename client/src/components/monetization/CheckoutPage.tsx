import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Divider,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  Paper,
  Collapse,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Wallet,
  QrCode,
  Lock,
  CheckCircle,
  Discount,
  Shield,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

interface PaymentState {
  type: PaymentMethodType;
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bank?: string;
  walletProvider?: string;
}

const banks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
];

const walletProviders = [
  'Paytm',
  'PhonePe',
  'Freecharge',
];

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const currentSubscription = useSubscriptionStore((state) => state.currentSubscription);
  const plans = useSubscriptionStore((state) => state.plans);
  const isProcessing = useSubscriptionStore((state) => state.isProcessing);
  const subscribe = useSubscriptionStore((state) => state.subscribe);
  
  const [paymentState, setPaymentState] = useState<PaymentState>({
    type: 'upi',
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get selected plan from URL or use current plan
  const selectedPlanId = new URLSearchParams(window.location.search).get('plan') || currentSubscription?.plan?.id;
  const selectedPlan = plans.find((p: any) => p.id === selectedPlanId) || plans[0];

  const basePrice = selectedPlan.price || 0;
  const gstAmount = basePrice * 0.18;
  const discountAmount = (basePrice * discount) / 100;
  const totalAmount = basePrice - discountAmount + gstAmount;

  const handleApplyPromo = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
      setPromoApplied(true);
      setErrors({});
    } else if (promoCode.toUpperCase() === 'FIRST20') {
      setDiscount(20);
      setPromoApplied(true);
      setErrors({});
    } else {
      setErrors({ promo: 'Invalid promo code' });
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentState.type === 'upi') {
      if (!paymentState.upiId) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(paymentState.upiId)) {
        newErrors.upiId = 'Invalid UPI ID format';
      }
    } else if (paymentState.type === 'card') {
      if (!paymentState.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(paymentState.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (!paymentState.cardExpiry) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentState.cardExpiry)) {
        newErrors.cardExpiry = 'Invalid expiry date (MM/YY)';
      }
      if (!paymentState.cardCvv) {
        newErrors.cardCvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentState.cardCvv)) {
        newErrors.cardCvv = 'Invalid CVV';
      }
    } else if (paymentState.type === 'netbanking') {
      if (!paymentState.bank) {
        newErrors.bank = 'Please select a bank';
      }
    } else if (paymentState.type === 'wallet') {
      if (!paymentState.walletProvider) {
        newErrors.wallet = 'Please select a wallet';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      return;
    }

    try {
      await subscribe(
        selectedPlan?.id || '',
        'monthly',
        paymentState.type,
        promoApplied ? promoCode : undefined
      );
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch {
      // Error is handled in the store
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const maskCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').slice(0, 19);
  };

  if (paymentSuccess) {
    return (
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircle
                sx={{
                  fontSize: 100,
                  color: 'success.main',
                  mb: 3,
                  animation: 'scaleIn 0.5s ease-out',
                  '@keyframes scaleIn': {
                    '0%': { transform: 'scale(0)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }}
              />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Payment Successful!
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                Welcome to {selectedPlan.name}!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Your subscription has been activated. Redirecting to dashboard...
              </Typography>
              <CircularProgress />
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, mb: 4 }}
        >
          Complete Your Purchase
        </Typography>

        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Payment Method
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentState.type}
                    onChange={(e) =>
                      setPaymentState({ type: e.target.value as PaymentMethodType })
                    }
                  >
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <QrCode />
                          <Typography>UPI</Typography>
                        </Stack>
                      }
                    />
                    <Collapse in={paymentState.type === 'upi'}>
                      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                        <TextField
                          fullWidth
                          label="UPI ID"
                          placeholder="yourname@upi"
                          value={paymentState.upiId || ''}
                          onChange={(e) =>
                            setPaymentState({ ...paymentState, upiId: e.target.value })
                          }
                          error={!!errors.upiId}
                          helperText={errors.upiId}
                          sx={{ mb: 2 }}
                        />
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                          <Chip label="PhonePe" variant="outlined" />
                          <Chip label="Google Pay" variant="outlined" />
                          <Chip label="Paytm" variant="outlined" />
                        </Stack>
                      </Box>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />

                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CreditCard />
                          <Typography>Credit/Debit Card</Typography>
                        </Stack>
                      }
                    />
                    <Collapse in={paymentState.type === 'card'}>
                      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          value={paymentState.cardNumber || ''}
                          onChange={(e) =>
                            setPaymentState({
                              ...paymentState,
                              cardNumber: maskCardNumber(e.target.value),
                            })
                          }
                          error={!!errors.cardNumber}
                          helperText={errors.cardNumber}
                          inputProps={{ maxLength: 19 }}
                          sx={{ mb: 2 }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Expiry Date"
                              placeholder="MM/YY"
                              value={paymentState.cardExpiry || ''}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                setPaymentState({ ...paymentState, cardExpiry: value });
                              }}
                              error={!!errors.cardExpiry}
                              helperText={errors.cardExpiry}
                              inputProps={{ maxLength: 5 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="CVV"
                              placeholder="123"
                              type="password"
                              value={paymentState.cardCvv || ''}
                              onChange={(e) =>
                                setPaymentState({
                                  ...paymentState,
                                  cardCvv: e.target.value.replace(/\D/g, ''),
                                })
                              }
                              error={!!errors.cardCvv}
                              helperText={errors.cardCvv}
                              inputProps={{ maxLength: 4 }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />

                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccountBalance />
                          <Typography>Net Banking</Typography>
                        </Stack>
                      }
                    />
                    <Collapse in={paymentState.type === 'netbanking'}>
                      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                        <FormControl fullWidth error={!!errors.bank}>
                          <Select
                            value={paymentState.bank || ''}
                            onChange={(e) =>
                              setPaymentState({ ...paymentState, bank: e.target.value })
                            }
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select your bank
                            </MenuItem>
                            {banks.map((bank) => (
                              <MenuItem key={bank} value={bank}>
                                {bank}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.bank && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.bank}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />

                    <FormControlLabel
                      value="wallet"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Wallet />
                          <Typography>Wallet</Typography>
                        </Stack>
                      }
                    />
                    <Collapse in={paymentState.type === 'wallet'}>
                      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                        <FormControl fullWidth error={!!errors.wallet}>
                          <Select
                            value={paymentState.walletProvider || ''}
                            onChange={(e) =>
                              setPaymentState({
                                ...paymentState,
                                walletProvider: e.target.value,
                              })
                            }
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select wallet provider
                            </MenuItem>
                            {walletProviders.map((provider) => (
                              <MenuItem key={provider} value={provider}>
                                {provider}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.wallet && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.wallet}
                            </Typography>
                          )}
                        </FormControl>
                      </Box>
                    </Collapse>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Security Badges */}
            <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Shield color="primary" fontSize="small" />
                    <Typography variant="caption">256-bit SSL</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Shield color="primary" fontSize="small" />
                    <Typography variant="caption">PCI DSS Compliant</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Shield color="primary" fontSize="small" />
                    <Typography variant="caption">Razorpay Secure</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 24 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {selectedPlan.name} Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPlan.billingCycle === 'yearly' ? 'Annual' : 'Monthly'} billing
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Promo Code */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      error={!!errors.promo}
                      helperText={errors.promo}
                      disabled={promoApplied}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Discount />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyPromo}
                      disabled={!promoCode || promoApplied}
                    >
                      Apply
                    </Button>
                  </Stack>
                  {promoApplied && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      Promo code applied! {discount}% discount
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Price Breakdown */}
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Plan Price</Typography>
                    <Typography>{formatPrice(basePrice)}</Typography>
                  </Stack>
                  {discount > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="success.main">Discount ({discount}%)</Typography>
                      <Typography color="success.main">
                        -{formatPrice(discountAmount)}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>GST (18%)</Typography>
                    <Typography>{formatPrice(gstAmount)}</Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {formatPrice(totalAmount)}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  startIcon={isProcessing ? <CircularProgress size={20} /> : <Lock />}
                  sx={{ mb: 2 }}
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}
                </Button>

                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

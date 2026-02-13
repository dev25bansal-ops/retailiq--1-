import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Check,
  Close,
  ExpandMore,
  Verified,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

interface PlanFeature {
  name: string;
  included: boolean;
  value?: string;
}

interface Plan {
  id: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonAction: 'current' | 'upgrade' | 'contact';
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tier: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: 'Track up to 5 products', included: true },
      { name: '3 price alerts', included: true },
      { name: 'Basic price history (30 days)', included: true },
      { name: '1 competitor tracking', included: true },
      { name: 'Community access', included: true },
      { name: 'Email notifications', included: false },
      { name: 'Export capabilities', included: false },
      { name: 'AI predictions', included: false },
      { name: 'API access', included: false },
    ],
    buttonText: 'Get Started',
    buttonAction: 'current',
  },
  {
    id: 'basic',
    name: 'Basic',
    tier: 'basic',
    monthlyPrice: 999,
    yearlyPrice: 9590,
    features: [
      { name: 'Track up to 50 products', included: true },
      { name: '25 price alerts', included: true },
      { name: 'Full price history (1 year)', included: true },
      { name: '5 competitor tracking', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Export to CSV', included: true },
      { name: 'Priority support', included: true },
      { name: 'AI predictions', included: false },
      { name: 'API access', included: false },
    ],
    buttonText: 'Upgrade to Basic',
    buttonAction: 'upgrade',
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    monthlyPrice: 2999,
    yearlyPrice: 28790,
    popular: true,
    features: [
      { name: 'Track up to 500 products', included: true },
      { name: 'Unlimited price alerts', included: true },
      { name: 'Full price history (all time)', included: true },
      { name: '25 competitor tracking', included: true },
      { name: 'All notification channels', included: true },
      { name: 'AI price predictions', included: true },
      { name: 'Demand forecasting', included: true },
      { name: 'Auto-repricing (MSME)', included: true },
      { name: 'GST insights', included: true },
      { name: 'API access', included: true },
      { name: 'Export PDF/Excel', included: true },
      { name: 'WhatsApp alerts', included: true },
    ],
    buttonText: 'Upgrade to Pro',
    buttonAction: 'upgrade',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    monthlyPrice: 9999,
    yearlyPrice: 95990,
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited products', included: true },
      { name: 'Unlimited competitors', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'SLA guarantees', included: true },
      { name: 'Team management (up to 25)', included: true },
      { name: 'White-label reports', included: true },
      { name: 'Custom AI models', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonAction: 'contact',
  },
];

const featureComparison = [
  { feature: 'Products tracked', free: '5', basic: '50', pro: '500', enterprise: 'Unlimited' },
  { feature: 'Price alerts', free: '3', basic: '25', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Price history', free: '30 days', basic: '1 year', pro: 'All time', enterprise: 'All time' },
  { feature: 'Competitor tracking', free: '1', basic: '5', pro: '25', enterprise: 'Unlimited' },
  { feature: 'Email notifications', free: false, basic: true, pro: true, enterprise: true },
  { feature: 'WhatsApp alerts', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'AI price predictions', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'Demand forecasting', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'Auto-repricing', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'GST insights', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'API access', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'Export CSV', free: false, basic: true, pro: true, enterprise: true },
  { feature: 'Export PDF/Excel', free: false, basic: false, pro: true, enterprise: true },
  { feature: 'Priority support', free: false, basic: true, pro: true, enterprise: true },
  { feature: 'Dedicated manager', free: false, basic: false, pro: false, enterprise: true },
  { feature: 'Custom integrations', free: false, basic: false, pro: false, enterprise: true },
  { feature: 'White-label reports', free: false, basic: false, pro: false, enterprise: true },
  { feature: 'Custom AI models', free: false, basic: false, pro: false, enterprise: true },
];

const faqs = [
  {
    question: 'How does the free plan work?',
    answer: 'The free plan allows you to track up to 5 products and receive basic price alerts. It\'s perfect for individuals or small businesses just getting started with price monitoring.',
  },
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your current billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including UPI, Credit/Debit cards, Net Banking, and digital wallets like Paytm and PhonePe. All payments are processed securely through Razorpay.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us within 30 days for a full refund.',
  },
  {
    question: 'How does annual billing work?',
    answer: 'Annual billing saves you 20% compared to monthly billing. You\'ll be charged once per year, and your subscription will auto-renew unless you cancel.',
  },
  {
    question: 'Do you offer custom enterprise solutions?',
    answer: 'Yes! Our Enterprise plan can be customized to meet your specific needs. Contact our sales team to discuss custom features, integrations, and pricing.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: 'If you reach your plan limits, you\'ll receive a notification to upgrade. Your existing tracked products will continue working, but you won\'t be able to add new ones until you upgrade or remove some products.',
  },
  {
    question: 'Are there any setup fees or hidden charges?',
    answer: 'No setup fees or hidden charges. The price you see is what you pay, plus applicable GST (18%). There are no surprise fees.',
  },
];

export const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [showComparison, setShowComparison] = useState(false);
  
  const currentSubscription = useSubscriptionStore((state) => state.currentSubscription);
  const currentPlan = currentSubscription?.plan?.id || 'free';

  const handlePlanSelect = (plan: Plan) => {
    if (plan.buttonAction === 'current') {
      return;
    }
    
    if (plan.buttonAction === 'contact') {
      window.location.href = 'mailto:sales@retailiq.com?subject=Enterprise Plan Inquiry';
      return;
    }
    
    navigate(`/checkout?plan=${plan.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPlanPrice = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return formatPrice(0);
    return isYearly ? formatPrice(plan.yearlyPrice) : formatPrice(plan.monthlyPrice);
  };

  const getPlanPeriod = () => {
    return isYearly ? '/year' : '/month';
  };

  const getSavings = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 0;
    const yearlyTotal = plan.monthlyPrice * 12;
    const savings = yearlyTotal - plan.yearlyPrice;
    return savings;
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan === planId;
  };

  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check sx={{ color: 'success.main', fontSize: 20 }} />
      ) : (
        <Close sx={{ color: 'text.disabled', fontSize: 20 }} />
      );
    }
    return <Typography variant="body2">{value}</Typography>;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #1a237e 0%, #ff6f00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Unlock the full power of RetailIQ
          </Typography>

          {/* Billing Toggle */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ mb: 6 }}
          >
            <Typography color={!isYearly ? 'primary' : 'text.secondary'}>
              Monthly
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
            <Typography color={isYearly ? 'primary' : 'text.secondary'}>
              Yearly
            </Typography>
            {isYearly && (
              <Chip
                label="Save 20%"
                color="secondary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Stack>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.popular ? 3 : 1,
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: plan.popular ? 'scale(1.07)' : 'scale(1.02)',
                    boxShadow: plan.popular ? 8 : 4,
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="POPULAR"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 700,
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {plan.name}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      {getPlanPrice(plan)}
                      {plan.monthlyPrice > 0 && (
                        <Typography
                          component="span"
                          variant="h6"
                          color="text.secondary"
                        >
                          {getPlanPeriod()}
                        </Typography>
                      )}
                    </Typography>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <Typography variant="caption" color="success.main">
                        Save {formatPrice(getSavings(plan))} yearly
                      </Typography>
                    )}
                  </Box>

                  <List dense sx={{ mb: 3 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {feature.included ? (
                            <Check sx={{ color: 'success.main', fontSize: 20 }} />
                          ) : (
                            <Close sx={{ color: 'text.disabled', fontSize: 20 }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: feature.included ? 'text.primary' : 'text.disabled',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isCurrentPlan(plan.id)}
                    onClick={() => handlePlanSelect(plan)}
                    sx={{ mt: 'auto' }}
                  >
                    {isCurrentPlan(plan.id) ? 'Current Plan' : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Feature Comparison Table */}
        <Box sx={{ mb: 8 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowComparison(!showComparison)}
            endIcon={<ExpandMore sx={{ transform: showComparison ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />}
            sx={{ mb: 2 }}
          >
            {showComparison ? 'Hide' : 'Show'} Detailed Feature Comparison
          </Button>
          
          {showComparison && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Feature</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Free</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Basic</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      Pro
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Enterprise</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {featureComparison.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.feature}</TableCell>
                      <TableCell align="center">{renderFeatureValue(row.free)}</TableCell>
                      <TableCell align="center">{renderFeatureValue(row.basic)}</TableCell>
                      <TableCell align="center" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        {renderFeatureValue(row.pro)}
                      </TableCell>
                      <TableCell align="center">{renderFeatureValue(row.enterprise)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `faq${index}`}
              onChange={(_, isExpanded) => setExpandedFaq(isExpanded ? `faq${index}` : false)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Trust Badges */}
        <Box>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={4}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Verified color="primary" />
                <Typography variant="body2" align="center">
                  Trusted by 10,000+ businesses
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Security color="primary" />
                <Typography variant="body2" align="center">
                  30-day money back guarantee
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <AccountBalance color="primary" />
                <Typography variant="body2" align="center">
                  Secured by Razorpay
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

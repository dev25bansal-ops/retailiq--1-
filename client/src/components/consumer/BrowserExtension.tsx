import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Chip,
  Rating,
  Divider,
} from '@mui/material';
import {
  GetApp,
  NotificationsActive,
  CompareArrows,
  Timeline,
  AutoAwesome,
  Group,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Extension,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const BrowserExtension: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Extension fontSize="large" color="primary" />,
      title: t('consumer.extension.oneClickTitle', 'One-Click Tracking'),
      description: t(
        'consumer.extension.oneClickDesc',
        'Add any product to your watchlist instantly without leaving the page'
      ),
    },
    {
      icon: <CompareArrows fontSize="large" color="primary" />,
      title: t('consumer.extension.priceCompareTitle', 'Instant Price Compare'),
      description: t(
        'consumer.extension.priceCompareDesc',
        'See prices across 8 platforms right on the product page in real-time'
      ),
    },
    {
      icon: <Timeline fontSize="large" color="primary" />,
      title: t('consumer.extension.historyTitle', 'Price History Overlay'),
      description: t(
        'consumer.extension.historyDesc',
        'View complete historical price trends without leaving the product page'
      ),
    },
    {
      icon: <NotificationsActive fontSize="large" color="primary" />,
      title: t('consumer.extension.alertsTitle', 'Smart Alerts'),
      description: t(
        'consumer.extension.alertsDesc',
        'Get notified instantly when prices drop below your target'
      ),
    },
    {
      icon: <AutoAwesome fontSize="large" color="primary" />,
      title: t('consumer.extension.predictionsTitle', 'Festival Predictions'),
      description: t(
        'consumer.extension.predictionsDesc',
        'AI predicts prices during upcoming sales to help you decide when to buy'
      ),
    },
    {
      icon: <Group fontSize="large" color="primary" />,
      title: t('consumer.extension.groupBuyingTitle', 'Group Buying'),
      description: t(
        'consumer.extension.groupBuyingDesc',
        'Create and join group deals right from any product page'
      ),
    },
  ];

  const installSteps = [
    {
      number: '1',
      title: t('consumer.extension.step1', 'Click Download'),
      description: t('consumer.extension.step1Desc', 'Choose your browser and click the download button'),
    },
    {
      number: '2',
      title: t('consumer.extension.step2', 'Add to Browser'),
      description: t('consumer.extension.step2Desc', 'Click "Add Extension" when prompted'),
    },
    {
      number: '3',
      title: t('consumer.extension.step3', 'Start Saving'),
      description: t('consumer.extension.step3Desc', 'Visit any product page and see the magic'),
    },
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Card
          sx={{
            mb: 6,
            background: 'linear-gradient(135deg, #1a237e 0%, #ff6f00 100%)',
            color: 'white',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Chip
                  label={t('consumer.extension.newBadge', 'NEW')}
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                />
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                  {t('consumer.extension.title', 'RetailIQ Browser Extension')}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  {t(
                    'consumer.extension.subtitle',
                    'Track prices with one click from any product page'
                  )}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<GetApp />}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      px: 4,
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    {t('consumer.extension.chromeButton', 'Add to Chrome')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<GetApp />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {t('consumer.extension.firefoxButton', 'Firefox Add-on')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<GetApp />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {t('consumer.extension.edgeButton', 'Edge Add-on')}
                  </Button>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={4.8} precision={0.1} readOnly sx={{ color: '#ffc107' }} />
                    <Typography variant="body2" fontWeight="bold">
                      4.8/5
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {t('consumer.extension.reviews', '3,200 reviews')}
                  </Typography>
                  <Typography variant="body2">•</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {t('consumer.extension.users', '25,000+ users')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                {/* Browser Extension Mockup */}
                <Paper
                  elevation={8}
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '3px solid',
                    borderColor: 'white',
                  }}
                >
                  <Box sx={{ bgcolor: '#e0e0e0', p: 1, borderRadius: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#27c93f' }} />
                    </Box>
                    <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: 0.5, fontSize: '0.7rem' }}>
                      browser-toolbar-extension
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, color: 'text.primary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        RQ
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        RetailIQ
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {t('consumer.extension.mockTitle', 'Product detected on this page')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 2 }}>
                      iPhone 15 (128GB)
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ my: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('consumer.extension.mockCurrentPrice', 'Current price on this page')}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ₹79,999
                      </Typography>
                    </Box>
                    <Paper sx={{ p: 1.5, bgcolor: '#e8f5e9', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {t('consumer.extension.mockBestPrice', 'Best price across platforms')}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" fontWeight="bold" color="success.main">
                            ₹74,999
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Flipkart
                          </Typography>
                        </Box>
                        <Button size="small" variant="outlined">
                          {t('consumer.extension.mockView', 'View')}
                        </Button>
                      </Box>
                    </Paper>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TrendingDown color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main" fontWeight="bold">
                        {t('consumer.extension.mockTrend', 'Price trending down')}
                      </Typography>
                    </Box>
                    <Stack spacing={1}>
                      <Button variant="contained" size="small" fullWidth>
                        {t('consumer.extension.mockTrack', 'Track This Product')}
                      </Button>
                      <Button variant="outlined" size="small" fullWidth sx={{ fontSize: '0.7rem' }}>
                        {t('consumer.extension.mockBuy', 'Buy at Best Price')}
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
            {t('consumer.extension.featuresTitle', 'Powerful Features')}
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'all 0.3s' }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How to Install */}
        <Card sx={{ mb: 6, bgcolor: 'primary.main', color: 'white' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
              {t('consumer.extension.howToInstall', 'How to Install')}
            </Typography>
            <Grid container spacing={4}>
              {installSteps.map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {step.number}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Stats and Social Proof */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="primary">
                25K+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('consumer.extension.activeUsers', 'Active Users')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Rating value={4.8} precision={0.1} readOnly size="large" />
              </Box>
              <Typography variant="h3" fontWeight="bold" color="primary">
                4.8/5
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('consumer.extension.avgRating', 'Average Rating')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h3" fontWeight="bold" color="primary">
                3.2K
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('consumer.extension.totalReviews', 'User Reviews')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* User Testimonials */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
            {t('consumer.extension.testimonialsTitle', 'What Users Say')}
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                name: 'Rajesh Kumar',
                review: t(
                  'consumer.extension.review1',
                  'Saved over ₹15,000 in just 2 months! This extension is a game changer.'
                ),
                rating: 5,
              },
              {
                name: 'Priya Sharma',
                review: t(
                  'consumer.extension.review2',
                  'Love how it shows price comparison right on Amazon. No need to check multiple sites!'
                ),
                rating: 5,
              },
              {
                name: 'Amit Patel',
                review: t(
                  'consumer.extension.review3',
                  'The price history feature helped me wait for the right time to buy. Excellent tool!'
                ),
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    "{testimonial.review}"
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    - {testimonial.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #ff6f00 0%, #1a237e 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              {t('consumer.extension.ctaTitle', 'Start Saving Today')}
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              {t(
                'consumer.extension.ctaSubtitle',
                'Join 25,000+ smart shoppers tracking prices daily'
              )}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<GetApp />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  px: 4,
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                }}
              >
                {t('consumer.extension.downloadChrome', 'Download for Chrome')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {t('consumer.extension.otherBrowsers', 'Other Browsers')}
              </Button>
            </Stack>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <CheckCircle />
              <Typography variant="body2">
                {t('consumer.extension.freeForever', 'Free forever • No credit card required')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BrowserExtension;

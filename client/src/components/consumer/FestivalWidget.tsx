import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Celebration,
  NotificationsActive,
  TrendingDown,
  Schedule,
  LocalOffer,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Festival } from '../../types/index';

const mockFestivals: Festival[] = [
  {
    id: '1',
    name: 'Amazon Great Indian Sale',
    platform: 'Amazon',
    startDate: new Date('2026-02-20T00:00:00'),
    endDate: new Date('2026-02-25T23:59:59'),
    expectedDiscount: { min: 40, max: 70 },
    categories: ['Electronics', 'Fashion', 'Home'],
    icon: '🛍️',
  },
  {
    id: '2',
    name: 'Flipkart Big Billion Days',
    platform: 'Flipkart',
    startDate: new Date('2026-03-01T00:00:00'),
    endDate: new Date('2026-03-06T23:59:59'),
    expectedDiscount: { min: 50, max: 80 },
    categories: ['Electronics', 'Fashion', 'Home', 'Beauty'],
    icon: '💰',
  },
  {
    id: '3',
    name: 'Myntra End of Season Sale',
    platform: 'Myntra',
    startDate: new Date('2026-03-10T00:00:00'),
    endDate: new Date('2026-03-15T23:59:59'),
    expectedDiscount: { min: 50, max: 90 },
    categories: ['Fashion', 'Footwear', 'Accessories'],
    icon: '👗',
  },
  {
    id: '4',
    name: 'Nykaa Pink Friday Sale',
    platform: 'Nykaa',
    startDate: new Date('2026-03-20T00:00:00'),
    endDate: new Date('2026-03-22T23:59:59'),
    expectedDiscount: { min: 30, max: 60 },
    categories: ['Beauty', 'Skincare', 'Makeup'],
    icon: '💄',
  },
  {
    id: '5',
    name: 'Croma Electronics Festival',
    platform: 'Croma',
    startDate: new Date('2026-04-01T00:00:00'),
    endDate: new Date('2026-04-05T23:59:59'),
    expectedDiscount: { min: 25, max: 50 },
    categories: ['Electronics', 'Appliances', 'Gaming'],
    icon: '📱',
  },
];

const platformColors: Record<string, string> = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Myntra: '#EE5F73',
  Nykaa: '#FC2779',
  Croma: '#00A89F',
};

const FestivalWidget: React.FC = () => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [alertEnabled, setAlertEnabled] = useState(false);

  const nextFestival = mockFestivals[0];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = nextFestival.startDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextFestival.startDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <Box sx={{ textAlign: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          minWidth: 80,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          {value.toString().padStart(2, '0')}
        </Typography>
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box>
      {/* Main Countdown Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1a237e 0%, #ff6f00 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Celebration fontSize="large" />
            <Typography variant="h5" fontWeight="bold">
              {t('consumer.festival.nextSale', 'Next Big Sale')}
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            {nextFestival.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip
              label={nextFestival.platform}
              sx={{
                bgcolor: platformColors[nextFestival.platform],
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            <Typography variant="body2">
              {formatDate(nextFestival.startDate)} - {formatDate(nextFestival.endDate)}
            </Typography>
            <Chip
              label={`${nextFestival.expectedDiscount.min}-${nextFestival.expectedDiscount.max}% OFF`}
              sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 'bold' }}
            />
          </Box>

          {/* Countdown Timer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              my: 4,
              flexWrap: 'wrap',
            }}
          >
            <TimeBlock value={countdown.days} label={t('consumer.festival.days', 'Days')} />
            <TimeBlock value={countdown.hours} label={t('consumer.festival.hours', 'Hours')} />
            <TimeBlock value={countdown.minutes} label={t('consumer.festival.minutes', 'Minutes')} />
            <TimeBlock value={countdown.seconds} label={t('consumer.festival.seconds', 'Seconds')} />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={alertEnabled}
                onChange={(e) => setAlertEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'white',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'white',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsActive />
                <Typography>
                  {t('consumer.festival.notifyMe', 'Notify me when sale goes live')}
                </Typography>
              </Box>
            }
          />
        </CardContent>
      </Card>

      {/* Upcoming Sales */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Schedule color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {t('consumer.festival.upcomingSales', 'Upcoming Sales')}
            </Typography>
          </Box>

          <List>
            {mockFestivals.map((festival, index) => (
              <React.Fragment key={festival.id}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography variant="h4">{festival.icon}</Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {festival.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={festival.platform}
                          size="small"
                          sx={{
                            bgcolor: platformColors[festival.platform],
                            color: 'white',
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(festival.startDate)} - {formatDate(festival.endDate)}
                        </Typography>
                        <Chip
                          label={`${festival.expectedDiscount.min}-${festival.expectedDiscount.max}% OFF`}
                          size="small"
                          color="success"
                        />
                      </Box>
                      <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {festival.categories.map((category) => (
                          <Chip
                            key={category}
                            label={category}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<NotificationsActive />}
                        sx={{ textTransform: 'none' }}
                      >
                        {t('consumer.festival.setReminder', 'Set Reminder')}
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
                {index < mockFestivals.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Historical Insights */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingDown color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {t('consumer.festival.historicalInsights', 'Historical Insights')}
            </Typography>
          </Box>

          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', mb: 2 }}>
            <Typography variant="body1" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              {t(
                'consumer.festival.lastYearDiscount',
                'Last year during Amazon Great Indian Sale, prices dropped an average of 52%'
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                'consumer.festival.lastYearDetails',
                'Electronics saw the biggest discounts at 65%, followed by Fashion at 48%'
              )}
            </Typography>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocalOffer color="secondary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t('consumer.festival.bestCategories', 'Best Categories to Buy')}
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Smartphones</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      60-70% OFF
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Laptops</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      45-55% OFF
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Fashion</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      50-80% OFF
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Celebration color="secondary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t('consumer.festival.bestPlatforms', 'Best Platforms for This Festival')}
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">1.</Typography>
                      <Chip
                        label="Amazon"
                        size="small"
                        sx={{ bgcolor: platformColors.Amazon, color: 'white' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Electronics
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">2.</Typography>
                      <Chip
                        label="Flipkart"
                        size="small"
                        sx={{ bgcolor: platformColors.Flipkart, color: 'white' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      All Categories
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">3.</Typography>
                      <Chip
                        label="Myntra"
                        size="small"
                        sx={{ bgcolor: platformColors.Myntra, color: 'white' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Fashion
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: '#fff3e0',
              borderRadius: 2,
              border: '1px solid #ff6f00',
            }}
          >
            <Typography variant="body2" fontWeight="bold" color="warning.dark">
              💡 {t('consumer.festival.proTip', 'Pro Tip:')} {' '}
              {t(
                'consumer.festival.proTipText',
                'Add products to your wishlist now! You\'ll get instant notifications when prices drop during the sale.'
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FestivalWidget;

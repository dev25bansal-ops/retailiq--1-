import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Alert,
} from '@mui/material';
import { Event, NotificationsActive, TrendingUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DashboardSkeleton, PlatformBadge } from '../components/common';
import { festivalsApi } from '../api';
import type { Festival } from '../types';

const FestivalDeals: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFestivals();
  }, []);

  const loadFestivals = async () => {
    try {
      setLoading(true);
      const response = await festivalsApi.getUpcoming(90);
      setFestivals(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    if (now < start) return 0;
    if (now > end) return 100;
    return ((now - start) / (end - start)) * 100;
  };

  const handleSetReminder = async (festivalId: string) => {
    try {
      await festivalsApi.setReminder(festivalId, {
        reminderDate: new Date(Date.now() + 86400000).toISOString(),
        channels: ['email', 'push'],
      });
      alert('Reminder set successfully!');
    } catch (err) {
      console.error('Failed to set reminder:', err);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {t('festivals.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('festivals.subtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {festivals.length === 0 ? (
        <Alert severity="info">No upcoming festivals at the moment.</Alert>
      ) : (
        <Grid container spacing={3}>
          {festivals.map((festival) => {
            const daysLeft = getDaysLeft(festival.end_date);
            const progress = getProgress(festival.start_date, festival.end_date);
            const isActive = progress > 0 && progress < 100;

            return (
              <Grid item xs={12} md={6} lg={4} key={festival.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {festival.bannerUrl && (
                    <CardMedia component="img" height="200" image={festival.bannerUrl} alt={festival.name} />
                  )}

                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {festival.name}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <PlatformBadge platform={festival.platform} />
                        {isActive && <Chip label="LIVE NOW" color="success" size="small" />}
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {isActive ? 'Sale in Progress' : `Starts: ${new Date(festival.start_date).toLocaleDateString()}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ends: {new Date(festival.end_date).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {isActive && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          {daysLeft} days left
                        </Typography>
                        <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.5 }} />
                      </Box>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<TrendingUp />}
                        label={`Up to ${festival.expected_discount} OFF`}
                        color="primary"
                        size="small"
                      />
                    </Box>

                    {festival.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {festival.description}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                      {festival.categories.slice(0, 3).map((cat) => (
                        <Chip key={cat} label={cat} size="small" variant="outlined" />
                      ))}
                      {festival.categories.length > 3 && (
                        <Chip label={`+${festival.categories.length - 3} more`} size="small" variant="outlined" />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/consumer/track?festival=${festival.id}`)}
                      >
                        View Deals
                      </Button>
                      {!isActive && (
                        <Button
                          variant="outlined"
                          startIcon={<NotificationsActive />}
                          onClick={() => handleSetReminder(festival.id)}
                        >
                          Remind
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default FestivalDeals;

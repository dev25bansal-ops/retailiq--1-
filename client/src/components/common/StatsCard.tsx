import React, { useEffect, useState } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface StatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  previousValue,
  icon,
  color = '#1a237e',
  trend,
  format = 'number',
}) => {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState(0);

  // Animated number transition
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayValue(stepValue * currentStep);
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  // Calculate percentage change
  const calculateChange = (): { percentage: number; isPositive: boolean } | null => {
    if (previousValue === undefined || previousValue === 0) return null;

    const change = ((value - previousValue) / previousValue) * 100;
    return {
      percentage: Math.abs(change),
      isPositive: change >= 0,
    };
  };

  const change = calculateChange();

  // Determine trend if not explicitly provided
  const determinedTrend = trend || (change ? (change.isPositive ? 'up' : 'down') : 'neutral');

  // Format value based on type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return `₹${Math.round(val).toLocaleString('en-IN')}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
      default:
        return Math.round(val).toLocaleString('en-IN');
    }
  };

  // Trend icon and color
  const getTrendConfig = () => {
    switch (determinedTrend) {
      case 'up':
        return {
          icon: <TrendingUp fontSize="small" />,
          color: 'success.main',
          bgColor: 'rgba(76, 175, 80, 0.1)',
        };
      case 'down':
        return {
          icon: <TrendingDown fontSize="small" />,
          color: 'error.main',
          bgColor: 'rgba(244, 67, 54, 0.1)',
        };
      case 'neutral':
      default:
        return {
          icon: <TrendingFlat fontSize="small" />,
          color: 'text.secondary',
          bgColor: 'rgba(158, 158, 158, 0.1)',
        };
    }
  };

  const trendConfig = getTrendConfig();

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}15`,
              color: color,
              '& > *': {
                fontSize: 28,
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          }}
        >
          {formatValue(displayValue)}
        </Typography>

        {change && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: trendConfig.bgColor,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trendConfig.color,
              }}
            >
              {trendConfig.icon}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: trendConfig.color,
              }}
            >
              {change.percentage.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {change.isPositive
                ? t('stats.vsLastPeriod', 'vs last period')
                : t('stats.vsLastPeriod', 'vs last period')}
            </Typography>
          </Box>
        )}

        {!change && previousValue !== undefined && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: trendConfig.bgColor,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trendConfig.color,
              }}
            >
              {trendConfig.icon}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {t('stats.noChange', 'No change')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;

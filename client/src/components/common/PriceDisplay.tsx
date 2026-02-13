import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { TrendingDown, TrendingUp, CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface CrossPlatformPrice {
  platform: string;
  price: number;
  url?: string;
}

interface PriceDisplayProps {
  currentPrice: number;
  originalPrice?: number;
  showSavings?: boolean;
  size?: 'small' | 'medium' | 'large';
  showCrossPlatform?: boolean;
  crossPlatformPrices?: CrossPlatformPrice[];
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  showSavings = true,
  size = 'medium',
  showCrossPlatform = false,
  crossPlatformPrices = [],
}) => {
  const { t } = useTranslation();

  // Format price in Indian number system
  const formatINR = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate discount percentage
  const discountPercentage = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Check if this is the lowest price across platforms
  const isLowestPrice = showCrossPlatform && crossPlatformPrices.length > 0
    ? currentPrice <= Math.min(...crossPlatformPrices.map(p => p.price))
    : false;

  // Determine price change trend (for historical comparison)
  const priceTrend = originalPrice
    ? currentPrice < originalPrice
      ? 'down'
      : currentPrice > originalPrice
        ? 'up'
        : 'neutral'
    : 'neutral';

  // Size configurations
  const sizeConfig = {
    small: {
      currentPrice: '1.25rem',
      originalPrice: '0.875rem',
      discount: 'small' as const,
    },
    medium: {
      currentPrice: '1.75rem',
      originalPrice: '1rem',
      discount: 'small' as const,
    },
    large: {
      currentPrice: '2.5rem',
      originalPrice: '1.25rem',
      discount: 'medium' as const,
    },
  };

  const config = sizeConfig[size];

  return (
    <Box>
      {/* Current Price */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: config.currentPrice,
            fontWeight: 'bold',
            color: priceTrend === 'down' ? 'success.main' : priceTrend === 'up' ? 'error.main' : 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {formatINR(currentPrice)}
          {priceTrend === 'down' && <TrendingDown fontSize="small" />}
          {priceTrend === 'up' && <TrendingUp fontSize="small" />}
        </Typography>

        {/* Discount Badge */}
        {showSavings && discountPercentage > 0 && (
          <Chip
            label={`${discountPercentage}% OFF`}
            size={config.discount}
            sx={{
              bgcolor: 'success.main',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        )}

        {/* Lowest Price Badge */}
        {isLowestPrice && (
          <Tooltip title={t('price.lowestAcrossPlatforms', 'Lowest price across all platforms')}>
            <Chip
              icon={<CheckCircle sx={{ fontSize: '1rem !important', color: 'white !important' }} />}
              label={t('price.lowestPrice', 'Lowest')}
              size={config.discount}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* Original Price */}
      {originalPrice && originalPrice > currentPrice && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: config.originalPrice,
              color: 'text.secondary',
              textDecoration: 'line-through',
            }}
          >
            {formatINR(originalPrice)}
          </Typography>
        </Box>
      )}

      {/* Savings Amount */}
      {showSavings && originalPrice && originalPrice > currentPrice && (
        <Typography
          variant="caption"
          sx={{
            color: 'success.main',
            fontWeight: 600,
            display: 'block',
          }}
        >
          {t('price.youSave', 'You save')}: {formatINR(originalPrice - currentPrice)}
        </Typography>
      )}

      {/* Cross-Platform Price Info */}
      {showCrossPlatform && crossPlatformPrices.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Tooltip
            title={
              <Box>
                <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 0.5 }}>
                  {t('price.otherPlatforms', 'Other Platforms')}:
                </Typography>
                {crossPlatformPrices.map((price, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.5 }}>
                    <Typography variant="caption">{price.platform}</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {formatINR(price.price)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            }
            arrow
          >
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              {t('price.compareAcrossPlatforms', 'Compare across {count} platforms', { count: crossPlatformPrices.length })}
            </Typography>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default PriceDisplay;

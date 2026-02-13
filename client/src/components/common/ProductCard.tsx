import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingDown,
  TrendingUp,
  CompareArrows,
  NotificationsActive,
  Link as LinkIcon,
  Star,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types/index';
import PlatformBadge from './PlatformBadge';
import PriceDisplay from './PriceDisplay';

interface ProductCardProps {
  product: Product;
  onTrack?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  showAffiliate?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onTrack,
  onCompare,
  showAffiliate = true,
}) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getAvailabilityConfig = () => {
    switch (product.availability) {
      case 'in_stock':
        return { label: t('product.inStock', 'In Stock'), color: 'success' as const };
      case 'out_of_stock':
        return { label: t('product.outOfStock', 'Out of Stock'), color: 'error' as const };
      case 'limited':
        return { label: t('product.limitedStock', 'Limited Stock'), color: 'warning' as const };
      default:
        return { label: t('product.checkAvailability', 'Check Availability'), color: 'default' as const };
    }
  };

  const availabilityConfig = getAvailabilityConfig();
  const discountPercentage = product.original_price && product.current_price
    ? Math.round(((product.original_price - product.current_price) / product.original_price) * 100)
    : 0;

  const isBestPrice = product.crossPlatformPrices && product.crossPlatformPrices.length > 0
    ? product.current_price <= Math.min(...product.crossPlatformPrices.map(p => p.price))
    : false;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Best Price Badge */}
      {isBestPrice && (
        <Chip
          label={t('product.bestPrice', 'Best Price')}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            bgcolor: 'success.main',
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      )}

      {/* Affiliate Badge */}
      {showAffiliate && product.affiliate_url && (
        <Tooltip title={t('product.affiliateLink', 'Affiliate Link Available')}>
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <LinkIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      )}

      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={imageError ? '/placeholder-product.png' : product.image_url}
        alt={product.product_name}
        onError={handleImageError}
        sx={{
          objectFit: 'contain',
          bgcolor: 'grey.100',
          p: 2,
        }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Brand */}
        {product.brand && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {product.brand}
          </Typography>
        )}

        {/* Product Name */}
        <Tooltip title={product.product_name}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontSize: '1rem',
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: 48,
            }}
          >
            {product.product_name}
          </Typography>
        </Tooltip>

        {/* Platform Badge */}
        <Box sx={{ mb: 2 }}>
          <PlatformBadge platform={product.platform} size="small" />
        </Box>

        {/* Price Display */}
        <PriceDisplay
          currentPrice={product.current_price}
          originalPrice={product.original_price}
          showSavings={true}
          size="medium"
          showCrossPlatform={true}
          crossPlatformPrices={product.cross_platform_prices}
        />

        {/* Rating */}
        {product.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Rating
              value={product.rating}
              precision={0.1}
              size="small"
              readOnly
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" />}
            />
            <Typography variant="caption" color="text.secondary">
              ({product.reviews_count || 0})
            </Typography>
          </Box>
        )}

        {/* Availability */}
        <Box sx={{ mt: 2 }}>
          <Chip
            label={availabilityConfig.label}
            color={availabilityConfig.color}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        {onTrack && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<NotificationsActive />}
            onClick={() => onTrack(product.id)}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            {t('product.track', 'Track')}
          </Button>
        )}
        {onCompare && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<CompareArrows />}
            onClick={() => onCompare(product.id)}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            {t('product.compare', 'Compare')}
          </Button>
        )}
      </CardActions>

      {/* Cross-Platform Tooltip */}
      {product.cross_platform_prices && product.cross_platform_prices.length > 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Tooltip
            title={
              <Box>
                <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 1 }}>
                  {t('product.crossPlatformPrices', 'Cross-Platform Prices')}
                </Typography>
                {product.cross_platform_prices.map((price) => (
                  <Box key={price.platform} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">{price.platform}:</Typography>
                    <Typography variant="caption" fontWeight="bold">
                      ₹{price.price.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            }
            arrow
          >
            <Typography
              variant="caption"
              color="primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <CompareArrows fontSize="inherit" />
              {t('product.viewCrossPlatform', 'View prices across platforms')}
            </Typography>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;

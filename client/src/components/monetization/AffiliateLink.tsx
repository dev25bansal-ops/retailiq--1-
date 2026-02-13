import React, { useState } from 'react';
import { Box, Link, Chip, Fade } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import type { Product } from '../../types';

interface AffiliateLinkProps {
  product: Product;
  children: React.ReactNode;
  className?: string;
}

export const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  product,
  children,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Build affiliate URL with UTM parameters
  const buildAffiliateUrl = () => {
    if (!product.affiliate_url) {
      return product.url;
    }

    try {
      const url = new URL(product.affiliate_url);
      
      // Add UTM parameters for tracking
      url.searchParams.set('utm_source', 'retailiq');
      url.searchParams.set('utm_medium', 'affiliate');
      url.searchParams.set('utm_campaign', 'product_click');
      url.searchParams.set('utm_content', product.id || '');
      
      return url.toString();
    } catch (error) {
      console.error('Invalid affiliate URL:', error);
      return product.affiliate_url;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Track click for analytics
    if (window.gtag) {
      window.gtag('event', 'affiliate_click', {
        product_id: product.id,
        product_name: product.name,
        product_platform: product.platform,
        event_category: 'engagement',
      });
    }

    // Custom analytics can be added here
    console.log('Affiliate link clicked:', {
      productId: product.id,
      productName: product.name,
      platform: product.platform,
      timestamp: new Date().toISOString(),
    });
  };

  const affiliateUrl = buildAffiliateUrl();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      <Link
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          position: 'relative',
          '&:hover': {
            textDecoration: 'none',
          },
        }}
      >
        {children}
        
        {/* Hover Badge */}
        <Fade in={isHovered}>
          <Chip
            label="via RetailIQ"
            size="small"
            icon={<OpenInNew sx={{ fontSize: 14 }} />}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: '0.7rem',
              height: 24,
              bgcolor: 'rgba(26, 35, 126, 0.9)',
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              boxShadow: 2,
              zIndex: 10,
              '& .MuiChip-icon': {
                color: 'white',
                fontSize: 14,
              },
            }}
          />
        </Fade>
      </Link>
    </Box>
  );
};

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

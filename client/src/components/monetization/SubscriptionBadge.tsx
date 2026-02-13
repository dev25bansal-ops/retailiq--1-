import React from 'react';
import { Chip, Link, Box } from '@mui/material';
import { Star, WorkspacePremium, Diamond, Business } from '@mui/icons-material';
import type { SubscriptionTier } from '../../types';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  size?: 'small' | 'medium';
  showUpgradeLink?: boolean;
  onUpgradeClick?: () => void;
}

const tierConfig = {
  free: {
    label: 'Free',
    color: '#9e9e9e',
    bgColor: 'rgba(158, 158, 158, 0.1)',
    icon: Star,
  },
  basic: {
    label: 'Basic',
    color: '#2196f3',
    bgColor: 'rgba(33, 150, 243, 0.1)',
    icon: WorkspacePremium,
  },
  pro: {
    label: 'Pro',
    color: '#9c27b0',
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: Diamond,
  },
  enterprise: {
    label: 'Enterprise',
    color: '#ffa000',
    bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    icon: Business,
  },
};

export const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  tier,
  size = 'medium',
  showUpgradeLink = false,
  onUpgradeClick,
}) => {
  const config = tierConfig[tier];
  const Icon = config.icon;

  const shouldShowUpgrade = showUpgradeLink && (tier === 'free' || tier === 'basic');

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={<Icon sx={{ fontSize: size === 'small' ? 16 : 20 }} />}
        label={config.label}
        size={size}
        sx={{
          fontWeight: 600,
          color: tier === 'pro' || tier === 'enterprise' ? '#fff' : config.color,
          background:
            tier === 'pro' || tier === 'enterprise'
              ? config.bgColor
              : config.bgColor,
          border:
            tier === 'pro' || tier === 'enterprise'
              ? 'none'
              : `1px solid ${config.color}`,
          '& .MuiChip-icon': {
            color: tier === 'pro' || tier === 'enterprise' ? '#fff' : config.color,
          },
        }}
      />
      {shouldShowUpgrade && (
        <Link
          component="button"
          variant="caption"
          onClick={onUpgradeClick}
          sx={{
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Upgrade
        </Link>
      )}
    </Box>
  );
};

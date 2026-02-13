import React from 'react';
import { Chip } from '@mui/material';
import type { Platform } from '../../types/index';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'small' | 'medium';
}

const PLATFORM_COLORS: Record<Platform, string> = {
  amazon: '#FF9900',
  flipkart: '#2874F0',
  myntra: '#FF3F6C',
  ajio: '#3A3A3A',
  tata_cliq: '#6C3D7C',
  jiomart: '#0078AD',
  meesho: '#570D53',
  snapdeal: '#E40046',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  myntra: 'Myntra',
  ajio: 'Ajio',
  tata_cliq: 'Tata CLiQ',
  jiomart: 'JioMart',
  meesho: 'Meesho',
  snapdeal: 'Snapdeal',
};

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, size = 'small' }) => {
  const backgroundColor = PLATFORM_COLORS[platform] || '#757575';
  const label = PLATFORM_LABELS[platform] || platform;

  // Determine if we need light or dark text based on background color
  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(backgroundColor);

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: backgroundColor,
        color: textColor,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        '& .MuiChip-label': {
          px: size === 'small' ? 1 : 1.5,
        },
      }}
    />
  );
};

export default PlatformBadge;

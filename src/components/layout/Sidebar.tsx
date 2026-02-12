import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrackChanges as TrackChangesIcon,
  ShowChart as ShowChartIcon,
  SmartToy as SmartToyIcon,
  Notifications as NotificationsIcon,
  LocalOffer as LocalOfferIcon,
  AttachMoney as AttachMoneyIcon,
  QueryStats as QueryStatsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ViewMode } from '../../types';

const DRAWER_WIDTH = 260;

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  section?: string;
}

const consumerNavItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/consumer/dashboard', icon: <DashboardIcon />, section: 'Overview' },
  { label: 'Track Product', path: '/consumer/track', icon: <TrackChangesIcon />, section: 'Overview' },
  { label: 'Price History', path: '/consumer/history', icon: <ShowChartIcon />, section: 'Analysis' },
  { label: 'AI Agent', path: '/consumer/chat', icon: <SmartToyIcon />, section: 'Analysis' },
  { label: 'Alerts', path: '/consumer/alerts', icon: <NotificationsIcon />, section: 'Manage' },
  { label: 'Festival Deals', path: '/consumer/festivals', icon: <LocalOfferIcon />, section: 'Manage' },
];

const msmeNavItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/msme/dashboard', icon: <DashboardIcon />, section: 'Business' },
  { label: 'Pricing Strategy', path: '/msme/pricing', icon: <AttachMoneyIcon />, section: 'Business' },
  { label: 'Competitive Intel', path: '/msme/competitive', icon: <QueryStatsIcon />, section: 'Intelligence' },
  { label: 'Reports', path: '/msme/reports', icon: <AssessmentIcon />, section: 'Intelligence' },
  { label: 'Settings', path: '/msme/settings', icon: <SettingsIcon />, section: 'System' },
];

interface SidebarProps {
  viewMode: ViewMode;
  open?: boolean;
  onClose?: () => void;
  variant?: 'permanent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  open = true,
  onClose,
  variant = 'permanent',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = viewMode === 'consumer' ? consumerNavItems : msmeNavItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === 'temporary' && onClose) onClose();
  };

  // Group items by section
  const sections: { [key: string]: NavigationItem[] } = {};
  navItems.forEach((item) => {
    const section = item.section || 'General';
    if (!sections[section]) sections[section] = [];
    sections[section].push(item);
  });

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Box sx={{ flex: 1, px: 1.5, pt: 1 }}>
        {Object.entries(sections).map(([sectionName, items], sectionIndex) => (
          <Box key={sectionName} sx={{ mb: 1 }}>
            {sectionIndex > 0 && <Divider sx={{ my: 1, mx: 1 }} />}
            <Typography
              variant="overline"
              sx={{
                px: 1.5,
                py: 0.75,
                display: 'block',
                color: 'text.secondary',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              {sectionName}
            </Typography>
            <List disablePadding>
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        borderRadius: '10px',
                        mx: 0.5,
                        py: 1,
                        px: 1.5,
                        minHeight: 44,
                        transition: 'all 0.15s ease',
                        '&.Mui-selected': {
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isActive ? 'primary.main' : 'text.secondary',
                          transition: 'color 0.15s ease',
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        sx={{
                          '& .MuiTypography-root': {
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '0.8125rem',
                            color: isActive ? 'primary.main' : 'text.primary',
                            transition: 'all 0.15s ease',
                          },
                        }}
                      />
                      {isActive && (
                        <Box
                          sx={{
                            width: 4,
                            height: 20,
                            borderRadius: 2,
                            background: 'linear-gradient(180deg, #1a237e, #534bae)',
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer branding */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            p: 1.5,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(26,35,126,0.04), rgba(83,75,174,0.06))',
            border: '1px solid rgba(26,35,126,0.06)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
            RetailIQ {viewMode === 'msme' ? 'Pro' : ''}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.625rem' }}>
            AI-powered retail intelligence
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: '#fefefe',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };

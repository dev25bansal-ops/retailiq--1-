import React, { useState } from 'react';
import {
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrackChanges as TrackChangesIcon,
  ShowChart as ShowChartIcon,
  SmartToy as SmartToyIcon,
  Notifications as NotificationsIcon,
  AttachMoney as AttachMoneyIcon,
  QueryStats as QueryStatsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { ViewMode } from '../../types';
import TopBar from './TopBar';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';

interface AppLayoutProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  notificationCount?: number;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  viewMode,
  onViewModeChange,
  notificationCount = 0,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const consumerBottomNavItems = [
    { label: 'Home', path: '/consumer/dashboard', icon: <DashboardIcon /> },
    { label: 'Track', path: '/consumer/track', icon: <TrackChangesIcon /> },
    { label: 'History', path: '/consumer/history', icon: <ShowChartIcon /> },
    { label: 'AI Agent', path: '/consumer/chat', icon: <SmartToyIcon /> },
    { label: 'Alerts', path: '/consumer/alerts', icon: <NotificationsIcon /> },
  ];

  const msmeBottomNavItems = [
    { label: 'Home', path: '/msme/dashboard', icon: <DashboardIcon /> },
    { label: 'Pricing', path: '/msme/pricing', icon: <AttachMoneyIcon /> },
    { label: 'Intel', path: '/msme/competitive', icon: <QueryStatsIcon /> },
    { label: 'Reports', path: '/msme/reports', icon: <AssessmentIcon /> },
    { label: 'Settings', path: '/msme/settings', icon: <SettingsIcon /> },
  ];

  const bottomNavItems = viewMode === 'consumer' ? consumerBottomNavItems : msmeBottomNavItems;

  const handleBottomNavChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        notificationCount={notificationCount}
        onMenuClick={handleDrawerToggle}
      />

      <Box sx={{ display: 'flex', flex: 1 }}>
        {!isMobile && <Sidebar viewMode={viewMode} variant="permanent" open={true} />}
        {isMobile && (
          <Sidebar
            viewMode={viewMode}
            variant="temporary"
            open={mobileDrawerOpen}
            onClose={handleDrawerToggle}
          />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: '100vh',
            backgroundColor: 'background.default',
            pb: isMobile ? 8 : 0,
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
          <Box
            className="page-enter"
            sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}
          elevation={0}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={handleBottomNavChange}
            showLabels
            sx={{
              height: 64,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                py: 1,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.625rem',
                fontWeight: 600,
                mt: 0.25,
                '&.Mui-selected': { fontSize: '0.625rem' },
              },
            }}
          >
            {bottomNavItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                value={item.path}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default AppLayout;

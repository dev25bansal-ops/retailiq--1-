import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Box,
  alpha,
  styled,
  Tooltip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  CardMembership as CardMembershipIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { ViewMode } from '../../types';
import { useAuthStore, useNotificationStore, useAppStore } from '../../stores';
import { NotificationCenter } from '../notifications';
import { SubscriptionBadge } from '../monetization';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
    borderColor: alpha(theme.palette.common.white, 0.2),
  },
  '&:focus-within': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    borderColor: alpha(theme.palette.common.white, 0.3),
    boxShadow: `0 0 0 3px ${alpha(theme.palette.common.white, 0.06)}`,
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.6,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3.5)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '28ch',
      '&:focus': {
        width: '36ch',
      },
    },
  },
}));

interface TopBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  notificationCount?: number;
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onViewModeChange,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { language, setLanguage } = useAppStore();

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const handleToggle = () => {
    onViewModeChange(viewMode === 'consumer' ? 'msme' : 'consumer');
  };

  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setProfileAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #0d1642 0%, #1a237e 50%, #283593 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 3 } }}>
          {/* Mobile menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1, display: { md: 'none' }, opacity: 0.8 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mr: { xs: 1, sm: 3 }, cursor: 'pointer' }}
            onClick={() => navigate(viewMode === 'consumer' ? '/consumer/dashboard' : '/msme/dashboard')}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff6f00, #ffa040)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.875rem',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(255,111,0,0.3)',
              }}
            >
              R
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 800,
                fontSize: '1.125rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              RetailIQ
            </Typography>
          </Stack>

          {/* Mode Toggle */}
          <Box
            onClick={handleToggle}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
              mr: { xs: 1, sm: 2 },
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: 'rgba(255,255,255,0.3)' },
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                color: viewMode === 'consumer' ? '#fff' : 'rgba(255,255,255,0.5)',
                background: viewMode === 'consumer' ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              Consumer
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                color: viewMode === 'msme' ? '#fff' : 'rgba(255,255,255,0.5)',
                background: viewMode === 'msme' ? 'linear-gradient(135deg, #ff6f00, #c43e00)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              MSME Pro
            </Box>
          </Box>

          {/* Search */}
          <Search sx={{ flexGrow: 1, maxWidth: 480, display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon sx={{ fontSize: 18 }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products, brands, categories..."
              inputProps={{ 'aria-label': 'search products' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right actions */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {/* Mobile search */}
            <Tooltip title="Search" arrow>
              <IconButton color="inherit" sx={{ display: { sm: 'none' }, opacity: 0.8 }}>
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {/* Language selector */}
            <Tooltip title="Language" arrow>
              <IconButton
                color="inherit"
                onClick={handleLangClick}
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 }, display: { xs: 'none', sm: 'flex' } }}
              >
                <LanguageIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications" arrow>
              <IconButton
                color="inherit"
                onClick={handleNotifClick}
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      border: '2px solid #1a237e',
                    },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User avatar / profile */}
            <Tooltip title={isAuthenticated ? (user?.name || 'Profile') : 'Sign in'} arrow>
              <IconButton size="small" sx={{ ml: 0.5 }} onClick={handleProfileClick}>
                <Avatar
                  src={user?.avatar}
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'secondary.main',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  {isAuthenticated ? (user?.name?.[0] || 'U') : 'G'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Notification Center Popover */}
      <NotificationCenter
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
      />

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={() => setLangAnchorEl(null)}
        PaperProps={{
          sx: { minWidth: 160, borderRadius: 2, mt: 1 },
        }}
      >
        <MenuItem
          selected={language === 'en'}
          onClick={() => { setLanguage('en'); setLangAnchorEl(null); }}
        >
          <ListItemText primary="English" secondary="EN" />
        </MenuItem>
        <MenuItem
          selected={language === 'hi'}
          onClick={() => { setLanguage('hi'); setLangAnchorEl(null); }}
        >
          <ListItemText primary="हिन्दी" secondary="HI" />
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={() => setProfileAnchorEl(null)}
        PaperProps={{
          sx: { minWidth: 220, borderRadius: 2, mt: 1 },
        }}
      >
        {isAuthenticated ? [
          <Box key="user-info" sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || ''}
            </Typography>
            {user?.subscription && (
              <Box sx={{ mt: 0.5 }}>
                <SubscriptionBadge tier={user.subscription} size="small" />
              </Box>
            )}
          </Box>,
          <Divider key="div1" />,
          <MenuItem key="profile" onClick={() => { setProfileAnchorEl(null); navigate('/profile'); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>,
          <MenuItem key="subscription" onClick={() => { setProfileAnchorEl(null); navigate('/pricing'); }}>
            <ListItemIcon><CardMembershipIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Subscription</ListItemText>
          </MenuItem>,
          <MenuItem key="settings" onClick={() => { setProfileAnchorEl(null); navigate('/notification-preferences'); }}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>,
          <Divider key="div2" />,
          <MenuItem key="logout" onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>,
        ] : [
          <MenuItem key="login" onClick={() => { setProfileAnchorEl(null); navigate('/login'); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Sign In</ListItemText>
          </MenuItem>,
          <MenuItem key="register" onClick={() => { setProfileAnchorEl(null); navigate('/register'); }}>
            <ListItemIcon><CardMembershipIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Create Account</ListItemText>
          </MenuItem>,
        ]}
      </Menu>
    </>
  );
};

export default TopBar;

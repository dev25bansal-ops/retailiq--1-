import React from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import type { ViewMode } from '../../types';

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
  notificationCount = 0,
  onMenuClick,
}) => {
  const handleToggle = () => {
    onViewModeChange(viewMode === 'consumer' ? 'msme' : 'consumer');
  };

  return (
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
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: { xs: 1, sm: 3 } }}>
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
          <Tooltip title="Search" arrow>
            <IconButton color="inherit" sx={{ display: { sm: 'none' }, opacity: 0.8 }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications" arrow>
            <IconButton color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
              <Badge
                badgeContent={notificationCount}
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

          <Tooltip title="Profile" arrow>
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <Avatar
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
                U
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

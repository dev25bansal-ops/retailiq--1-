import React, { useState, useMemo } from 'react';
import {
  Popover,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Button,
  Divider,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingDown as TrendingDownIcon,
  LocalOffer as LocalOfferIcon,
  Campaign as CampaignIcon,
  Celebration as CelebrationIcon,
  NotificationsNone as NotificationsNoneIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../stores/notificationStore';
import type { Notification } from '../../types';

interface NotificationCenterProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

type NotificationTab = 'all' | 'price_drop' | 'deal' | 'system';

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  open,
  anchorEl,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState<NotificationTab>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const filteredNotifications = useMemo(() => {
    if (currentTab === 'all') return notifications;
    return notifications.filter((n) => n.type === currentTab);
  }, [notifications, currentTab]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDownIcon sx={{ color: '#4caf50' }} />;
      case 'deal':
        return <LocalOfferIcon sx={{ color: '#ff6f00' }} />;
      case 'system':
        return <CampaignIcon sx={{ color: '#2196f3' }} />;
      case 'festival':
        return <CelebrationIcon sx={{ color: '#9c27b0' }} />;
      default:
        return <NotificationsNoneIcon />;
    }
  };

  const getRelativeTime = (timestamp: string | Date) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('notifications.time.justNow');
    if (diffMins < 60) return t('notifications.time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('notifications.time.hoursAgo', { count: diffHours });
    if (diffDays === 1) return t('notifications.time.yesterday');
    if (diffDays < 7) return t('notifications.time.daysAgo', { count: diffDays });
    return time.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleViewAll = () => {
    navigate('/notifications');
    onClose();
  };

  const handleSettings = () => {
    navigate('/settings/notifications');
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            width: 420,
            maxWidth: '100vw',
            mt: 1,
            boxShadow: (theme) => theme.shadows[8],
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('notifications.title')}
          </Typography>
          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="primary"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  position: 'relative',
                  transform: 'none',
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {unreadCount > 0 && (
            <IconButton size="small" onClick={handleMarkAllRead} title={t('notifications.markAllRead')}>
              <DoneAllIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={currentTab}
        onChange={(_, value) => setCurrentTab(value)}
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            textTransform: 'none',
            fontSize: '0.875rem',
          },
        }}
      >
        <Tab label={t('notifications.tabs.all')} value="all" />
        <Tab label={t('notifications.tabs.priceDrops')} value="price_drop" />
        <Tab label={t('notifications.tabs.deals')} value="deal" />
        <Tab label={t('notifications.tabs.system')} value="system" />
      </Tabs>

      {/* Notification List */}
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              px: 3,
              textAlign: 'center',
            }}
          >
            <NotificationsNoneIcon
              sx={{
                fontSize: 64,
                color: 'text.disabled',
                mb: 2,
              }}
            />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              {t('notifications.empty.title')}
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
              {t('notifications.empty.subtitle')}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  disablePadding
                  onMouseEnter={() => setHoveredId(notification.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{ position: 'relative' }}
                >
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      backgroundColor: !notification.read
                        ? (theme) => alpha(theme.palette.primary.main, 0.04)
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          !notification.read
                            ? alpha(theme.palette.primary.main, 0.08)
                            : alpha(theme.palette.action.hover, 0.04),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight={!notification.read ? 600 : 400}
                            sx={{
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              mt: 0.5,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ mt: 0.5, display: 'block' }}
                          >
                            {getRelativeTime(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    {hoveredId === notification.id && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(e, notification.id)}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: 'error.light',
                            color: 'error.contrastText',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
            }}
          >
            <Button
              size="small"
              onClick={handleViewAll}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              {t('notifications.viewAll')}
            </Button>
            <IconButton
              size="small"
              onClick={handleSettings}
              title={t('notifications.settings')}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      )}
    </Popover>
  );
};

export default NotificationCenter;

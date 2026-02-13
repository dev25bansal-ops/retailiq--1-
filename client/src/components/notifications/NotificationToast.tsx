import React, { useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Button,
  Box,
  Slide,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingDown as TrendingDownIcon,
  LocalOffer as LocalOfferIcon,
  Campaign as CampaignIcon,
  Celebration as CelebrationIcon,
  NotificationsNone as NotificationsNoneIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  autoHideDuration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  autoHideDuration = 5000,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration, onDismiss]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDownIcon />;
      case 'deal':
        return <LocalOfferIcon />;
      case 'system':
        return <CampaignIcon />;
      case 'festival':
        return <CelebrationIcon />;
      default:
        return <NotificationsNoneIcon />;
    }
  };

  const getNotificationSeverity = (type: string): 'success' | 'info' | 'warning' | 'error' => {
    switch (type) {
      case 'price_drop':
        return 'success';
      case 'deal':
        return 'warning';
      case 'festival':
        return 'info';
      case 'system':
        return 'info';
      default:
        return 'info';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'price_drop':
        return t('notificationToast.actions.viewPrice');
      case 'deal':
        return t('notificationToast.actions.viewDeal');
      case 'festival':
        return t('notificationToast.actions.viewSale');
      case 'system':
        return t('notificationToast.actions.viewDetails');
      default:
        return t('notificationToast.actions.view');
    }
  };

  const handleAction = () => {
    if (notification.link) {
      navigate(notification.link);
    }
    onDismiss();
  };

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' } as any}
      sx={{
        mt: 8,
        '& .MuiSnackbar-root': {
          top: 24,
        },
      }}
    >
      <Alert
        severity={getNotificationSeverity(notification.type)}
        icon={getNotificationIcon(notification.type)}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {notification.link && (
              <Button
                size="small"
                onClick={handleAction}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                {getActionLabel(notification.type)}
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onDismiss}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{
          width: 400,
          maxWidth: 'calc(100vw - 32px)',
          alignItems: 'flex-start',
          boxShadow: (theme) => theme.shadows[8],
          '& .MuiAlert-icon': {
            fontSize: 28,
            mr: 1.5,
          },
          '& .MuiAlert-message': {
            flex: 1,
            pt: 0.25,
          },
          '& .MuiAlert-action': {
            pt: 0,
            pl: 0,
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
          {notification.title}
        </AlertTitle>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;

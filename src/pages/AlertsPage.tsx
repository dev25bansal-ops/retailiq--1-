import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Stack,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Divider,
  Badge,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Celebration,
  CheckCircle,
  NotificationsActive,
  Settings,
} from '@mui/icons-material';
import { formatINR, formatPercentage, formatRelativeTime, getPlatformName } from '../utils/formatters';
import { sampleAlerts } from '../data/sampleData';
import type { Alert } from '../types';

const AlertsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'price_drop' | 'price_increase' | 'festival'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [alertsList, setAlertsList] = useState(sampleAlerts);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    priceDropAlerts: true,
    priceIncreaseAlerts: false,
    festivalAlerts: true,
    backInStockAlerts: true,
  });

  // Filter alerts based on selected tab and unread filter
  const filteredAlerts = useMemo(() => {
    let filtered = [...alertsList];

    // Filter by type
    if (selectedTab !== 'all') {
      filtered = filtered.filter((alert) => alert.alert_type === selectedTab);
    }

    // Filter by read status
    if (showUnreadOnly) {
      filtered = filtered.filter((alert) => !alert.read);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered;
  }, [alertsList, selectedTab, showUnreadOnly]);

  // Count alerts by type
  const alertCounts = useMemo(() => {
    return {
      all: alertsList.length,
      price_drop: alertsList.filter((a) => a.alert_type === 'price_drop').length,
      price_increase: alertsList.filter((a) => a.alert_type === 'price_increase').length,
      festival: alertsList.filter((a) => a.alert_type === 'festival').length,
      unread: alertsList.filter((a) => !a.read).length,
    };
  }, [alertsList]);

  const handleMarkAsRead = (alertId: string) => {
    setAlertsList((prev) =>
      prev.map((alert) => (alert.alert_id === alertId ? { ...alert, read: true } : alert))
    );
  };

  const handleMarkAllAsRead = () => {
    setAlertsList((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const getAlertIcon = (alert: Alert) => {
    switch (alert.alert_type) {
      case 'price_drop':
        return <TrendingDown sx={{ color: 'success.main' }} />;
      case 'price_increase':
        return <TrendingUp sx={{ color: 'error.main' }} />;
      case 'festival':
        return <Celebration sx={{ color: 'warning.main' }} />;
      default:
        return <NotificationsActive />;
    }
  };

  const getAlertLabel = (alert: Alert): string => {
    switch (alert.alert_type) {
      case 'price_drop':
        return 'Price Drop';
      case 'price_increase':
        return 'Price Increase';
      case 'festival':
        return 'Festival Deal';
      case 'back_in_stock':
        return 'Back in Stock';
      default:
        return 'Alert';
    }
  };

  const getAlertColor = (alert: Alert): 'success' | 'error' | 'warning' | 'info' => {
    switch (alert.alert_type) {
      case 'price_drop':
        return 'success';
      case 'price_increase':
        return 'error';
      case 'festival':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Price Alerts & Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay updated on price changes for your tracked products
          </Typography>
        </Box>
        <Badge badgeContent={alertCounts.unread} color="error">
          <NotificationsActive sx={{ fontSize: 40, color: 'primary.main' }} />
        </Badge>
      </Stack>

      {/* Filter Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={(_e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All (${alertCounts.all})`} value="all" />
            <Tab
              label={`Price Drops (${alertCounts.price_drop})`}
              value="price_drop"
              icon={<TrendingDown fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label={`Price Increases (${alertCounts.price_increase})`}
              value="price_increase"
              icon={<TrendingUp fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label={`Festival Deals (${alertCounts.festival})`}
              value="festival"
              icon={<Celebration fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Card>

      {/* Controls */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
            />
          }
          label={`Show unread only (${alertCounts.unread})`}
        />
        {alertCounts.unread > 0 && (
          <Button variant="outlined" size="small" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Stack>

      {/* Alerts List */}
      <Stack spacing={2} mb={3}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.alert_id}
              sx={{
                opacity: alert.read ? 0.7 : 1,
                borderLeft: 4,
                borderColor:
                  alert.alert_type === 'price_drop'
                    ? 'success.main'
                    : alert.alert_type === 'festival'
                    ? 'warning.main'
                    : 'error.main',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Icon */}
                  <Box sx={{ pt: 0.5 }}>{getAlertIcon(alert)}</Box>

                  {/* Content */}
                  <Box flex={1}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1} flexWrap="wrap">
                      <Chip label={getAlertLabel(alert)} size="small" color={getAlertColor(alert)} />
                      {!alert.read && (
                        <Chip label="NEW" size="small" color="error" variant="outlined" />
                      )}
                      <Chip
                        label={getPlatformName(alert.platform)}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Typography variant="h6" gutterBottom>
                      {alert.product_name}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center" mb={1} flexWrap="wrap">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatINR(alert.old_price)}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        →
                      </Typography>
                      <Typography
                        variant="h6"
                        color={alert.alert_type === 'price_drop' ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {formatINR(alert.new_price)}
                      </Typography>
                      <Chip
                        label={formatPercentage(alert.percentage_change)}
                        size="small"
                        color={alert.alert_type === 'price_drop' ? 'success' : 'error'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(alert.timestamp)}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Stack spacing={1}>
                    {!alert.read && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleMarkAsRead(alert.alert_id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button variant="contained" size="small">
                      View Product
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsActive sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No alerts found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {showUnreadOnly
                ? 'You have no unread alerts at the moment'
                : selectedTab !== 'all'
                ? `No ${selectedTab.replace('_', ' ')} alerts yet`
                : 'Start tracking products to receive price alerts'}
            </Typography>
          </Paper>
        )}
      </Stack>

      {/* Alert Settings */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Settings color="primary" />
            <Typography variant="h6">Notification Settings</Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Notification Channels
          </Typography>
          <FormGroup sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="Email notifications"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={notificationSettings.pushNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="Push notifications (browser/mobile)"
            />
          </FormGroup>

          <Typography variant="subtitle2" gutterBottom>
            Alert Types
          </Typography>
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={notificationSettings.priceDropAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      priceDropAlerts: e.target.checked,
                    })
                  }
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingDown fontSize="small" color="success" />
                  <Typography variant="body2">Price drop alerts</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={notificationSettings.priceIncreaseAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      priceIncreaseAlerts: e.target.checked,
                    })
                  }
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingUp fontSize="small" color="error" />
                  <Typography variant="body2">Price increase alerts</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={notificationSettings.festivalAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      festivalAlerts: e.target.checked,
                    })
                  }
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Celebration fontSize="small" color="warning" />
                  <Typography variant="body2">Festival deal alerts</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={notificationSettings.backInStockAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      backInStockAlerts: e.target.checked,
                    })
                  }
                />
              }
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle fontSize="small" color="info" />
                  <Typography variant="body2">Back in stock alerts</Typography>
                </Stack>
              }
            />
          </FormGroup>

          <Button variant="contained" fullWidth>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AlertsPage;

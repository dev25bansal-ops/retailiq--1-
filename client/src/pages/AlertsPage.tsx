import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Button,
  Alert as MuiAlert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Delete,
  DoneAll,
  TrendingDown,
  Inventory,
  Event,
  NotificationsActive,
  FilterList,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ListSkeleton, EmptyState } from '../components/common';
import { alertsApi } from '../api';
import type { Alert } from '../types';

const AlertsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Price Drop', value: 'price_drop' },
    { label: 'Back in Stock', value: 'back_in_stock' },
    { label: 'Festival', value: 'festival' },
    { label: 'Predictions', value: 'prediction' },
  ];

  useEffect(() => {
    loadAlerts();
  }, [tabValue]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const type = tabs[tabValue].value;
      const response = await alertsApi.getAlerts({
        type: type === 'all' ? undefined : (type as any),
        limit: 100,
      });

      setAlerts(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await alertsApi.markAsRead(id);
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertsApi.markAllAsRead();
      setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await alertsApi.deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDown />;
      case 'back_in_stock':
        return <Inventory />;
      case 'festival':
        return <Event />;
      case 'prediction':
        return <NotificationsActive />;
      default:
        return <NotificationsActive />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'price_drop':
        return 'success';
      case 'back_in_stock':
        return 'info';
      case 'festival':
        return 'secondary';
      case 'prediction':
        return 'warning';
      default:
        return 'default';
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('alerts.title')}
        </Typography>
        {unreadCount > 0 && (
          <Button startIcon={<DoneAll />} onClick={handleMarkAllAsRead}>
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </Box>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </MuiAlert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          {tabs.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Alerts List */}
      {loading ? (
        <ListSkeleton count={5} />
      ) : alerts.length === 0 ? (
        <EmptyState
          title="No alerts"
          description="You'll see notifications about price drops, stock updates, and more here."
        />
      ) : (
        <List>
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              sx={{
                mb: 2,
                bgcolor: alert.read ? 'transparent' : 'action.hover',
                cursor: 'pointer',
              }}
              onClick={() => !alert.read && handleMarkAsRead(alert.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: `${getAlertColor(alert.type)}.main` }}>
                    {getAlertIcon(alert.type)}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" fontWeight={alert.read ? 'normal' : 'bold'}>
                        {alert.title}
                      </Typography>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(alert.id); }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {alert.message}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                      <Chip label={alert.platform} size="small" />
                      <Chip label={alert.type.replace('_', ' ')} size="small" color={getAlertColor(alert.type)} />
                      {alert.change_percentage && (
                        <Chip
                          label={`${alert.change_percentage > 0 ? '+' : ''}${alert.change_percentage}%`}
                          size="small"
                          color={alert.change_percentage < 0 ? 'success' : 'error'}
                        />
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </Typography>
                    </Stack>

                    {alert.actionUrl && (
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (alert.product_id) {
                            navigate(`/consumer/history?product=${alert.product_id}`);
                          }
                        }}
                      >
                        View Product
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Container>
  );
};

export default AlertsPage;

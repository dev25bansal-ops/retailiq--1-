import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  Radio,
  RadioGroup,
  Button,
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Stack,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../../stores/notificationStore';
import type { NotificationPreferences as NotificationPreferencesType } from '../../types';

const NotificationPreferences: React.FC = () => {
  const { t } = useTranslation();
  const { preferences, updatePreferences } = useNotificationStore();

  const [localPrefs, setLocalPrefs] = useState<NotificationPreferencesType>(preferences);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Check browser notification permission
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleChannelToggle = (channel: keyof NotificationPreferencesType['channels']) => {
    setLocalPrefs({
      ...localPrefs,
      channels: {
        ...localPrefs.channels,
        [channel]: !localPrefs.channels[channel],
      },
    });
  };

  const handleAlertToggle = (alert: keyof NotificationPreferencesType['alerts']) => {
    setLocalPrefs({
      ...localPrefs,
      alerts: {
        ...localPrefs.alerts,
        [alert]: !localPrefs.alerts[alert],
      },
    });
  };

  const handlePriceDropThresholdChange = (_: Event, value: number | number[]) => {
    setLocalPrefs({
      ...localPrefs,
      priceDropThreshold: value as number,
    });
  };

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPrefs({
      ...localPrefs,
      frequency: event.target.value as 'instant' | 'daily' | 'weekly',
    });
  };

  const handleQuietHoursToggle = () => {
    setLocalPrefs({
      ...localPrefs,
      quietHours: {
        ...localPrefs.quietHours,
        enabled: !localPrefs.quietHours.enabled,
      },
    });
  };

  const handleQuietHoursChange = (type: 'start' | 'end', value: string) => {
    setLocalPrefs({
      ...localPrefs,
      quietHours: {
        ...localPrefs.quietHours,
        [type]: value,
      },
    });
  };

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        setLocalPrefs({
          ...localPrefs,
          channels: {
            ...localPrefs.channels,
            push: true,
          },
        });
      }
    }
  };

  const handleDeleteProductAlert = (alertId: string) => {
    setLocalPrefs({
      ...localPrefs,
      productAlerts: localPrefs.productAlerts.filter((a) => a.id !== alertId),
    });
  };

  const handleSave = () => {
    updatePreferences(localPrefs);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const priceDropMarks = [
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 15, label: '15%' },
    { value: 20, label: '20%' },
    { value: 25, label: '25%' },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {t('notificationSettings.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('notificationSettings.subtitle')}
      </Typography>

      {saveSuccess && (
        <Alert
          icon={<CheckIcon />}
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSaveSuccess(false)}
        >
          {t('notificationSettings.saveSuccess')}
        </Alert>
      )}

      {/* Notification Channels */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('notificationSettings.channels.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('notificationSettings.channels.subtitle')}
        </Typography>

        <Stack spacing={2.5}>
          {/* Email */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {t('notificationSettings.channels.email')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localPrefs.email || 'user@example.com'}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={localPrefs.channels.email}
                onChange={() => handleChannelToggle('email')}
              />
            </Box>
          </Box>

          <Divider />

          {/* Push */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <NotificationsIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {t('notificationSettings.channels.push')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pushPermission === 'granted'
                      ? t('notificationSettings.channels.pushGranted')
                      : pushPermission === 'denied'
                      ? t('notificationSettings.channels.pushDenied')
                      : t('notificationSettings.channels.pushDefault')}
                  </Typography>
                </Box>
              </Box>
              {pushPermission === 'granted' ? (
                <Switch
                  checked={localPrefs.channels.push}
                  onChange={() => handleChannelToggle('push')}
                />
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleRequestPushPermission}
                  disabled={pushPermission === 'denied'}
                >
                  {t('notificationSettings.channels.enablePush')}
                </Button>
              )}
            </Box>
          </Box>

          <Divider />

          {/* SMS */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SmsIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {t('notificationSettings.channels.sms')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localPrefs.phone ? `+91 ${localPrefs.phone}` : t('notificationSettings.channels.noPhone')}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={localPrefs.channels.sms}
                onChange={() => handleChannelToggle('sms')}
                disabled={!localPrefs.phone}
              />
            </Box>
          </Box>

          <Divider />

          {/* WhatsApp */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <WhatsAppIcon color="action" />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {t('notificationSettings.channels.whatsapp')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localPrefs.phone ? `+91 ${localPrefs.phone}` : t('notificationSettings.channels.noPhone')}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={localPrefs.channels.whatsapp}
                onChange={() => handleChannelToggle('whatsapp')}
                disabled={!localPrefs.phone}
              />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Alert Types */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('notificationSettings.alerts.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('notificationSettings.alerts.subtitle')}
        </Typography>

        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.alerts.priceDrops}
                onChange={() => handleAlertToggle('priceDrops')}
              />
            }
            label={t('notificationSettings.alerts.priceDrops')}
          />

          {localPrefs.alerts.priceDrops && (
            <Box sx={{ pl: 4, pr: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('notificationSettings.alerts.priceDropThreshold')}
              </Typography>
              <Slider
                value={localPrefs.priceDropThreshold}
                onChange={handlePriceDropThresholdChange}
                min={5}
                max={25}
                step={5}
                marks={priceDropMarks}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ mt: 2 }}
              />
            </Box>
          )}

          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.alerts.priceIncreases}
                onChange={() => handleAlertToggle('priceIncreases')}
              />
            }
            label={t('notificationSettings.alerts.priceIncreases')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.alerts.backInStock}
                onChange={() => handleAlertToggle('backInStock')}
              />
            }
            label={t('notificationSettings.alerts.backInStock')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.alerts.festivals}
                onChange={() => handleAlertToggle('festivals')}
              />
            }
            label={t('notificationSettings.alerts.festivals')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.alerts.aiPredictions}
                onChange={() => handleAlertToggle('aiPredictions')}
              />
            }
            label={t('notificationSettings.alerts.aiPredictions')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.alerts.communityDeals}
                onChange={() => handleAlertToggle('communityDeals')}
              />
            }
            label={t('notificationSettings.alerts.communityDeals')}
          />
        </Stack>
      </Paper>

      {/* Frequency */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('notificationSettings.frequency.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('notificationSettings.frequency.subtitle')}
        </Typography>

        <RadioGroup value={localPrefs.frequency} onChange={handleFrequencyChange}>
          <FormControlLabel
            value="instant"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">
                  {t('notificationSettings.frequency.instant')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('notificationSettings.frequency.instantDesc')}
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="daily"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">
                  {t('notificationSettings.frequency.daily')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('notificationSettings.frequency.dailyDesc')}
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="weekly"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">
                  {t('notificationSettings.frequency.weekly')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('notificationSettings.frequency.weeklyDesc')}
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        <Divider sx={{ my: 3 }} />

        <FormControlLabel
          control={
            <Switch
              checked={localPrefs.quietHours.enabled}
              onChange={handleQuietHoursToggle}
            />
          }
          label={t('notificationSettings.frequency.quietHours')}
        />

        {localPrefs.quietHours.enabled && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2, pl: 4 }}>
            <TextField
              type="time"
              label={t('notificationSettings.frequency.startTime')}
              value={localPrefs.quietHours.start}
              onChange={(e) => handleQuietHoursChange('start', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              type="time"
              label={t('notificationSettings.frequency.endTime')}
              value={localPrefs.quietHours.end}
              onChange={(e) => handleQuietHoursChange('end', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>
        )}
      </Paper>

      {/* Manage Alerts */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {t('notificationSettings.productAlerts.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('notificationSettings.productAlerts.subtitle')}
            </Typography>
          </Box>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            {t('notificationSettings.productAlerts.addNew')}
          </Button>
        </Box>

        {localPrefs.productAlerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {t('notificationSettings.productAlerts.empty')}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {localPrefs.productAlerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={alert.productName}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {t('notificationSettings.productAlerts.target')}: ₹{alert.targetPrice}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('notificationSettings.productAlerts.current')}: ₹{alert.currentPrice}
                        </Typography>
                        {alert.currentPrice <= alert.targetPrice && (
                          <Chip
                            label={t('notificationSettings.productAlerts.priceReached')}
                            size="small"
                            color="success"
                            sx={{ height: 20 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteProductAlert(alert.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setLocalPrefs(preferences)}
          sx={{ textTransform: 'none' }}
        >
          {t('notificationSettings.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ textTransform: 'none', minWidth: 120 }}
        >
          {t('notificationSettings.save')}
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationPreferences;

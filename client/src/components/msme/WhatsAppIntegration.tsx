import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AlertConfig {
  id: string;
  name: string;
  enabled: boolean;
  frequency: string;
  time: string;
  preview: string;
}

interface MessageHistory {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

const WhatsAppIntegration: React.FC = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Alert configurations
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([
    {
      id: 'alert-1',
      name: 'Daily Price Summary',
      enabled: true,
      frequency: 'daily',
      time: '08:00',
      preview:
        '📊 *Daily Price Summary*\n\nGood morning! Here\'s your daily report:\n\n*Top Performers:*\n• Samsung Galaxy Buds - ₹5,999 (15 sold)\n• Wireless Mouse - ₹699 (28 sold)\n\n*Price Changes:*\n• Smart LED Bulb: ₹499 → ₹479 (-4%)\n\nHave a great day! 🌟',
    },
    {
      id: 'alert-2',
      name: 'Price Drop Alerts',
      enabled: true,
      frequency: 'instant',
      time: '',
      preview:
        '📉 *Price Alert*\n\n*Bluetooth Speaker* price dropped!\n\nOld Price: ₹1,899\nNew Price: ₹1,799\nSavings: ₹100 (5%)\n\nCompetitor: Amazon\n\n_Your price has been auto-adjusted to ₹1,749_ ✅',
    },
    {
      id: 'alert-3',
      name: 'Competitor Price Changes',
      enabled: false,
      frequency: 'daily',
      time: '18:00',
      preview:
        '🔔 *Competitor Watch - Daily Digest*\n\nPrice changes detected today:\n\n1. *Samsung Galaxy Buds*\n   Flipkart: ₹5,999 → ₹5,799\n   Your price: ₹5,999\n\n2. *USB-C Cable 2m*\n   Amazon: ₹249 → ₹229\n   Your price: ₹249\n\n_Review and adjust?_',
    },
    {
      id: 'alert-4',
      name: 'Low Stock Warnings',
      enabled: true,
      frequency: 'instant',
      time: '',
      preview:
        '⚠️ *Low Stock Alert*\n\n*Gel Pen Blue Pack* is running low!\n\nCurrent Stock: 5 units\nReorder Level: 10 units\n\n_Action required: Restock soon_ 📦',
    },
    {
      id: 'alert-5',
      name: 'Weekly Business Report',
      enabled: true,
      frequency: 'weekly',
      time: '09:00',
      preview:
        '💰 *Weekly Report*\n\nHere\'s your week in numbers:\n\n*Sales:* ₹2,45,800 (+12%)\n*Orders:* 156 orders\n*Avg Order:* ₹1,575\n\n*Top Category:* Electronics (42%)\n*Best Day:* Friday - ₹48,200\n\nKeep up the great work! 🎉',
    },
  ]);

  // Message history
  const [messageHistory] = useState<MessageHistory[]>([
    {
      id: 'msg-1',
      type: 'Daily Price Summary',
      message: 'Good morning! Here\'s your daily report: Top Performers - Samsung Galaxy Buds...',
      timestamp: '2026-02-12 08:00 AM',
    },
    {
      id: 'msg-2',
      type: 'Price Drop Alert',
      message: 'Bluetooth Speaker price dropped! Old: ₹1,899, New: ₹1,799...',
      timestamp: '2026-02-11 03:45 PM',
    },
    {
      id: 'msg-3',
      type: 'Low Stock Warning',
      message: 'Gel Pen Blue Pack is running low! Current Stock: 5 units...',
      timestamp: '2026-02-11 11:20 AM',
    },
    {
      id: 'msg-4',
      type: 'Daily Price Summary',
      message: 'Good morning! Here\'s your daily report: Top Performers - Smart LED Bulb...',
      timestamp: '2026-02-11 08:00 AM',
    },
    {
      id: 'msg-5',
      type: 'Price Drop Alert',
      message: 'Face Cream SPF 50 price dropped! Old: ₹599, New: ₹579...',
      timestamp: '2026-02-10 02:15 PM',
    },
    {
      id: 'msg-6',
      type: 'Weekly Business Report',
      message: 'Here\'s your week in numbers: Sales: ₹2,45,800 (+12%), Orders: 156...',
      timestamp: '2026-02-10 09:00 AM',
    },
    {
      id: 'msg-7',
      type: 'Low Stock Warning',
      message: 'USB-C Cable 2m is running low! Current Stock: 3 units...',
      timestamp: '2026-02-09 04:30 PM',
    },
    {
      id: 'msg-8',
      type: 'Daily Price Summary',
      message: 'Good morning! Here\'s your daily report: Top Performers - Wireless Mouse...',
      timestamp: '2026-02-09 08:00 AM',
    },
    {
      id: 'msg-9',
      type: 'Price Drop Alert',
      message: 'Smart LED Bulb price dropped! Old: ₹499, New: ₹479...',
      timestamp: '2026-02-08 01:20 PM',
    },
    {
      id: 'msg-10',
      type: 'Daily Price Summary',
      message: 'Good morning! Here\'s your daily report: Top Performers - Basmati Rice...',
      timestamp: '2026-02-08 08:00 AM',
    },
  ]);

  const handleToggleAlert = (id: string) => {
    setAlertConfigs(
      alertConfigs.map((config) => (config.id === id ? { ...config, enabled: !config.enabled } : config))
    );
  };

  const handleTimeChange = (id: string, time: string) => {
    setAlertConfigs(alertConfigs.map((config) => (config.id === id ? { ...config, time } : config)));
  };

  const handleSendOTP = () => {
    setOtpSent(true);
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      setIsConnected(true);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setOtpSent(false);
    setOtp('');
  };

  const handleSendTest = () => {
    alert(t('Test message sent successfully! Check your WhatsApp.'));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <WhatsAppIcon sx={{ fontSize: 48, color: '#25D366' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
          {t('WhatsApp Business Alerts')}
        </Typography>
      </Box>

      {/* Connection Status Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {isConnected ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50' }}>
                    {t('Connected')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Connected to')} {phoneNumber}
                  </Typography>
                </Box>
                <Button variant="outlined" color="error" onClick={handleDisconnect}>
                  {t('Disconnect')}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {t('Connect Your WhatsApp Business Account')}
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    label={t('Phone Number')}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSendOTP}
                    disabled={otpSent}
                    sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1fa855' } }}
                  >
                    {otpSent ? t('Code Sent') : t('Send Verification Code')}
                  </Button>
                </Grid>
              </Grid>
              {otpSent && (
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label={t('Enter OTP')}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      fullWidth
                      inputProps={{ maxLength: 6 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleVerify}
                      disabled={otp.length !== 6}
                      sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
                    >
                      {t('Verify & Connect')}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Alert Configuration */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {t('Alert Configuration')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {alertConfigs.map((config) => (
              <Grid item xs={12} md={6} key={config.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsIcon sx={{ color: config.enabled ? '#25D366' : '#9e9e9e' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {t(config.name)}
                        </Typography>
                      </Box>
                      <Switch checked={config.enabled} onChange={() => handleToggleAlert(config.id)} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip
                        label={config.frequency === 'instant' ? t('Instant') : config.frequency === 'daily' ? t('Daily') : t('Weekly')}
                        size="small"
                        color={config.frequency === 'instant' ? 'error' : 'primary'}
                      />
                      {config.frequency !== 'instant' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <TextField
                            type="time"
                            value={config.time}
                            onChange={(e) => handleTimeChange(config.id, e.target.value)}
                            size="small"
                            disabled={!config.enabled}
                            sx={{ width: 120 }}
                          />
                        </Box>
                      )}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {t('Message Preview:')}
                    </Typography>
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: '#dcf8c6',
                        borderRadius: 2,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          right: -8,
                          top: 10,
                          width: 0,
                          height: 0,
                          borderLeft: '8px solid #dcf8c6',
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'pre-line',
                          fontSize: '0.85rem',
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                        }}
                      >
                        {config.preview}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Test Message */}
          <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {t('Test Your Integration')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Send a test message to verify WhatsApp is working correctly')}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendTest}
                  sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1fa855' } }}
                >
                  {t('Send Test Message')}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Message History */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {t('Message History')}
          </Typography>
          <Card>
            <CardContent>
              <List>
                {messageHistory.map((msg, index) => (
                  <React.Fragment key={msg.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <Avatar sx={{ bgcolor: '#25D366', mr: 2 }}>
                        <WhatsAppIcon />
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {msg.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {msg.timestamp}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {msg.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < messageHistory.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default WhatsAppIntegration;

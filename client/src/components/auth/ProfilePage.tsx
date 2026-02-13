import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Avatar,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  useTheme,
  Autocomplete,
  Badge,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CameraAlt,
  Edit,
  Check,
  Close,
  Logout,
  Delete,
  Upgrade,
  Google,
  Facebook,
  CheckCircle,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const { user, updateProfile, logout } = useAuthStore();

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    language: 'en',
    theme: 'system',
  });

  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([
    'Electronics',
    'Fashion',
    'Groceries',
  ]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  const subscriptionTier: SubscriptionTier = (user?.subscriptionTier as SubscriptionTier) || 'free';

  const categories = [
    'Electronics',
    'Fashion',
    'Groceries',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
    'Toys',
    'Automotive',
    'Health',
  ];

  const tierColors = {
    free: 'default',
    basic: 'primary',
    pro: 'secondary',
    enterprise: 'error',
  } as const;

  const tierLabels = {
    free: t('profile.tier.free', 'Free'),
    basic: t('profile.tier.basic', 'Basic'),
    pro: t('profile.tier.pro', 'Pro'),
    enterprise: t('profile.tier.enterprise', 'Enterprise'),
  };

  const handleEditToggle = (field: 'name' | 'email' | 'phone') => {
    if (editMode[field]) {
      // Save changes
      updateProfile({ [field]: formData[field] });
    }
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handlePreferenceChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [field]: e.target.checked });
  };

  const handleSelectChange = (field: string) => (e: any) => {
    setPreferences({ ...preferences, [field]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call the delete account API
    setDeleteDialogOpen(false);
    logout();
    navigate('/');
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    console.log('Change avatar');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        {t('profile.title', 'My Profile')}
      </Typography>

      {/* Profile Header Card */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '3rem',
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <IconButton
                onClick={handleAvatarChange}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  border: '2px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                  opacity: avatarHover ? 1 : 0.7,
                  transition: 'all 0.3s',
                }}
              >
                <CameraAlt />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {user?.name}
                </Typography>
                <Chip
                  label={tierLabels[subscriptionTier]}
                  color={tierColors[subscriptionTier]}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={user?.role === 'msme' ? t('profile.role.business', 'Business') : t('profile.role.consumer', 'Consumer')}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user?.email}
              </Typography>

              {subscriptionTier === 'free' && (
                <Button
                  variant="contained"
                  startIcon={<Upgrade />}
                  onClick={() => navigate('/pricing')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #ff6f00 30%, #ffa726 90%)',
                  }}
                >
                  {t('profile.upgradePlan', 'Upgrade Plan')}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {/* Personal Information */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              {t('profile.personalInfo', 'Personal Information')}
            </Typography>

            {/* Name */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('profile.fullName', 'Full Name')}
                </Typography>
                <IconButton size="small" onClick={() => handleEditToggle('name')}>
                  {editMode.name ? <Check color="primary" /> : <Edit />}
                </IconButton>
              </Box>
              {editMode.name ? (
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formData.name}
                </Typography>
              )}
            </Box>

            {/* Email */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('profile.email', 'Email')}
                </Typography>
                <IconButton size="small" onClick={() => handleEditToggle('email')}>
                  {editMode.email ? <Check color="primary" /> : <Edit />}
                </IconButton>
              </Box>
              {editMode.email ? (
                <TextField
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  size="small"
                  type="email"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formData.email}
                </Typography>
              )}
            </Box>

            {/* Phone */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('profile.phone', 'Phone')}
                </Typography>
                <IconButton size="small" onClick={() => handleEditToggle('phone')}>
                  {editMode.phone ? <Check color="primary" /> : <Edit />}
                </IconButton>
              </Box>
              {editMode.phone ? (
                <TextField
                  fullWidth
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  size="small"
                  placeholder="+91 98765 43210"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formData.phone || t('profile.notSet', 'Not set')}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              {t('profile.connectedAccounts', 'Connected Accounts')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#4285f4',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    G
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Google
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.connected', 'Connected')}
                    </Typography>
                  </Box>
                </Box>
                <CheckCircle color="success" />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#1877f2',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    f
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Facebook
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('profile.notConnected', 'Not connected')}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {t('profile.connect', 'Connect')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              {t('profile.notifications', 'Notification Preferences')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                }
                label={t('profile.emailNotifications', 'Email Notifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.pushNotifications}
                    onChange={handlePreferenceChange('pushNotifications')}
                  />
                }
                label={t('profile.pushNotifications', 'Push Notifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.smsNotifications}
                    onChange={handlePreferenceChange('smsNotifications')}
                  />
                }
                label={t('profile.smsNotifications', 'SMS Notifications')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.whatsappNotifications}
                    onChange={handlePreferenceChange('whatsappNotifications')}
                  />
                }
                label={t('profile.whatsappNotifications', 'WhatsApp Notifications')}
              />
            </Box>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              {t('profile.appPreferences', 'App Preferences')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>{t('profile.language', 'Language')}</InputLabel>
                <Select
                  value={preferences.language}
                  label={t('profile.language', 'Language')}
                  onChange={handleSelectChange('language')}
                >
                  <MenuItem value="en">{t('profile.lang.english', 'English')}</MenuItem>
                  <MenuItem value="hi">{t('profile.lang.hindi', 'हिन्दी')}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('profile.theme', 'Theme')}</InputLabel>
                <Select
                  value={preferences.theme}
                  label={t('profile.theme', 'Theme')}
                  onChange={handleSelectChange('theme')}
                >
                  <MenuItem value="light">{t('profile.theme.light', 'Light')}</MenuItem>
                  <MenuItem value="dark">{t('profile.theme.dark', 'Dark')}</MenuItem>
                  <MenuItem value="system">{t('profile.theme.system', 'System')}</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('profile.favoriteCategories', 'Favorite Categories')}
                </Typography>
                <Autocomplete
                  multiple
                  options={categories}
                  value={favoriteCategories}
                  onChange={(_, newValue) => setFavoriteCategories(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('profile.selectCategories', 'Select categories')}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} />
                    ))
                  }
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Danger Zone */}
      <Card sx={{ mt: 3, borderRadius: 3, border: '1px solid', borderColor: 'error.main' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'error.main' }}>
            {t('profile.dangerZone', 'Danger Zone')}
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            {t('profile.dangerZoneWarning', 'These actions are irreversible. Please proceed with caution.')}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              {t('profile.deleteAccount', 'Delete Account')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              {t('profile.logout', 'Logout')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('profile.deleteDialog.title', 'Delete Account?')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'profile.deleteDialog.message',
              'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" sx={{ textTransform: 'none' }}>
            {t('profile.deleteDialog.confirm', 'Delete Account')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;

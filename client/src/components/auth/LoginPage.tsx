import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  TrendingUp,
  Insights,
  Speed,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { login, loginWithGoogle, loginWithFacebook, isLoading, error, clearError, user } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = t('auth.validation.emailRequired', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('auth.validation.emailInvalid', 'Invalid email format');
    }

    if (!formData.password) {
      errors.password = t('auth.validation.passwordRequired', 'Password is required');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by auth store or redirect logic
      const userRole = user?.role || 'consumer';
      navigate(userRole === 'msme' ? '/msme/dashboard' : '/consumer/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await loginWithGoogle();
      const userRole = user?.role || 'consumer';
      navigate(userRole === 'msme' ? '/msme/dashboard' : '/consumer/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleFacebookLogin = async () => {
    clearError();
    try {
      await loginWithFacebook();
      const userRole = user?.role || 'consumer';
      navigate(userRole === 'msme' ? '/msme/dashboard' : '/consumer/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: field === 'rememberMe' ? e.target.checked : e.target.value });
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors({ ...validationErrors, [field]: undefined });
    }
  };

  const BrandingPanel = () => (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0d1642 0%, #1a237e 100%)',
        color: 'white',
        p: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 111, 0, 0.1) 0%, transparent 50%)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(to right, #ffffff, #ffab40)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          RetailIQ
        </Typography>
        <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, fontWeight: 300 }}>
          {t('auth.tagline', 'AI-Powered Retail Intelligence for India')}
        </Typography>

        <Box sx={{ mt: 4 }}>
          {[
            { icon: <Insights />, text: t('auth.feature1', 'Real-time market intelligence') },
            { icon: <TrendingUp />, text: t('auth.feature2', 'Predictive pricing analytics') },
            { icon: <Speed />, text: t('auth.feature3', 'Instant product insights') },
            { icon: <CheckCircle />, text: t('auth.feature4', 'Trusted by 10,000+ retailers') },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                opacity: 0,
                animation: 'fadeInUp 0.6s ease forwards',
                animationDelay: `${index * 0.1}s`,
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box
                sx={{
                  mr: 2,
                  p: 1,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="body1">{feature.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#f5f7fa',
      }}
    >
      {!isMobile && (
        <Box sx={{ width: '45%', minHeight: '100vh' }}>
          <BrandingPanel />
        </Box>
      )}

      <Box
        sx={{
          width: isMobile ? '100%' : '55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Typography
                variant="h4"
                sx={{ mb: 1, fontWeight: 700, color: theme.palette.primary.main }}
              >
                {t('auth.login.title', 'Welcome Back')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t('auth.login.subtitle', 'Sign in to continue to RetailIQ')}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  label={t('auth.email', 'Email')}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  margin="normal"
                  autoComplete="email"
                  autoFocus
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label={t('auth.password', 'Password')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                  margin="normal"
                  autoComplete="current-password"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={t('auth.togglePassword', 'Toggle password visibility')}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={handleInputChange('rememberMe')}
                        color="primary"
                      />
                    }
                    label={t('auth.rememberMe', 'Remember me')}
                  />
                  <Link
                    href="/forgot-password"
                    variant="body2"
                    sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                  >
                    {t('auth.forgotPassword', 'Forgot password?')}
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('auth.login.button', 'Login')
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.orContinueWith', 'or continue with')}
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#4285f4',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      G
                    </Box>
                    Google
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: 'divider',
                      bgcolor: '#1877f2',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#166fe5',
                        borderColor: '#1877f2',
                      },
                    }}
                  >
                    Facebook
                  </Button>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.login.noAccount', "Don't have an account?")}{' '}
                    <Link
                      href="/register"
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {t('auth.signup', 'Sign up')}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;

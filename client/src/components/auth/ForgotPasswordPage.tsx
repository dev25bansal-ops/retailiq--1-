import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Email, ArrowBack, CheckCircle } from '@mui/icons-material';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateEmail = () => {
    if (!email) {
      setValidationError(t('auth.validation.emailRequired', 'Email is required'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError(t('auth.validation.emailInvalid', 'Invalid email format'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError('');

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real app, this would call the password reset API
      // await authApi.sendPasswordResetEmail(email);
      
      setSuccess(true);
    } catch (err) {
      setError(
        t('auth.forgotPassword.error', 'Failed to send reset email. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f7fa',
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
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>

              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                {t('auth.forgotPassword.successTitle', 'Check Your Email')}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {t(
                  'auth.forgotPassword.successMessage',
                  'We have sent a password reset link to:'
                )}
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 4, fontWeight: 600, color: theme.palette.primary.main }}
              >
                {email}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t(
                  'auth.forgotPassword.checkSpam',
                  "Didn't receive the email? Check your spam folder or try again."
                )}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => setSuccess(false)}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 4,
                  }}
                >
                  {t('auth.forgotPassword.resend', 'Resend Email')}
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 4,
                  }}
                >
                  {t('auth.forgotPassword.backToLogin', 'Back to Login')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f7fa',
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
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Email sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>

            <Typography
              variant="h4"
              sx={{ mb: 1, fontWeight: 700, textAlign: 'center', color: theme.palette.primary.main }}
            >
              {t('auth.forgotPassword.title', 'Forgot Password?')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              {t(
                'auth.forgotPassword.subtitle',
                'Enter your email and we will send you a link to reset your password'
              )}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label={t('auth.email', 'Email')}
                type="email"
                value={email}
                onChange={handleInputChange}
                error={!!validationError}
                helperText={validationError}
                margin="normal"
                autoComplete="email"
                autoFocus
                sx={{ mb: 3 }}
              />

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
                  t('auth.forgotPassword.button', 'Send Reset Link')
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  href="/login"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
                  {t('auth.forgotPassword.backToLogin', 'Back to Login')}
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;

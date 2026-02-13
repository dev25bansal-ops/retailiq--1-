import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Lock, Upgrade } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';

type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'consumer' | 'msme' | 'admin';
  requiredSubscription?: SubscriptionTier[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredSubscription,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f7fa',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            {t('auth.loading', 'Loading...')}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
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
                  bgcolor: 'error.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Lock sx={{ fontSize: 48, color: 'error.main' }} />
              </Box>

              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                {t('auth.accessDenied', 'Access Denied')}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {t(
                  'auth.wrongRole',
                  'You do not have permission to access this page. This page is only available to {role} users.',
                  { role: requiredRole }
                )}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  {t('common.goBack', 'Go Back')}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => (window.location.href = `/${user.role}/dashboard`)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  {t('auth.goToDashboard', 'Go to Dashboard')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Check subscription requirement
  if (requiredSubscription && requiredSubscription.length > 0) {
    const userSubscription = (user.subscriptionTier as SubscriptionTier) || 'free';
    const tierHierarchy: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise'];
    const userTierLevel = tierHierarchy.indexOf(userSubscription);
    const requiredTierLevel = Math.min(
      ...requiredSubscription.map((tier) => tierHierarchy.indexOf(tier))
    );

    if (userTierLevel < requiredTierLevel) {
      const requiredTierName = requiredSubscription[0];

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
                    bgcolor: 'warning.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Upgrade sx={{ fontSize: 48, color: 'warning.main' }} />
                </Box>

                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                  {t('auth.upgradeRequired', 'Upgrade Required')}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {t(
                    'auth.subscriptionTooLow',
                    'This feature requires a {tier} subscription or higher.',
                    { tier: requiredTierName.toUpperCase() }
                  )}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {t('auth.currentPlan', 'Your current plan: {plan}', {
                    plan: userSubscription.toUpperCase(),
                  })}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={() => window.history.back()}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    {t('common.goBack', 'Go Back')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => (window.location.href = '/pricing')}
                    startIcon={<Upgrade />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #ff6f00 30%, #ffa726 90%)',
                    }}
                  >
                    {t('auth.viewPlans', 'View Plans')}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;

import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from './components/layout';
import { useAppStore } from './stores';
import { ErrorBoundary, LoadingOverlay } from './components/common';

// Lazy-loaded pages for code splitting
const ConsumerDashboard = lazy(() => import('./pages/ConsumerDashboard'));
const ProductTracking = lazy(() => import('./pages/ProductTracking'));
const PriceHistory = lazy(() => import('./pages/PriceHistory'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const FestivalDeals = lazy(() => import('./pages/FestivalDeals'));
const MSMEDashboard = lazy(() => import('./pages/MSMEDashboard'));
const PricingStrategy = lazy(() => import('./pages/PricingStrategy'));
const CompetitiveIntel = lazy(() => import('./pages/CompetitiveIntel'));
const PredictivePricing = lazy(() => import('./pages/PredictivePricing'));

// New feature pages (lazy loaded)
const LoginPage = lazy(() => import('./components/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./components/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./components/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ProfilePage = lazy(() => import('./components/auth/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PricingPage = lazy(() => import('./components/monetization/PricingPage').then(m => ({ default: m.PricingPage })));
const CheckoutPage = lazy(() => import('./components/monetization/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const NotificationPreferences = lazy(() => import('./components/notifications/NotificationPreferences').then(m => ({ default: m.NotificationPreferences })));

// MSME feature pages
const InventoryManager = lazy(() => import('./components/msme/InventoryManager'));
const AutoRepricing = lazy(() => import('./components/msme/AutoRepricing'));
const GSTInsights = lazy(() => import('./components/msme/GSTInsights'));
const WhatsAppIntegration = lazy(() => import('./components/msme/WhatsAppIntegration'));

// Consumer feature pages
const DealCommunity = lazy(() => import('./components/consumer/DealCommunity'));
const FestivalWidget = lazy(() => import('./components/consumer/FestivalWidget'));
const GroupBuying = lazy(() => import('./components/consumer/GroupBuying'));
const BrowserExtension = lazy(() => import('./components/consumer/BrowserExtension'));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      {children}
    </Suspense>
  );
}

function AppRoutes() {
  const { viewMode, setViewMode } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (viewMode === 'consumer' && location.pathname.startsWith('/msme')) {
      navigate('/consumer/dashboard', { replace: true });
    } else if (viewMode === 'msme' && location.pathname.startsWith('/consumer')) {
      navigate('/msme/dashboard', { replace: true });
    }
  }, [viewMode]);

  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/login" element={<PageSuspense><LoginPage /></PageSuspense>} />
      <Route path="/register" element={<PageSuspense><RegisterPage /></PageSuspense>} />
      <Route path="/forgot-password" element={<PageSuspense><ForgotPasswordPage /></PageSuspense>} />

      {/* Main app routes (with layout) */}
      <Route
        element={
          <AppLayout
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        {/* Consumer Routes */}
        <Route path="/consumer/dashboard" element={<PageSuspense><ConsumerDashboard /></PageSuspense>} />
        <Route path="/consumer/track" element={<PageSuspense><ProductTracking /></PageSuspense>} />
        <Route path="/consumer/history" element={<PageSuspense><PriceHistory /></PageSuspense>} />
        <Route path="/consumer/chat" element={<PageSuspense><ChatPage /></PageSuspense>} />
        <Route path="/consumer/alerts" element={<PageSuspense><AlertsPage /></PageSuspense>} />
        <Route path="/consumer/festivals" element={<PageSuspense><FestivalDeals /></PageSuspense>} />
        <Route path="/consumer/community" element={<PageSuspense><DealCommunity /></PageSuspense>} />
        <Route path="/consumer/group-buying" element={<PageSuspense><GroupBuying /></PageSuspense>} />
        <Route path="/consumer/festival-countdown" element={<PageSuspense><FestivalWidget /></PageSuspense>} />
        <Route path="/consumer/extension" element={<PageSuspense><BrowserExtension /></PageSuspense>} />
        <Route path="/consumer/predictive" element={<PageSuspense><PredictivePricing /></PageSuspense>} />

        {/* MSME Routes */}
        <Route path="/msme/dashboard" element={<PageSuspense><MSMEDashboard /></PageSuspense>} />
        <Route path="/msme/pricing" element={<PageSuspense><PricingStrategy /></PageSuspense>} />
        <Route path="/msme/competitive" element={<PageSuspense><CompetitiveIntel /></PageSuspense>} />
        <Route path="/msme/predictive" element={<PageSuspense><PredictivePricing /></PageSuspense>} />
        <Route path="/msme/inventory" element={<PageSuspense><InventoryManager /></PageSuspense>} />
        <Route path="/msme/repricing" element={<PageSuspense><AutoRepricing /></PageSuspense>} />
        <Route path="/msme/gst" element={<PageSuspense><GSTInsights /></PageSuspense>} />
        <Route path="/msme/whatsapp" element={<PageSuspense><WhatsAppIntegration /></PageSuspense>} />
        <Route path="/msme/reports" element={<PageSuspense><MSMEDashboard /></PageSuspense>} />

        {/* Shared Routes */}
        <Route path="/profile" element={<PageSuspense><ProfilePage /></PageSuspense>} />
        <Route path="/pricing" element={<PageSuspense><PricingPage /></PageSuspense>} />
        <Route path="/checkout" element={<PageSuspense><CheckoutPage /></PageSuspense>} />
        <Route path="/notification-preferences" element={<PageSuspense><NotificationPreferences /></PageSuspense>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/consumer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/consumer/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from './components/layout';
import ConsumerDashboard from './pages/ConsumerDashboard';
import ProductTracking from './pages/ProductTracking';
import PriceHistory from './pages/PriceHistory';
import ChatPage from './pages/ChatPage';
import AlertsPage from './pages/AlertsPage';
import FestivalDeals from './pages/FestivalDeals';
import MSMEDashboard from './pages/MSMEDashboard';
import PricingStrategy from './pages/PricingStrategy';
import CompetitiveIntel from './pages/CompetitiveIntel';
import type { ViewMode } from './types';
import { sampleAlerts } from './data/sampleData';

function AppRoutes() {
  const [viewMode, setViewMode] = useState<ViewMode>('consumer');
  const unreadAlerts = sampleAlerts.filter((a) => !a.read).length;
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
      <Route
        element={
          <AppLayout
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            notificationCount={unreadAlerts}
          />
        }
      >
        {/* Consumer Routes */}
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/consumer/track" element={<ProductTracking />} />
        <Route path="/consumer/history" element={<PriceHistory />} />
        <Route path="/consumer/chat" element={<ChatPage />} />
        <Route path="/consumer/alerts" element={<AlertsPage />} />
        <Route path="/consumer/festivals" element={<FestivalDeals />} />

        {/* MSME Routes */}
        <Route path="/msme/dashboard" element={<MSMEDashboard />} />
        <Route path="/msme/pricing" element={<PricingStrategy />} />
        <Route path="/msme/competitive" element={<CompetitiveIntel />} />
        <Route path="/msme/reports" element={<MSMEDashboard />} />
        <Route path="/msme/settings" element={<MSMEDashboard />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/consumer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/consumer/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from './components/Layout';
import Navigation from './components/Navigation';

// Web Applications
import MEVVisualizer from './apps/MEVVisualizer';
import ArbitrageCalculator from './apps/ArbitrageCalculator';
import MEVProtectionChecker from './apps/MEVProtectionChecker';
import GasFeePredictor from './apps/GasFeePredictor';

// Dashboards
import MEVMarketDashboard from './dashboards/MEVMarketDashboard';
import SearcherLeaderboard from './dashboards/SearcherLeaderboard';
import DEXEfficiencyTracker from './dashboards/DEXEfficiencyTracker';
import CrossChainMEVMonitor from './dashboards/CrossChainMEVMonitor';

// Home page
import Home from './pages/Home';
import PopularPools from './pages/PopularPools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Web Applications */}
              <Route path="/visualizer" element={<MEVVisualizer />} />
              <Route path="/calculator" element={<ArbitrageCalculator />} />
              <Route path="/protection" element={<MEVProtectionChecker />} />
              <Route path="/gas-predictor" element={<GasFeePredictor />} />
              
              {/* Dashboards */}
              <Route path="/dashboard/market" element={<MEVMarketDashboard />} />
              <Route path="/dashboard/leaderboard" element={<SearcherLeaderboard />} />
              <Route path="/dashboard/dex-efficiency" element={<DEXEfficiencyTracker />} />
              <Route path="/dashboard/cross-chain" element={<CrossChainMEVMonitor />} />
              <Route path="/popular-pools" element={<PopularPools />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


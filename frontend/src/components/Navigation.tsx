import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  Shield, 
  Zap, 
  TrendingUp, 
  Trophy, 
  Activity, 
  Globe,
  Menu,
  X,
  Home
} from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      title: 'Web Applications',
      items: [
        { name: 'MEV Visualizer', path: '/visualizer', icon: BarChart3 },
        { name: 'Arbitrage Calculator', path: '/calculator', icon: Calculator },
        { name: 'MEV Protection', path: '/protection', icon: Shield },
        { name: 'Gas Fee Predictor', path: '/gas-predictor', icon: Zap },
      ]
    },
    {
      title: 'Dashboards',
      items: [
        { name: 'Market Dashboard', path: '/dashboard/market', icon: TrendingUp },
        { name: 'Searcher Leaderboard', path: '/dashboard/leaderboard', icon: Trophy },
        { name: 'DEX Efficiency', path: '/dashboard/dex-efficiency', icon: Activity },
        { name: 'Cross-Chain Monitor', path: '/dashboard/cross-chain', icon: Globe },
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MEV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Education Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((section) => (
              <div key={section.title} className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium py-2">
                  <span>{section.title}</span>
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 ${
                          isActive(item.path) ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <li>
              <a href="/popular-pools" className="hover:underline">
                Popular Pools
              </a>
            </li>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((section) => (
              <div key={section.title}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;



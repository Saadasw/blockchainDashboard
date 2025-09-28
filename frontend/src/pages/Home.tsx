import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  Shield, 
  Zap, 
  TrendingUp, 
  Trophy, 
  Activity, 
  Globe,
  ArrowRight,
  Play
} from 'lucide-react';

const Home: React.FC = () => {
  const applications = [
    {
      title: 'MEV Transaction Visualizer',
      description: 'Real-time visualization of MEV transactions across multiple chains',
      path: '/visualizer',
      icon: BarChart3,
      color: 'from-blue-500 to-purple-600',
      features: ['Live transaction feed', 'MEV type classification', 'Profit analysis']
    },
    {
      title: 'Arbitrage Opportunity Calculator',
      description: 'Educational tool for understanding and calculating arbitrage opportunities',
      path: '/calculator',
      icon: Calculator,
      color: 'from-green-500 to-teal-600',
      features: ['Multi-DEX comparison', 'Slippage calculation', 'Gas cost analysis']
    },
    {
      title: 'MEV Protection Checker',
      description: 'Check your transactions for MEV vulnerability and get protection recommendations',
      path: '/protection',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      features: ['Transaction analysis', 'Protection strategies', 'Risk assessment']
    },
    {
      title: 'Gas Fee Predictor',
      description: 'MEV-aware gas fee estimation and optimization',
      path: '/gas-predictor',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      features: ['Fee prediction', 'Timing optimization', 'MEV impact analysis']
    }
  ];

  const dashboards = [
    {
      title: 'MEV Market Dashboard',
      description: 'Track MEV trends and market conditions across different protocols',
      path: '/dashboard/market',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
      metrics: ['Total MEV volume', 'Average profit', 'Success rate']
    },
    {
      title: 'Searcher Leaderboard',
      description: 'Monitor top MEV extractors and their performance metrics',
      path: '/dashboard/leaderboard',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      metrics: ['Top performers', 'Profit rankings', 'Success rates']
    },
    {
      title: 'DEX Efficiency Tracker',
      description: 'Compare MEV levels and efficiency across different decentralized exchanges',
      path: '/dashboard/dex-efficiency',
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
      metrics: ['DEX comparison', 'Efficiency scores', 'MEV exposure']
    },
    {
      title: 'Cross-Chain MEV Monitor',
      description: 'Multi-chain analysis and cross-chain opportunity tracking',
      path: '/dashboard/cross-chain',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      metrics: ['Cross-chain flows', 'Opportunity tracking', 'Chain comparison']
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          MEV Education & Analysis
          <span className="text-gradient block">Platform</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn about Maximal Extractable Value (MEV) through interactive tools, 
          real-time visualizations, and comprehensive market analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/visualizer" className="btn-primary inline-flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Start Exploring</span>
          </Link>
          <a href="#applications" className="btn-secondary inline-flex items-center space-x-2">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Web Applications Section */}
      <section id="applications" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Web Applications</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Interactive tools to learn about MEV, calculate opportunities, and protect your transactions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Link
              key={app.path}
              to={app.path}
              className="card-hover group"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${app.color} flex items-center justify-center flex-shrink-0`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {app.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{app.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {app.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dashboards Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Dashboards</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive dashboards for tracking MEV trends, analyzing market data, and monitoring performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboards.map((dashboard) => (
            <Link
              key={dashboard.path}
              to={dashboard.path}
              className="card-hover group"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${dashboard.color} flex items-center justify-center flex-shrink-0`}>
                  <dashboard.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {dashboard.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{dashboard.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dashboard.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Learn About MEV?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Understanding MEV is crucial for anyone involved in DeFi, from traders to developers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Protect Your Transactions</h3>
            <p className="text-gray-600">
              Learn how to avoid MEV attacks and protect your DeFi transactions from front-running and sandwich attacks.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Identify Opportunities</h3>
            <p className="text-gray-600">
              Discover arbitrage opportunities and understand how MEV searchers identify and extract value.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analysis</h3>
            <p className="text-gray-600">
              Analyze MEV trends across different chains and protocols to make informed decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;



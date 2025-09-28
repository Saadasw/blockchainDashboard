import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  Clock,
  RefreshCw,
  Award,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Searcher {
  id: string;
  name: string;
  address: string;
  totalProfit: number;
  totalVolume: number;
  successRate: number;
  transactionCount: number;
  avgProfit: number;
  rank: number;
  change: number;
  strategies: string[];
  lastActive: Date;
  winStreak: number;
}

interface SearcherStats {
  totalSearchers: number;
  totalProfit: number;
  avgProfit: number;
  topProfit: number;
  activeToday: number;
}

const SearcherLeaderboard: React.FC = () => {
  const [searchers, setSearchers] = useState<Searcher[]>([]);
  const [stats, setStats] = useState<SearcherStats>({
    totalSearchers: 0,
    totalProfit: 0,
    avgProfit: 0,
    topProfit: 0,
    activeToday: 0,
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const strategies = [
    'Arbitrage', 'Sandwich', 'Frontrun', 'Backrun', 'Liquidation',
    'JIT', 'Time Boost', 'Cross-Chain', 'Flash Loan'
  ];

  const generateMockData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockSearchers: Searcher[] = [];
      const searcherNames = [
        'FlashMaster', 'ArbitrageKing', 'MEVHunter', 'ProfitSeeker', 'BlockRunner',
        'GasWizard', 'SlippageSlayer', 'LiquidationLord', 'SandwichSniper', 'FrontrunFury',
        'BackrunBaron', 'CrossChainCrusher', 'FlashLoanFighter', 'TimeBoostTitan', 'JITJuggernaut'
      ];

      let totalProfit = 0;
      let totalVolume = 0;

      for (let i = 0; i < 15; i++) {
        const profit = 5000 + Math.random() * 45000;
        const volume = 50000 + Math.random() * 450000;
        const successRate = 60 + Math.random() * 35;
        const transactionCount = 100 + Math.random() * 900;
        const avgProfit = profit / transactionCount;
        const change = (Math.random() - 0.5) * 30;
        const winStreak = Math.floor(Math.random() * 15) + 1;
        
        // Generate random strategies
        const numStrategies = Math.floor(Math.random() * 4) + 1;
        const selectedStrategies = strategies
          .sort(() => 0.5 - Math.random())
          .slice(0, numStrategies);

        totalProfit += profit;
        totalVolume += volume;

        mockSearchers.push({
          id: `searcher-${i}`,
          name: searcherNames[i],
          address: `0x${Math.random().toString(36).substr(2, 40)}`,
          totalProfit: profit,
          totalVolume: volume,
          successRate,
          transactionCount,
          avgProfit,
          rank: i + 1,
          change,
          strategies: selectedStrategies,
          lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          winStreak,
        });
      }

      // Sort by profit
      mockSearchers.sort((a, b) => b.totalProfit - a.totalProfit);
      mockSearchers.forEach((searcher, index) => {
        searcher.rank = index + 1;
      });

      const mockStats: SearcherStats = {
        totalSearchers: mockSearchers.length,
        totalProfit,
        avgProfit: totalProfit / mockSearchers.length,
        topProfit: mockSearchers[0].totalProfit,
        activeToday: mockSearchers.filter(s => 
          new Date().getTime() - s.lastActive.getTime() < 24 * 60 * 60 * 1000
        ).length,
      };

      setSearchers(mockSearchers);
      setStats(mockStats);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateMockData();
  }, [selectedTimeframe]);

  const profitChartData = {
    labels: searchers.slice(0, 10).map(s => s.name),
    datasets: [
      {
        label: 'Total Profit (USD)',
        data: searchers.slice(0, 10).map(s => s.totalProfit),
        backgroundColor: [
          'rgba(255, 215, 0, 0.8)',   // Gold
          'rgba(192, 192, 192, 0.8)', // Silver
          'rgba(205, 127, 50, 0.8)',  // Bronze
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)',  // Yellow
          'rgba(139, 92, 246, 0.8)',  // Purple
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(6, 182, 212, 0.8)',   // Cyan
          'rgba(168, 85, 247, 0.8)',  // Violet
        ],
      },
    ],
  };

  const successRateChartData = {
    labels: searchers.slice(0, 10).map(s => s.name),
    datasets: [
      {
        label: 'Success Rate (%)',
        data: searchers.slice(0, 10).map(s => s.successRate),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-medium text-gray-500">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <span className="w-4 h-4 text-gray-400">-</span>;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Searcher Leaderboard</h1>
          <p className="text-gray-600">Monitor top MEV extractors and their performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value as '24h' | '7d' | '30d')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
          <button
            onClick={generateMockData}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Searchers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSearchers}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold mev-profit">
                ${(stats.totalProfit / 1000).toFixed(1)}K
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.avgProfit.toFixed(2)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Profit</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.topProfit / 1000).toFixed(1)}K
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeToday}</p>
            </div>
            <Activity className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Profit Leaders</h3>
          <Bar data={profitChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Profit (USD)'
                }
              }
            }
          }} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Comparison</h3>
          <Line data={successRateChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Success Rate (%)'
                }
              }
            }
          }} />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Searcher Rankings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Searcher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchers.map((searcher, index) => (
                <tr key={searcher.id} className={`hover:bg-gray-50 ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(searcher.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{searcher.name}</p>
                      <p className="text-sm text-gray-500">{searcher.address.substring(0, 8)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-lg font-semibold mev-profit">
                      ${(searcher.totalProfit / 1000).toFixed(1)}K
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(searcher.totalVolume / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {searcher.successRate.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${searcher.successRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {searcher.transactionCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${searcher.avgProfit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {searcher.winStreak}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(searcher.change)}
                      <span className={`text-sm font-medium ${getChangeColor(searcher.change)}`}>
                        {searcher.change > 0 ? '+' : ''}{searcher.change.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {searcher.strategies.slice(0, 2).map((strategy, i) => (
                        <span
                          key={i}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {strategy}
                        </span>
                      ))}
                      {searcher.strategies.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          +{searcher.strategies.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {searcher.lastActive.toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearcherLeaderboard;


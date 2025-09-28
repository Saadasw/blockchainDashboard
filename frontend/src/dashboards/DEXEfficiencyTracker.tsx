import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface DEXData {
  name: string;
  volume: number;
  mevExposure: number;
  efficiencyScore: number;
  avgSlippage: number;
  gasEfficiency: number;
  liquidityDepth: number;
  transactionCount: number;
  successRate: number;
  mevProtection: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface EfficiencyMetrics {
  totalDEXs: number;
  avgEfficiency: number;
  bestEfficiency: number;
  worstEfficiency: number;
  totalVolume: number;
  totalMEV: number;
}

const DEXEfficiencyTracker: React.FC = () => {
  const [dexes, setDexes] = useState<DEXData[]>([]);
  const [metrics, setMetrics] = useState<EfficiencyMetrics>({
    totalDEXs: 0,
    avgEfficiency: 0,
    bestEfficiency: 0,
    worstEfficiency: 0,
    totalVolume: 0,
    totalMEV: 0,
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const generateMockData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const dexNames = [
        'Uniswap V3', 'SushiSwap', 'PancakeSwap', 'Curve', 'Balancer',
        '1inch', 'dYdX', 'GMX', 'Trader Joe', 'Orca'
      ];

      const mockDEXes: DEXData[] = dexNames.map((name, index) => {
        const volume = 100000 + Math.random() * 900000;
        const mevExposure = Math.random() * 100;
        const efficiencyScore = 100 - mevExposure + Math.random() * 20;
        const avgSlippage = 0.1 + Math.random() * 0.9;
        const gasEfficiency = 60 + Math.random() * 40;
        const liquidityDepth = 50 + Math.random() * 50;
        const transactionCount = 1000 + Math.random() * 9000;
        const successRate = 80 + Math.random() * 20;
        const mevProtection = Math.random() * 100;
        const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
        const change = (Math.random() - 0.5) * 20;

        return {
          name,
          volume,
          mevExposure,
          efficiencyScore: Math.max(0, Math.min(100, efficiencyScore)),
          avgSlippage,
          gasEfficiency,
          liquidityDepth,
          transactionCount,
          successRate,
          mevProtection,
          trend,
          change,
        };
      });

      // Calculate metrics
      const totalVolume = mockDEXes.reduce((sum, dex) => sum + dex.volume, 0);
      const totalMEV = mockDEXes.reduce((sum, dex) => sum + (dex.volume * dex.mevExposure / 100), 0);
      const avgEfficiency = mockDEXes.reduce((sum, dex) => sum + dex.efficiencyScore, 0) / mockDEXes.length;
      const bestEfficiency = Math.max(...mockDEXes.map(dex => dex.efficiencyScore));
      const worstEfficiency = Math.min(...mockDEXes.map(dex => dex.efficiencyScore));

      setDexes(mockDEXes);
      setMetrics({
        totalDEXs: mockDEXes.length,
        avgEfficiency,
        bestEfficiency,
        worstEfficiency,
        totalVolume,
        totalMEV,
      });
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateMockData();
  }, [selectedTimeframe]);

  const efficiencyChartData = {
    labels: dexes.map(dex => dex.name),
    datasets: [
      {
        label: 'Efficiency Score',
        data: dexes.map(dex => dex.efficiencyScore),
        backgroundColor: dexes.map(dex => {
          if (dex.efficiencyScore >= 80) return 'rgba(34, 197, 94, 0.8)';
          if (dex.efficiencyScore >= 60) return 'rgba(245, 158, 11, 0.8)';
          return 'rgba(239, 68, 68, 0.8)';
        }),
      },
    ],
  };

  const mevExposureChartData = {
    labels: dexes.map(dex => dex.name),
    datasets: [
      {
        label: 'MEV Exposure (%)',
        data: dexes.map(dex => dex.mevExposure),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const radarData = {
    labels: ['Efficiency', 'MEV Protection', 'Gas Efficiency', 'Liquidity', 'Success Rate'],
    datasets: dexes.slice(0, 5).map((dex, index) => ({
      label: dex.name,
      data: [
        dex.efficiencyScore,
        dex.mevProtection,
        dex.gasEfficiency,
        dex.liquidityDepth,
        dex.successRate,
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(245, 158, 11)',
        'rgb(139, 92, 246)',
        'rgb(239, 68, 68)',
      ][index],
      backgroundColor: [
        'rgba(59, 130, 246, 0.1)',
        'rgba(34, 197, 94, 0.1)',
        'rgba(245, 158, 11, 0.1)',
        'rgba(139, 92, 246, 0.1)',
        'rgba(239, 68, 68, 0.1)',
      ][index],
    })),
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getEfficiencyIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <span className="w-4 h-4 text-gray-400">-</span>;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">DEX Efficiency Tracker</h1>
          <p className="text-gray-600">Compare MEV levels and efficiency across different decentralized exchanges</p>
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

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total DEXs</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalDEXs}</p>
            </div>
            <Activity className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.avgEfficiency.toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Efficiency</p>
              <p className="text-2xl font-bold text-green-600">
                {metrics.bestEfficiency.toFixed(1)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Worst Efficiency</p>
              <p className="text-2xl font-bold text-red-600">
                {metrics.worstEfficiency.toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(metrics.totalVolume / 1000000).toFixed(2)}M
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total MEV</p>
              <p className="text-2xl font-bold mev-loss">
                ${(metrics.totalMEV / 1000).toFixed(1)}K
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Scores</h3>
          <Bar data={efficiencyChartData} options={{
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
                  text: 'Efficiency Score (%)'
                }
              }
            }
          }} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MEV Exposure</h3>
          <Line data={mevExposureChartData} options={{
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
                  text: 'MEV Exposure (%)'
                }
              }
            }
          }} />
        </div>
      </div>

      {/* Radar Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 DEXs Performance Radar</h3>
        <Radar data={radarData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
            },
          },
        }} />
      </div>

      {/* DEX Comparison Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">DEX Efficiency Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEX</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEV Exposure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slippage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gas Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEV Protection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dexes.map((dex, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{dex.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getEfficiencyIcon(dex.efficiencyScore)}
                      <span className={`text-sm font-medium ${getEfficiencyColor(dex.efficiencyScore)}`}>
                        {dex.efficiencyScore.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium mev-loss">
                        {dex.mevExposure.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${dex.mevExposure}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(dex.volume / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dex.avgSlippage.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {dex.gasEfficiency.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dex.gasEfficiency}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {dex.successRate.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${dex.successRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {dex.mevProtection.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${dex.mevProtection}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(dex.trend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getChangeColor(dex.change)}`}>
                      {dex.change > 0 ? '+' : ''}{dex.change.toFixed(1)}%
                    </span>
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

export default DEXEfficiencyTracker;


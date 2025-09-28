import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Network
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChainData {
  name: string;
  symbol: string;
  volume: number;
  mevVolume: number;
  transactionCount: number;
  avgGasPrice: number;
  avgBlockTime: number;
  totalValue: number;
  mevOpportunities: number;
  crossChainFlows: number;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface CrossChainFlow {
  fromChain: string;
  toChain: string;
  volume: number;
  opportunities: number;
  avgProfit: number;
  bridge: string;
  timestamp: Date;
}

interface CrossChainMetrics {
  totalChains: number;
  totalVolume: number;
  totalMEV: number;
  totalFlows: number;
  avgEfficiency: number;
  bestChain: string;
}

const CrossChainMEVMonitor: React.FC = () => {
  const [chains, setChains] = useState<ChainData[]>([]);
  const [flows, setFlows] = useState<CrossChainFlow[]>([]);
  const [metrics, setMetrics] = useState<CrossChainMetrics>({
    totalChains: 0,
    totalVolume: 0,
    totalMEV: 0,
    totalFlows: 0,
    avgEfficiency: 0,
    bestChain: '',
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(false);

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const bridges = ['Multichain', 'Stargate', 'Hop', 'Across', 'Synapse', 'Celer'];

  const generateMockData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const chainNames = [
        { name: 'Ethereum', symbol: 'ETH' },
        { name: 'Polygon', symbol: 'MATIC' },
        { name: 'BSC', symbol: 'BNB' },
        { name: 'Arbitrum', symbol: 'ARB' },
        { name: 'Optimism', symbol: 'OP' },
        { name: 'Avalanche', symbol: 'AVAX' },
        { name: 'Fantom', symbol: 'FTM' },
        { name: 'Solana', symbol: 'SOL' },
      ];

      const mockChains: ChainData[] = chainNames.map((chain, index) => {
        const volume = 500000 + Math.random() * 1500000;
        const mevVolume = volume * (0.05 + Math.random() * 0.15);
        const transactionCount = 50000 + Math.random() * 200000;
        const avgGasPrice = 10 + Math.random() * 50;
        const avgBlockTime = 1 + Math.random() * 20;
        const totalValue = volume * (0.8 + Math.random() * 0.4);
        const mevOpportunities = 100 + Math.random() * 900;
        const crossChainFlows = 50 + Math.random() * 450;
        const efficiency = 60 + Math.random() * 40;
        const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
        const change = (Math.random() - 0.5) * 30;

        return {
          name: chain.name,
          symbol: chain.symbol,
          volume,
          mevVolume,
          transactionCount,
          avgGasPrice,
          avgBlockTime,
          totalValue,
          mevOpportunities,
          crossChainFlows,
          efficiency,
          trend,
          change,
        };
      });

      // Generate cross-chain flows
      const mockFlows: CrossChainFlow[] = [];
      for (let i = 0; i < 20; i++) {
        const fromChain = chainNames[Math.floor(Math.random() * chainNames.length)].name;
        let toChain = chainNames[Math.floor(Math.random() * chainNames.length)].name;
        while (toChain === fromChain) {
          toChain = chainNames[Math.floor(Math.random() * chainNames.length)].name;
        }

        mockFlows.push({
          fromChain,
          toChain,
          volume: 10000 + Math.random() * 100000,
          opportunities: 10 + Math.random() * 90,
          avgProfit: 50 + Math.random() * 450,
          bridge: bridges[Math.floor(Math.random() * bridges.length)],
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        });
      }

      // Calculate metrics
      const totalVolume = mockChains.reduce((sum, chain) => sum + chain.volume, 0);
      const totalMEV = mockChains.reduce((sum, chain) => sum + chain.mevVolume, 0);
      const totalFlows = mockChains.reduce((sum, chain) => sum + chain.crossChainFlows, 0);
      const avgEfficiency = mockChains.reduce((sum, chain) => sum + chain.efficiency, 0) / mockChains.length;
      const bestChain = mockChains.reduce((best, chain) => 
        chain.efficiency > best.efficiency ? chain : best
      ).name;

      setChains(mockChains);
      setFlows(mockFlows);
      setMetrics({
        totalChains: mockChains.length,
        totalVolume,
        totalMEV,
        totalFlows,
        avgEfficiency,
        bestChain,
      });
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateMockData();
  }, [selectedTimeframe]);

  const volumeChartData = {
    labels: chains.map(chain => chain.name),
    datasets: [
      {
        label: 'Total Volume (USD)',
        data: chains.map(chain => chain.volume),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
      },
    ],
  };

  const mevVolumeChartData = {
    labels: chains.map(chain => chain.name),
    datasets: [
      {
        label: 'MEV Volume (USD)',
        data: chains.map(chain => chain.mevVolume),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const efficiencyChartData = {
    labels: chains.map(chain => chain.name),
    datasets: [
      {
        label: 'Efficiency (%)',
        data: chains.map(chain => chain.efficiency),
        backgroundColor: chains.map(chain => {
          if (chain.efficiency >= 80) return 'rgba(34, 197, 94, 0.8)';
          if (chain.efficiency >= 60) return 'rgba(245, 158, 11, 0.8)';
          return 'rgba(239, 68, 68, 0.8)';
        }),
      },
    ],
  };

  const flowVolumeData = {
    labels: flows.slice(0, 10).map(flow => `${flow.fromChain} → ${flow.toChain}`),
    datasets: [
      {
        label: 'Flow Volume (USD)',
        data: flows.slice(0, 10).map(flow => flow.volume),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Cross-Chain MEV Monitor</h1>
          <p className="text-gray-600">Multi-chain analysis and cross-chain opportunity tracking</p>
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
              <p className="text-sm font-medium text-gray-600">Total Chains</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalChains}</p>
            </div>
            <Globe className="w-8 h-8 text-primary-600" />
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
            <DollarSign className="w-8 h-8 text-green-600" />
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
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cross-Chain Flows</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalFlows}</p>
            </div>
            <Network className="w-8 h-8 text-blue-600" />
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
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Chain</p>
              <p className="text-2xl font-bold text-green-600">{metrics.bestChain}</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chain Volume Comparison</h3>
          <Bar data={volumeChartData} options={{
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
                  text: 'Volume (USD)'
                }
              }
            }
          }} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MEV Volume by Chain</h3>
          <Line data={mevVolumeChartData} options={{
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
                  text: 'MEV Volume (USD)'
                }
              }
            }
          }} />
        </div>
      </div>

      {/* Efficiency and Flows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chain Efficiency</h3>
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
                  text: 'Efficiency (%)'
                }
              }
            }
          }} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cross-Chain Flows</h3>
          <Bar data={flowVolumeData} options={{
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
                  text: 'Flow Volume (USD)'
                }
              }
            }
          }} />
        </div>
      </div>

      {/* Chain Performance Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chain Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEV Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gas Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEV Opportunities</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cross-Chain Flows</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chains.map((chain, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{chain.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({chain.symbol})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(chain.volume / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm mev-loss">
                    ${(chain.mevVolume / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chain.transactionCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chain.avgGasPrice.toFixed(1)} Gwei
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chain.avgBlockTime.toFixed(1)}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chain.mevOpportunities.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chain.crossChainFlows.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {chain.efficiency.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            chain.efficiency >= 80 ? 'bg-green-600' : 
                            chain.efficiency >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${chain.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(chain.trend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getChangeColor(chain.change)}`}>
                      {chain.change > 0 ? '+' : ''}{chain.change.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Chain Flows Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Cross-Chain Flows</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunities</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bridge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flows.slice(0, 10).map((flow, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{flow.fromChain}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{flow.toChain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(flow.volume / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flow.opportunities}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm mev-profit">
                    ${flow.avgProfit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {flow.bridge}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flow.timestamp.toLocaleTimeString()}
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

export default CrossChainMEVMonitor;


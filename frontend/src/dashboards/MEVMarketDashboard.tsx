import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Globe,
  Clock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

interface MarketData {
  totalVolume: number;
  totalProfit: number;
  avgProfit: number;
  successRate: number;
  transactionCount: number;
  activeSearchers: number;
}

interface ProtocolData {
  name: string;
  volume: number;
  profit: number;
  transactions: number;
  marketShare: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface TimeSeriesData {
  timestamp: Date;
  volume: number;
  profit: number;
  transactions: number;
}

const MEVMarketDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    totalVolume: 0,
    totalProfit: 0,
    avgProfit: 0,
    successRate: 0,
    transactionCount: 0,
    activeSearchers: 0,
  });
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(false);

  // Chart cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any existing charts when component unmounts
      const charts = ChartJS.getChart('market-share-chart');
      if (charts) {
        charts.destroy();
      }
    };
  }, []);

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  const generateMockData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate market data
      const mockMarketData: MarketData = {
        totalVolume: 1250000 + Math.random() * 500000,
        totalProfit: 85000 + Math.random() * 25000,
        avgProfit: 125 + Math.random() * 50,
        successRate: 78 + Math.random() * 15,
        transactionCount: 12500 + Math.random() * 5000,
        activeSearchers: 45 + Math.random() * 20,
      };

      // Generate protocol data
      const protocolNames = ['Uniswap', 'SushiSwap', 'PancakeSwap', 'Curve', 'Balancer', '1inch'];
      const mockProtocols: ProtocolData[] = protocolNames.map((name, index) => {
        const volume = 100000 + Math.random() * 300000;
        const profit = 5000 + Math.random() * 15000;
        const transactions = 1000 + Math.random() * 3000;
        const marketShare = (volume / mockMarketData.totalVolume) * 100;
        const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
        const change = (Math.random() - 0.5) * 20;

        return {
          name,
          volume,
          profit,
          transactions,
          marketShare,
          trend,
          change,
        };
      });

      // Generate time series data
      const now = new Date();
      const mockTimeSeries: TimeSeriesData[] = [];
      const hours = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '7d' ? 168 : 720;

      for (let i = hours - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseVolume = 50000 + Math.sin(i / 10) * 20000;
        const baseProfit = 3000 + Math.sin(i / 8) * 1500;
        const baseTransactions = 500 + Math.sin(i / 12) * 200;

        mockTimeSeries.push({
          timestamp,
          volume: baseVolume + Math.random() * 10000,
          profit: baseProfit + Math.random() * 1000,
          transactions: baseTransactions + Math.random() * 100,
        });
      }

      setMarketData(mockMarketData);
      setProtocols(mockProtocols);
      setTimeSeriesData(mockTimeSeries);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateMockData();
  }, [selectedTimeframe]);

  const volumeChartData = {
    labels: timeSeriesData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Volume (USD)',
        data: timeSeriesData.map(d => d.volume),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const profitChartData = {
    labels: timeSeriesData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Profit (USD)',
        data: timeSeriesData.map(d => d.profit),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const marketShareData = {
    labels: protocols.map(p => p.name),
    datasets: [
      {
        data: protocols.map(p => p.marketShare),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)',
        ],
      },
    ],
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
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
          <h1 className="text-3xl font-bold text-gray-900">MEV Market Dashboard</h1>
          <p className="text-gray-600">Track MEV trends and market conditions across different protocols</p>
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

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(marketData.totalVolume / 1000000).toFixed(2)}M
              </p>
              <p className="text-sm text-green-600 mt-1">+12.5% from last period</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold mev-profit">
                ${(marketData.totalProfit / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-green-600 mt-1">+8.3% from last period</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit</p>
              <p className="text-2xl font-bold text-gray-900">
                ${marketData.avgProfit.toFixed(2)}
              </p>
              <p className="text-sm text-green-600 mt-1">+5.2% from last period</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {marketData.successRate.toFixed(1)}%
              </p>
              <p className="text-sm text-green-600 mt-1">+2.1% from last period</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {marketData.transactionCount.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">+15.7% from last period</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Searchers</p>
              <p className="text-2xl font-bold text-gray-900">
                {marketData.activeSearchers}
              </p>
              <p className="text-sm text-green-600 mt-1">+3.2% from last period</p>
            </div>
            <Globe className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Trend</h3>
          <Line data={volumeChartData} options={{
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Trend</h3>
          <Line data={profitChartData} options={{
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
      </div>

      {/* Market Share */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Market Share</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Doughnut 
              id="market-share-chart"
              data={marketShareData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} 
            />
          </div>
          <div className="space-y-4">
            {protocols.map((protocol, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{
                    backgroundColor: marketShareData.datasets[0].backgroundColor[index]
                  }} />
                  <div>
                    <p className="font-medium text-gray-900">{protocol.name}</p>
                    <p className="text-sm text-gray-600">
                      {protocol.transactions.toLocaleString()} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(protocol.volume / 1000).toFixed(1)}K
                  </p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(protocol.trend)}
                    <span className={`text-sm font-medium ${getChangeColor(protocol.change)}`}>
                      {protocol.change > 0 ? '+' : ''}{protocol.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Performance Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {protocols.map((protocol, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{
                        backgroundColor: marketShareData.datasets[0].backgroundColor[index]
                      }} />
                      <span className="font-medium text-gray-900">{protocol.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(protocol.volume / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm mev-profit">
                    ${(protocol.profit / 1000).toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {protocol.transactions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {protocol.marketShare.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(protocol.trend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getChangeColor(protocol.change)}`}>
                      {protocol.change > 0 ? '+' : ''}{protocol.change.toFixed(1)}%
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

export default MEVMarketDashboard;


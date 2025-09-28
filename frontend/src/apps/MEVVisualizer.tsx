import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Filter, 
  Play, 
  Pause, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  Hash
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
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

interface MEVTransaction {
  id: string;
  hash: string;
  type: 'arbitrage' | 'sandwich' | 'frontrun' | 'backrun' | 'liquidation';
  profit: number;
  gasUsed: number;
  gasPrice: number;
  timestamp: Date;
  chain: string;
  protocol: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
}

const MEVVisualizer: React.FC = () => {
  const [transactions, setTransactions] = useState<MEVTransaction[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    chain: 'all',
    minProfit: 0,
    maxProfit: 1000000,
  });
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalProfit: 0,
    avgProfit: 0,
    successRate: 0,
  });

  // Mock data generation
  const generateMockTransaction = (): MEVTransaction => {
    const types: MEVTransaction['type'][] = ['arbitrage', 'sandwich', 'frontrun', 'backrun', 'liquidation'];
    const chains = ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'];
    const protocols = ['Uniswap', 'SushiSwap', 'PancakeSwap', 'Curve'];
    const statuses: MEVTransaction['status'][] = ['success', 'failed', 'pending'];

    return {
      id: Math.random().toString(36).substr(2, 9),
      hash: '0x' + Math.random().toString(36).substr(2, 64),
      type: types[Math.floor(Math.random() * types.length)],
      profit: Math.random() * 10000,
      gasUsed: Math.floor(Math.random() * 500000) + 100000,
      gasPrice: Math.random() * 200 + 20,
      timestamp: new Date(),
      chain: chains[Math.floor(Math.random() * chains.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      description: `${types[Math.floor(Math.random() * types.length)]} opportunity on ${protocols[Math.floor(Math.random() * protocols.length)]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  };

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newTransaction = generateMockTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    // Calculate stats
    const filtered = transactions.filter(tx => {
      if (filter.type !== 'all' && tx.type !== filter.type) return false;
      if (filter.chain !== 'all' && tx.chain !== filter.chain) return false;
      if (tx.profit < filter.minProfit || tx.profit > filter.maxProfit) return false;
      return true;
    });

    const totalProfit = filtered.reduce((sum, tx) => sum + tx.profit, 0);
    const successCount = filtered.filter(tx => tx.status === 'success').length;

    setStats({
      totalVolume: filtered.length,
      totalProfit,
      avgProfit: filtered.length > 0 ? totalProfit / filtered.length : 0,
      successRate: filtered.length > 0 ? (successCount / filtered.length) * 100 : 0,
    });
  }, [transactions, filter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'arbitrage': return 'text-green-600 bg-green-50';
      case 'sandwich': return 'text-red-600 bg-red-50';
      case 'frontrun': return 'text-yellow-600 bg-yellow-50';
      case 'backrun': return 'text-blue-600 bg-blue-50';
      case 'liquidation': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const chartData = {
    labels: transactions.slice(0, 20).map(tx => new Date(tx.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Profit (ETH)',
        data: transactions.slice(0, 20).map(tx => tx.profit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const typeDistribution = {
    labels: ['Arbitrage', 'Sandwich', 'Frontrun', 'Backrun', 'Liquidation'],
    datasets: [
      {
        label: 'Transaction Count',
        data: [
          transactions.filter(tx => tx.type === 'arbitrage').length,
          transactions.filter(tx => tx.type === 'sandwich').length,
          transactions.filter(tx => tx.type === 'frontrun').length,
          transactions.filter(tx => tx.type === 'backrun').length,
          transactions.filter(tx => tx.type === 'liquidation').length,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MEV Transaction Visualizer</h1>
          <p className="text-gray-600">Real-time visualization of MEV transactions across multiple chains</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
              isLive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isLive ? 'Pause' : 'Live'}</span>
          </button>
          <button
            onClick={() => setTransactions([])}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVolume}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalProfit.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit</p>
              <p className="text-2xl font-bold text-gray-900">${stats.avgProfit.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
            </div>
            <TrendingDown className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="arbitrage">Arbitrage</option>
            <option value="sandwich">Sandwich</option>
            <option value="frontrun">Frontrun</option>
            <option value="backrun">Backrun</option>
            <option value="liquidation">Liquidation</option>
          </select>
          <select
            value={filter.chain}
            onChange={(e) => setFilter(prev => ({ ...prev, chain: e.target.value }))}
            className="input-field"
          >
            <option value="all">All Chains</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Polygon">Polygon</option>
            <option value="BSC">BSC</option>
            <option value="Arbitrum">Arbitrum</option>
          </select>
          <input
            type="number"
            placeholder="Min Profit"
            value={filter.minProfit}
            onChange={(e) => setFilter(prev => ({ ...prev, minProfit: Number(e.target.value) }))}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max Profit"
            value={filter.maxProfit}
            onChange={(e) => setFilter(prev => ({ ...prev, maxProfit: Number(e.target.value) }))}
            className="input-field"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Trend</h3>
          <Line data={chartData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MEV Type Distribution</h3>
          <Bar data={typeDistribution} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }} />
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Transaction Feed</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                      {tx.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{tx.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span>{tx.hash.substring(0, 8)}...</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold mev-profit">+${tx.profit.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{tx.chain} • {tx.protocol}</p>
                <p className="text-xs text-gray-500">Gas: {tx.gasUsed.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MEVVisualizer;



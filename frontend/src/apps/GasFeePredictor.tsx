import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Calendar,
  BarChart3
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
import { Line, Bar } from 'react-chartjs-2';

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

interface GasPrediction {
  timestamp: Date;
  baseFee: number;
  priorityFee: number;
  maxFee: number;
  confidence: number;
  mevImpact: number;
  recommendation: string;
}

interface GasHistory {
  timestamp: Date;
  baseFee: number;
  priorityFee: number;
  maxFee: number;
  blockNumber: number;
  mevTransactions: number;
}

interface MEVImpact {
  type: string;
  impact: number;
  description: string;
  recommendation: string;
}

const GasFeePredictor: React.FC = () => {
  const [predictions, setPredictions] = useState<GasPrediction[]>([]);
  const [history, setHistory] = useState<GasHistory[]>([]);
  const [mevImpacts, setMevImpacts] = useState<MEVImpact[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h'>('6h');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGas, setCurrentGas] = useState({
    baseFee: 25,
    priorityFee: 2,
    maxFee: 30,
  });

  const timeframes = [
    { value: '1h', label: '1 Hour', hours: 1 },
    { value: '6h', label: '6 Hours', hours: 6 },
    { value: '24h', label: '24 Hours', hours: 24 },
  ];

  const generateMockData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate historical data
      const now = new Date();
      const historicalData: GasHistory[] = [];
      const predictionData: GasPrediction[] = [];
      const mevImpactData: MEVImpact[] = [];

      // Historical data (past 24 hours)
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseFee = 20 + Math.random() * 30 + Math.sin(i / 6) * 10;
        const priorityFee = 1 + Math.random() * 5;
        const maxFee = baseFee + priorityFee;
        
        historicalData.push({
          timestamp,
          baseFee: Math.round(baseFee * 100) / 100,
          priorityFee: Math.round(priorityFee * 100) / 100,
          maxFee: Math.round(maxFee * 100) / 100,
          blockNumber: 18000000 + i * 240,
          mevTransactions: Math.floor(Math.random() * 50) + 10,
        });
      }

      // Prediction data (next 6 hours)
      for (let i = 1; i <= 6; i++) {
        const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
        const baseFee = 25 + Math.random() * 20 + Math.sin(i / 3) * 8;
        const priorityFee = 2 + Math.random() * 4;
        const maxFee = baseFee + priorityFee;
        const mevImpact = Math.random() * 15;
        
        predictionData.push({
          timestamp,
          baseFee: Math.round(baseFee * 100) / 100,
          priorityFee: Math.round(priorityFee * 100) / 100,
          maxFee: Math.round(maxFee * 100) / 100,
          confidence: 70 + Math.random() * 25,
          mevImpact: Math.round(mevImpact * 100) / 100,
          recommendation: mevImpact > 10 ? 'Consider delaying transaction' : 'Good time to transact',
        });
      }

      // MEV impact analysis
      mevImpactData.push(
        {
          type: 'Arbitrage Bots',
          impact: 12.5,
          description: 'High arbitrage activity increasing gas competition',
          recommendation: 'Wait for lower activity periods (2-4 AM UTC)'
        },
        {
          type: 'Liquidations',
          impact: 8.2,
          description: 'Moderate liquidation activity in DeFi protocols',
          recommendation: 'Monitor liquidation thresholds before large trades'
        },
        {
          type: 'NFT Mints',
          impact: 5.8,
          description: 'Popular NFT collection launches driving gas up',
          recommendation: 'Avoid peak minting hours (6-8 PM UTC)'
        },
        {
          type: 'DEX Swaps',
          impact: 15.3,
          description: 'High volume DEX trading with sandwich attacks',
          recommendation: 'Use Flashbots or private mempools for large swaps'
        }
      );

      setHistory(historicalData);
      setPredictions(predictionData);
      setMevImpacts(mevImpactData);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateMockData();
  }, [selectedTimeframe]);

  const chartData = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Base Fee (Gwei)',
        data: history.map(h => h.baseFee),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Priority Fee (Gwei)',
        data: history.map(h => h.priorityFee),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Max Fee (Gwei)',
        data: history.map(h => h.maxFee),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const mevImpactChart = {
    labels: mevImpacts.map(impact => impact.type),
    datasets: [
      {
        label: 'MEV Impact (Gwei)',
        data: mevImpacts.map(impact => impact.impact),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('Good time')) return 'text-green-600 bg-green-50';
    if (recommendation.includes('Consider')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-600';
    if (confidence > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gas Fee Predictor</h1>
          <p className="text-gray-600">MEV-aware gas fee estimation and optimization</p>
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

      {/* Current Gas Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Base Fee</p>
              <p className="text-2xl font-bold text-gray-900">{currentGas.baseFee} Gwei</p>
            </div>
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Priority Fee</p>
              <p className="text-2xl font-bold text-gray-900">{currentGas.priorityFee} Gwei</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Max Fee</p>
              <p className="text-2xl font-bold text-gray-900">{currentGas.maxFee} Gwei</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Network Status</p>
              <p className="text-2xl font-bold text-green-600">Normal</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Gas Fee History & Predictions</h3>
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value as '1h' | '6h' | '24h')}
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
        </div>
        
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
              title: {
                display: true,
                text: 'Gas Fee (Gwei)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Time'
              }
            }
          },
        }} />
      </div>

      {/* MEV Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MEV Impact Analysis</h3>
          <Bar data={mevImpactChart} options={{
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
                  text: 'Impact (Gwei)'
                }
              }
            }
          }} />
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MEV Impact Details</h3>
          <div className="space-y-4">
            {mevImpacts.map((impact, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{impact.type}</h4>
                  <span className="text-sm font-medium mev-loss">+{impact.impact} Gwei</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{impact.description}</p>
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600">{impact.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Fee Predictions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEV Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {predictions.map((prediction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(prediction.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prediction.baseFee} Gwei
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prediction.priorityFee} Gwei
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prediction.maxFee} Gwei
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${prediction.mevImpact > 10 ? 'mev-loss' : 'mev-profit'}`}>
                      +{prediction.mevImpact} Gwei
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(prediction.recommendation)}`}>
                      {prediction.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Timing</h4>
            <p className="text-sm text-gray-600">
              Execute transactions during low MEV activity periods (2-4 AM UTC) to minimize gas costs.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">EIP-1559</h4>
            <p className="text-sm text-gray-600">
              Use maxFeePerGas and maxPriorityFeePerGas for better gas estimation and protection.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Monitoring</h4>
            <p className="text-sm text-gray-600">
              Monitor MEV activity and gas trends to optimize transaction timing and costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasFeePredictor;


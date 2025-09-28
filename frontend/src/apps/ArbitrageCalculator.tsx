import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Fuel,
  Percent,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

interface DEXPrice {
  dex: string;
  price: number;
  liquidity: number;
  volume24h: number;
  fee: number;
}

interface ArbitrageOpportunity {
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  priceDifference: number;
  profitPercentage: number;
  estimatedProfit: number;
  gasCost: number;
  netProfit: number;
  minAmount: number;
  maxAmount: number;
  risk: 'low' | 'medium' | 'high';
}

const ArbitrageCalculator: React.FC = () => {
  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [amount, setAmount] = useState<number>(1000);
  const [gasPrice, setGasPrice] = useState<number>(25);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const tokens: Token[] = [
    { symbol: 'ETH', name: 'Ethereum', address: '0x...', decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', address: '0x...', decimals: 6 },
    { symbol: 'USDT', name: 'Tether', address: '0x...', decimals: 6 },
    { symbol: 'DAI', name: 'Dai', address: '0x...', decimals: 18 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x...', decimals: 8 },
    { symbol: 'UNI', name: 'Uniswap', address: '0x...', decimals: 18 },
  ];

  const dexes = ['Uniswap V3', 'SushiSwap', 'PancakeSwap', 'Curve', 'Balancer'];

  // Mock price data generation
  const generateMockPrices = (): DEXPrice[] => {
    const basePrice = Math.random() * 2000 + 1000; // Random base price
    return dexes.map(dex => ({
      dex,
      price: basePrice * (0.95 + Math.random() * 0.1), // ±5% variation
      liquidity: Math.random() * 1000000 + 100000,
      volume24h: Math.random() * 500000 + 50000,
      fee: [0.05, 0.3, 0.25, 0.04, 0.5][dexes.indexOf(dex)] || 0.3,
    }));
  };

  const calculateArbitrageOpportunities = () => {
    if (!tokenA || !tokenB) return;

    setIsCalculating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const prices = generateMockPrices();
      const opportunities: ArbitrageOpportunity[] = [];

      // Generate all possible DEX pairs
      for (let i = 0; i < prices.length; i++) {
        for (let j = 0; j < prices.length; j++) {
          if (i === j) continue;

          const buyPrice = prices[i].price;
          const sellPrice = prices[j].price;
          const priceDifference = sellPrice - buyPrice;
          const profitPercentage = (priceDifference / buyPrice) * 100;

          if (profitPercentage > 0.1) { // Only show opportunities with >0.1% profit
            const estimatedProfit = (amount * profitPercentage) / 100;
            const gasCost = gasPrice * 0.0001; // Simplified gas calculation
            const netProfit = estimatedProfit - gasCost;

            // Calculate slippage impact
            const slippageCost = (amount * slippage) / 100;
            const adjustedNetProfit = netProfit - slippageCost;

            opportunities.push({
              buyDex: prices[i].dex,
              sellDex: prices[j].dex,
              buyPrice,
              sellPrice,
              priceDifference,
              profitPercentage,
              estimatedProfit,
              gasCost,
              netProfit: adjustedNetProfit,
              minAmount: Math.min(prices[i].liquidity * 0.01, prices[j].liquidity * 0.01),
              maxAmount: Math.min(prices[i].liquidity * 0.1, prices[j].liquidity * 0.1),
              risk: adjustedNetProfit > 50 ? 'low' : adjustedNetProfit > 10 ? 'medium' : 'high',
            });
          }
        }
      }

      // Sort by net profit
      opportunities.sort((a, b) => b.netProfit - a.netProfit);
      setOpportunities(opportunities);
      setIsCalculating(false);
    }, 1000);
  };

  useEffect(() => {
    if (tokenA && tokenB) {
      calculateArbitrageOpportunities();
    }
  }, [tokenA, tokenB, amount, gasPrice, slippage]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const chartData = {
    labels: opportunities.slice(0, 10).map(opp => `${opp.buyDex} → ${opp.sellDex}`),
    datasets: [
      {
        label: 'Net Profit ($)',
        data: opportunities.slice(0, 10).map(opp => opp.netProfit),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Arbitrage Opportunity Calculator</h1>
          <p className="text-gray-600">Educational tool for understanding and calculating arbitrage opportunities</p>
        </div>
        <button
          onClick={calculateArbitrageOpportunities}
          disabled={!tokenA || !tokenB || isCalculating}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
          <span>{isCalculating ? 'Calculating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Selection</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token A</label>
              <select
                value={tokenA?.symbol || ''}
                onChange={(e) => setTokenA(tokens.find(t => t.symbol === e.target.value) || null)}
                className="input-field"
              >
                <option value="">Select Token A</option>
                {tokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token B</label>
              <select
                value={tokenB?.symbol || ''}
                onChange={(e) => setTokenB(tokens.find(t => t.symbol === e.target.value) || null)}
                className="input-field"
              >
                <option value="">Select Token B</option>
                {tokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="input-field"
                placeholder="Enter amount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gas Price (Gwei)</label>
                <input
                  type="number"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(Number(e.target.value))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slippage (%)</label>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(Number(e.target.value))}
                  className="input-field"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {opportunities.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Best Profit</p>
                  <p className="text-2xl font-bold mev-profit">${opportunities[0]?.netProfit.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Gas Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${(opportunities.reduce((sum, opp) => sum + opp.gasCost, 0) / opportunities.length).toFixed(2)}</p>
                </div>
                <Fuel className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{(opportunities.filter(opp => opp.netProfit > 0).length / opportunities.length * 100).toFixed(1)}%</p>
                </div>
                <Percent className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Opportunities</h3>
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

          {/* Opportunities Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Arbitrage Opportunities</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {opportunities.map((opp, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{opp.buyDex}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{opp.sellDex}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${opp.buyPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${opp.sellPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${opp.profitPercentage > 1 ? 'mev-profit' : 'mev-warning'}`}>
                          +{opp.profitPercentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${opp.netProfit > 0 ? 'mev-profit' : 'mev-loss'}`}>
                          {opp.netProfit > 0 ? '+' : ''}${opp.netProfit.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(opp.risk)}`}>
                          {opp.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${opp.maxAmount.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Educational Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Arbitrage Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Price Discovery</h4>
            <p className="text-sm text-gray-600">
              Different DEXs may have slightly different prices for the same token pair due to market inefficiencies.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Execute Trades</h4>
            <p className="text-sm text-gray-600">
              Buy the token at the lower price on one DEX and immediately sell it at the higher price on another DEX.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Profit Extraction</h4>
            <p className="text-sm text-gray-600">
              The difference between buy and sell prices, minus gas costs and slippage, becomes your profit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitrageCalculator;


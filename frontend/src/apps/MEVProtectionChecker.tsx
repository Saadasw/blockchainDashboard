import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Zap,
  Clock,
  DollarSign,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

interface TransactionAnalysis {
  vulnerability: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
  estimatedLoss: number;
  protectionMethods: ProtectionMethod[];
}

interface ProtectionMethod {
  name: string;
  description: string;
  effectiveness: number;
  cost: number;
  implementation: string;
  pros: string[];
  cons: string[];
}

const MEVProtectionChecker: React.FC = () => {
  const [transactionData, setTransactionData] = useState({
    to: '',
    data: '',
    value: '',
    gasLimit: '',
    gasPrice: '',
    maxFeePerGas: '',
    maxPriorityFeePerGas: '',
    nonce: '',
  });
  const [analysis, setAnalysis] = useState<TransactionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const protectionMethods: ProtectionMethod[] = [
    {
      name: 'Flashbots Bundle',
      description: 'Submit transactions through Flashbots to avoid front-running',
      effectiveness: 95,
      cost: 0.1,
      implementation: 'Use Flashbots RPC endpoint and bundle transactions',
      pros: ['High protection against front-running', 'No additional gas costs', 'Widely adopted'],
      cons: ['Requires technical setup', 'Not available on all chains', 'May delay transaction']
    },
    {
      name: 'Private Mempool',
      description: 'Use a private mempool service to keep transactions hidden',
      effectiveness: 90,
      cost: 0.05,
      implementation: 'Connect to private mempool RPC endpoint',
      pros: ['High privacy', 'Fast execution', 'Available on multiple chains'],
      cons: ['Additional cost', 'Requires trusted service', 'Limited availability']
    },
    {
      name: 'Time Boost',
      description: 'Increase gas price to prioritize transaction execution',
      effectiveness: 70,
      cost: 0.2,
      implementation: 'Set higher maxFeePerGas and maxPriorityFeePerGas',
      pros: ['Simple to implement', 'Immediate effect', 'Works on all chains'],
      cons: ['Higher gas costs', 'Not always effective', 'Can be outbid']
    },
    {
      name: 'Slippage Protection',
      description: 'Set appropriate slippage tolerance to avoid sandwich attacks',
      effectiveness: 80,
      cost: 0,
      implementation: 'Set slippage to 0.5% or lower for stable pairs',
      pros: ['No additional cost', 'Easy to implement', 'Effective for DEX trades'],
      cons: ['May cause failed transactions', 'Not effective for all MEV types', 'Requires careful tuning']
    },
    {
      name: 'MEV-Share',
      description: 'Share MEV with validators to reduce extraction incentives',
      effectiveness: 85,
      cost: 0.15,
      implementation: 'Use MEV-Share protocol for transaction submission',
      pros: ['Reduces MEV extraction', 'Fair distribution', 'Community-driven'],
      cons: ['Newer protocol', 'Limited adoption', 'Requires specific setup']
    }
  ];

  const analyzeTransaction = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const riskFactors: string[] = [];
      const recommendations: string[] = [];
      let vulnerability: 'low' | 'medium' | 'high' = 'low';
      let estimatedLoss = 0;

      // Analyze transaction data
      if (transactionData.value && parseFloat(transactionData.value) > 10000) {
        riskFactors.push('High transaction value increases MEV attractiveness');
        vulnerability = 'medium';
        estimatedLoss += 50;
      }

      if (transactionData.data && transactionData.data.length > 100) {
        riskFactors.push('Complex transaction data may indicate DEX interaction');
        vulnerability = 'high';
        estimatedLoss += 100;
      }

      if (transactionData.gasPrice && parseFloat(transactionData.gasPrice) < 20) {
        riskFactors.push('Low gas price makes transaction vulnerable to front-running');
        vulnerability = 'high';
        estimatedLoss += 75;
      }

      if (!transactionData.maxFeePerGas || !transactionData.maxPriorityFeePerGas) {
        riskFactors.push('Missing EIP-1559 gas parameters');
        recommendations.push('Use EIP-1559 gas parameters for better protection');
      }

      // Generate recommendations based on vulnerability level
      if (vulnerability === 'high') {
        recommendations.push('Consider using Flashbots bundle for maximum protection');
        recommendations.push('Increase gas price to prioritize execution');
        recommendations.push('Use private mempool if available');
      } else if (vulnerability === 'medium') {
        recommendations.push('Set appropriate slippage tolerance');
        recommendations.push('Consider time boost for important transactions');
        recommendations.push('Monitor mempool for similar transactions');
      } else {
        recommendations.push('Transaction appears safe, but monitor for unusual activity');
        recommendations.push('Consider basic protection methods for peace of mind');
      }

      // Select relevant protection methods
      const relevantMethods = protectionMethods.filter(method => {
        if (vulnerability === 'high') return method.effectiveness > 80;
        if (vulnerability === 'medium') return method.effectiveness > 70;
        return method.effectiveness > 50;
      });

      setAnalysis({
        vulnerability,
        riskFactors,
        recommendations,
        estimatedLoss,
        protectionMethods: relevantMethods
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getVulnerabilityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MEV Protection Checker</h1>
          <p className="text-gray-600">Check your transactions for MEV vulnerability and get protection recommendations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>Educational tool - not financial advice</span>
        </div>
      </div>

      {/* Transaction Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Address</label>
              <input
                type="text"
                value={transactionData.to}
                onChange={(e) => setTransactionData(prev => ({ ...prev, to: e.target.value }))}
                className="input-field"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value (ETH)</label>
              <input
                type="number"
                value={transactionData.value}
                onChange={(e) => setTransactionData(prev => ({ ...prev, value: e.target.value }))}
                className="input-field"
                placeholder="0.0"
                step="0.001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Data (Hex)</label>
              <textarea
                value={transactionData.data}
                onChange={(e) => setTransactionData(prev => ({ ...prev, data: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="0x..."
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gas Parameters</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gas Limit</label>
                <input
                  type="number"
                  value={transactionData.gasLimit}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, gasLimit: e.target.value }))}
                  className="input-field"
                  placeholder="21000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gas Price (Gwei)</label>
                <input
                  type="number"
                  value={transactionData.gasPrice}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, gasPrice: e.target.value }))}
                  className="input-field"
                  placeholder="20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Fee Per Gas (Gwei)</label>
                <input
                  type="number"
                  value={transactionData.maxFeePerGas}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, maxFeePerGas: e.target.value }))}
                  className="input-field"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Priority Fee (Gwei)</label>
                <input
                  type="number"
                  value={transactionData.maxPriorityFeePerGas}
                  onChange={(e) => setTransactionData(prev => ({ ...prev, maxPriorityFeePerGas: e.target.value }))}
                  className="input-field"
                  placeholder="2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nonce</label>
              <input
                type="number"
                value={transactionData.nonce}
                onChange={(e) => setTransactionData(prev => ({ ...prev, nonce: e.target.value }))}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={analyzeTransaction}
          disabled={isAnalyzing || !transactionData.to}
          className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
        >
          <Shield className="w-5 h-5" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Transaction'}</span>
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Vulnerability Summary */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vulnerability Analysis</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVulnerabilityColor(analysis.vulnerability)}`}>
                {analysis.vulnerability.toUpperCase()} RISK
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-sm text-gray-600">Estimated Potential Loss</p>
                <p className="text-2xl font-bold mev-loss">${analysis.estimatedLoss}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600">Risk Factors</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.riskFactors.length}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Protection Methods</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.protectionMethods.length}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          {analysis.riskFactors.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
              <div className="space-y-3">
                {analysis.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-800">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Protection Methods */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Protection Methods</h3>
            <div className="space-y-4">
              {analysis.protectionMethods.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{method.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-600">Effectiveness:</span>
                        <span className="text-sm font-medium text-green-600">{method.effectiveness}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Cost:</span>
                        <span className="text-sm font-medium text-yellow-600">${method.cost}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Implementation</h5>
                      <p className="text-sm text-gray-600">{method.implementation}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Pros & Cons</h5>
                      <div className="space-y-1">
                        {method.pros.slice(0, 2).map((pro, i) => (
                          <div key={i} className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-gray-600">{pro}</span>
                          </div>
                        ))}
                        {method.cons.slice(0, 2).map((con, i) => (
                          <div key={i} className="flex items-center space-x-1">
                            <XCircle className="w-3 h-3 text-red-600" />
                            <span className="text-xs text-gray-600">{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => copyToClipboard(method.implementation)}
                      className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Implementation</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700">
                      <ExternalLink className="w-4 h-4" />
                      <span>Learn More</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding MEV Protection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">MEV Threats</h4>
            <p className="text-sm text-gray-600">
              Front-running, sandwich attacks, and arbitrage bots can extract value from your transactions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Protection Methods</h4>
            <p className="text-sm text-gray-600">
              Use specialized tools and techniques to minimize MEV exposure and protect your transactions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
            <p className="text-sm text-gray-600">
              Combine multiple protection methods and stay informed about new MEV mitigation techniques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MEVProtectionChecker;



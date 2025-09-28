import express from 'express';

const router = express.Router();

// Analyze transaction for MEV vulnerability
router.post('/analyze', (req, res) => {
  const { to, data, value, gasLimit, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce } = req.body;
  
  // Mock analysis
  const riskFactors = [];
  const recommendations = [];
  let vulnerability = 'low';
  let estimatedLoss = 0;

  if (value && parseFloat(value) > 10000) {
    riskFactors.push('High transaction value increases MEV attractiveness');
    vulnerability = 'medium';
    estimatedLoss += 50;
  }

  if (data && data.length > 100) {
    riskFactors.push('Complex transaction data may indicate DEX interaction');
    vulnerability = 'high';
    estimatedLoss += 100;
  }

  if (gasPrice && parseFloat(gasPrice) < 20) {
    riskFactors.push('Low gas price makes transaction vulnerable to front-running');
    vulnerability = 'high';
    estimatedLoss += 75;
  }

  if (!maxFeePerGas || !maxPriorityFeePerGas) {
    riskFactors.push('Missing EIP-1559 gas parameters');
    recommendations.push('Use EIP-1559 gas parameters for better protection');
  }

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

  const protectionMethods = [
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
    }
  ];

  const analysis = {
    vulnerability,
    riskFactors,
    recommendations,
    estimatedLoss,
    protectionMethods: protectionMethods.filter(method => {
      if (vulnerability === 'high') return method.effectiveness > 80;
      if (vulnerability === 'medium') return method.effectiveness > 70;
      return method.effectiveness > 50;
    })
  };

  res.json({
    success: true,
    data: analysis,
  });
});

export default router;



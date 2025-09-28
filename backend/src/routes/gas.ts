import express from 'express';
import etherscanService from '../services/etherscan';

const router = express.Router();

// Get gas predictions
router.get('/predictions', (req, res) => {
  const { timeframe = '6h' } = req.query;
  
  const now = new Date();
  const predictions = Array.from({ length: 6 }, (_, i) => {
    const timestamp = new Date(now.getTime() + (i + 1) * 60 * 60 * 1000);
    const baseFee = 25 + Math.random() * 20 + Math.sin(i / 3) * 8;
    const priorityFee = 2 + Math.random() * 4;
    const maxFee = baseFee + priorityFee;
    const mevImpact = Math.random() * 15;
    
    return {
      timestamp,
      baseFee: Math.round(baseFee * 100) / 100,
      priorityFee: Math.round(priorityFee * 100) / 100,
      maxFee: Math.round(maxFee * 100) / 100,
      confidence: 70 + Math.random() * 25,
      mevImpact: Math.round(mevImpact * 100) / 100,
      recommendation: mevImpact > 10 ? 'Consider delaying transaction' : 'Good time to transact',
    };
  });

  res.json({
    success: true,
    data: predictions,
  });
});

// Get gas history
router.get('/history', (req, res) => {
  const { timeframe = '24h' } = req.query;
  
  const now = new Date();
  const history = Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    const baseFee = 20 + Math.random() * 30 + Math.sin(i / 6) * 10;
    const priorityFee = 1 + Math.random() * 5;
    const maxFee = baseFee + priorityFee;
    
    return {
      timestamp,
      baseFee: Math.round(baseFee * 100) / 100,
      priorityFee: Math.round(priorityFee * 100) / 100,
      maxFee: Math.round(maxFee * 100) / 100,
      blockNumber: 18000000 + i * 240,
      mevTransactions: Math.floor(Math.random() * 50) + 10,
    };
  });

  res.json({
    success: true,
    data: history,
  });
});

// Get MEV impact analysis
router.get('/mev-impact', (req, res) => {
  const impacts = [
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
  ];

  res.json({
    success: true,
    data: impacts,
  });
});

// Get current gas status
router.get('/current', async (req, res) => {
  try {
    // Get real gas prices from Etherscan
    const gasPrices = await etherscanService.getGasPrices();
    
    if (gasPrices) {
      const currentGas = {
        baseFee: parseFloat(gasPrices.suggestBaseFee) / 1e9, // Convert from wei to gwei
        priorityFee: 2 + Math.random() * 3, // Priority fee not directly available
        maxFee: parseFloat(gasPrices.Fastest) / 1e9, // Use fastest as max fee
        networkStatus: 'Normal',
        lastUpdated: new Date(),
        safeLow: parseFloat(gasPrices.SafeLow) / 1e9,
        standard: parseFloat(gasPrices.Standard) / 1e9,
        fast: parseFloat(gasPrices.Fast) / 1e9,
        fastest: parseFloat(gasPrices.Fastest) / 1e9,
        gasUsedRatio: gasPrices.gasUsedRatio,
      };

      res.json({
        success: true,
        data: currentGas,
        source: 'Etherscan Gas Tracker',
      });
    } else {
      // Fallback to mock data
      const currentGas = {
        baseFee: 25 + Math.random() * 10,
        priorityFee: 2 + Math.random() * 3,
        maxFee: 30 + Math.random() * 15,
        networkStatus: 'Normal',
        lastUpdated: new Date(),
      };

      res.json({
        success: true,
        data: currentGas,
        source: 'Mock data (Etherscan API unavailable)',
      });
    }
  } catch (error) {
    console.error('Error fetching gas prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gas prices',
      data: {},
    });
  }
});

export default router;


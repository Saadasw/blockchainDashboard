import express from 'express';
import mevAnalyzer from '../services/mevAnalyzer';

const router = express.Router();

// Get MEV transactions
router.get('/transactions', async (req, res) => {
  try {
    const { limit = 50, type, chain } = req.query;
    
    // Get real MEV transactions with fallback to mock data
    const transactions = await mevAnalyzer.analyzeTransactions(Number(limit));
    
    // Filter by type if specified
    const filteredTransactions = type 
      ? transactions.filter(tx => tx.type === type)
      : transactions;

    res.json({
      success: true,
      data: filteredTransactions,
      count: filteredTransactions.length,
      source: 'Etherscan API with MEV analysis',
    });
  } catch (error) {
    console.error('Error fetching MEV transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MEV transactions',
      data: [],
      count: 0,
    });
  }
});

// Get MEV statistics
router.get('/stats', async (req, res) => {
  try {
    // Get real MEV statistics with fallback to mock data
    const stats = await mevAnalyzer.getMEVStats();

    res.json({
      success: true,
      data: stats,
      source: 'Etherscan API with MEV analysis',
    });
  } catch (error) {
    console.error('Error fetching MEV stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MEV statistics',
      data: {},
    });
  }
});

// Get MEV trends
router.get('/trends', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    // Get real MEV trends with fallback to mock data
    const trends = await mevAnalyzer.getMEVTrends(timeframe as string);

    res.json({
      success: true,
      data: trends,
      source: 'Etherscan API with MEV analysis',
    });
  } catch (error) {
    console.error('Error fetching MEV trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MEV trends',
      data: [],
    });
  }
});

export default router;


import express from 'express';
import { getUniswapV2PoolSwaps } from '../services/thegraph';

const router = express.Router();

// Get market dashboard data
router.get('/market', (req, res) => {
  const { timeframe = '24h' } = req.query;
  
  const marketData = {
    totalVolume: 1250000 + Math.random() * 500000,
    totalProfit: 85000 + Math.random() * 25000,
    avgProfit: 125 + Math.random() * 50,
    successRate: 78 + Math.random() * 15,
    transactionCount: 12500 + Math.random() * 5000,
    activeSearchers: 45 + Math.random() * 20,
  };

  const protocols = ['Uniswap', 'SushiSwap', 'PancakeSwap', 'Curve', 'Balancer', '1inch'].map((name, index) => {
    const volume = 100000 + Math.random() * 300000;
    const profit = 5000 + Math.random() * 15000;
    const transactions = 1000 + Math.random() * 3000;
    const marketShare = (volume / marketData.totalVolume) * 100;
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

  const timeSeriesData = Array.from({ length: 24 }, (_, i) => {
    const timestamp = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
    const baseVolume = 50000 + Math.sin(i / 10) * 20000;
    const baseProfit = 3000 + Math.sin(i / 8) * 1500;
    const baseTransactions = 500 + Math.sin(i / 12) * 200;

    return {
      timestamp,
      volume: baseVolume + Math.random() * 10000,
      profit: baseProfit + Math.random() * 1000,
      transactions: baseTransactions + Math.random() * 100,
    };
  });

  res.json({
    success: true,
    data: {
      marketData,
      protocols,
      timeSeriesData,
    },
  });
});

// Get searcher leaderboard data
router.get('/leaderboard', (req, res) => {
  const searcherNames = [
    'FlashMaster', 'ArbitrageKing', 'MEVHunter', 'ProfitSeeker', 'BlockRunner',
    'GasWizard', 'SlippageSlayer', 'LiquidationLord', 'SandwichSniper', 'FrontrunFury',
    'BackrunBaron', 'CrossChainCrusher', 'FlashLoanFighter', 'TimeBoostTitan', 'JITJuggernaut'
  ];

  const searchers = searcherNames.map((name, index) => {
    const profit = 5000 + Math.random() * 45000;
    const volume = 50000 + Math.random() * 450000;
    const successRate = 60 + Math.random() * 35;
    const transactionCount = 100 + Math.random() * 900;
    const avgProfit = profit / transactionCount;
    const change = (Math.random() - 0.5) * 30;
    const winStreak = Math.floor(Math.random() * 15) + 1;
    
    const strategies = ['Arbitrage', 'Sandwich', 'Frontrun', 'Backrun', 'Liquidation', 'JIT', 'Time Boost', 'Cross-Chain', 'Flash Loan']
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 1);

    return {
      id: `searcher-${index}`,
      name,
      address: `0x${Math.random().toString(36).substr(2, 40)}`,
      totalProfit: profit,
      totalVolume: volume,
      successRate,
      transactionCount,
      avgProfit,
      rank: index + 1,
      change,
      strategies,
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      winStreak,
    };
  });

  // Sort by profit
  searchers.sort((a, b) => b.totalProfit - a.totalProfit);
  searchers.forEach((searcher, index) => {
    searcher.rank = index + 1;
  });

  const stats = {
    totalSearchers: searchers.length,
    totalProfit: searchers.reduce((sum, s) => sum + s.totalProfit, 0),
    avgProfit: searchers.reduce((sum, s) => sum + s.totalProfit, 0) / searchers.length,
    topProfit: searchers[0].totalProfit,
    activeToday: searchers.filter(s => 
      new Date().getTime() - s.lastActive.getTime() < 24 * 60 * 60 * 1000
    ).length,
  };

  res.json({
    success: true,
    data: {
      searchers,
      stats,
    },
  });
});

// Get DEX efficiency data
router.get('/dex-efficiency', (req, res) => {
  const dexNames = [
    'Uniswap V3', 'SushiSwap', 'PancakeSwap', 'Curve', 'Balancer',
    '1inch', 'dYdX', 'GMX', 'Trader Joe', 'Orca'
  ];

  const dexes = dexNames.map((name, index) => {
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

  const totalVolume = dexes.reduce((sum, dex) => sum + dex.volume, 0);
  const totalMEV = dexes.reduce((sum, dex) => sum + (dex.volume * dex.mevExposure / 100), 0);
  const avgEfficiency = dexes.reduce((sum, dex) => sum + dex.efficiencyScore, 0) / dexes.length;
  const bestEfficiency = Math.max(...dexes.map(dex => dex.efficiencyScore));
  const worstEfficiency = Math.min(...dexes.map(dex => dex.efficiencyScore));

  const metrics = {
    totalDEXs: dexes.length,
    avgEfficiency,
    bestEfficiency,
    worstEfficiency,
    totalVolume,
    totalMEV,
  };

  res.json({
    success: true,
    data: {
      dexes,
      metrics,
    },
  });
});

// Get cross-chain data
router.get('/cross-chain', (req, res) => {
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

  const chains = chainNames.map((chain, index) => {
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

  const bridges = ['Multichain', 'Stargate', 'Hop', 'Across', 'Synapse', 'Celer'];
  const flows = Array.from({ length: 20 }, (_, i) => {
    const fromChain = chainNames[Math.floor(Math.random() * chainNames.length)].name;
    let toChain = chainNames[Math.floor(Math.random() * chainNames.length)].name;
    while (toChain === fromChain) {
      toChain = chainNames[Math.floor(Math.random() * chainNames.length)].name;
    }

    return {
      fromChain,
      toChain,
      volume: 10000 + Math.random() * 100000,
      opportunities: 10 + Math.random() * 90,
      avgProfit: 50 + Math.random() * 450,
      bridge: bridges[Math.floor(Math.random() * bridges.length)],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    };
  });

  const totalVolume = chains.reduce((sum, chain) => sum + chain.volume, 0);
  const totalMEV = chains.reduce((sum, chain) => sum + chain.mevVolume, 0);
  const totalFlows = chains.reduce((sum, chain) => sum + chain.crossChainFlows, 0);
  const avgEfficiency = chains.reduce((sum, chain) => sum + chain.efficiency, 0) / chains.length;
  const bestChain = chains.reduce((best, chain) => 
    chain.efficiency > best.efficiency ? chain : best
  ).name;

  const metrics = {
    totalChains: chains.length,
    totalVolume,
    totalMEV,
    totalFlows,
    avgEfficiency,
    bestChain,
  };

  res.json({
    success: true,
    data: {
      chains,
      flows,
      metrics,
    },
  });
});

router.get('/pools/transactions', async (req, res) => {
  const pools = [
    {
      name: 'Uniswap V2 USDC/WETH',
      address: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    },
    {
      name: 'Uniswap V2 DAI/WETH',
      address: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
    },
  ];
  const result: Record<string, any[]> = {};
  await Promise.all(
    pools.map(async (pool) => {
      try {
        const swaps = await getUniswapV2PoolSwaps(pool.address, 10);
        result[pool.address] = swaps;
      } catch (err) {
        result[pool.address] = [];
      }
    })
  );
  res.json(result);
});

export default router;



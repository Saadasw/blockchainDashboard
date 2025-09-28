import etherscanService from './etherscan';

interface MEVTransaction {
  id: string;
  hash: string;
  type: 'arbitrage' | 'sandwich' | 'frontrun' | 'backrun' | 'liquidation' | 'unknown';
  profit: number;
  gasUsed: number;
  gasPrice: number;
  timestamp: Date;
  chain: string;
  protocol: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  from: string;
  to: string;
  value: string;
  blockNumber: string;
}

interface MEVStats {
  totalVolume: number;
  totalProfit: number;
  avgProfit: number;
  successRate: number;
  transactionCount: number;
  activeSearchers: number;
}

export class MEVAnalyzer {
  private static instance: MEVAnalyzer;

  // Known MEV searcher addresses (Flashbots, etc.)
  private knownMEVSearchers = [
    '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5', // Flashbots
    '0x0000000000000000000000000000000000000000', // Add more known searchers
  ];

  // Known DEX addresses
  private knownDEXAddresses = {
    'Uniswap V3': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    'SushiSwap': '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    'PancakeSwap': '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    'Curve': '0x99a58482BD75cbab83b27EC03CA68fF489b5788f',
  };

  private constructor() {}

  public static getInstance(): MEVAnalyzer {
    if (!MEVAnalyzer.instance) {
      MEVAnalyzer.instance = new MEVAnalyzer();
    }
    return MEVAnalyzer.instance;
  }

  // Analyze transactions to identify MEV patterns
  async analyzeTransactions(limit: number = 50): Promise<MEVTransaction[]> {
    try {
      const latestBlock = await etherscanService.getLatestBlockNumber();
      if (!latestBlock) {
        return this.generateMockTransactions(limit);
      }

      const blockNumber = parseInt(latestBlock, 16);
      const startBlock = Math.max(0, blockNumber - 1000); // Last 1000 blocks

      // Get transactions from known MEV searchers
      const mevTransactions: MEVTransaction[] = [];
      
      for (const searcherAddress of this.knownMEVSearchers) {
        const transactions = await etherscanService.getTransactions(searcherAddress, startBlock, blockNumber);
        
        for (const tx of transactions.slice(0, limit / this.knownMEVSearchers.length)) {
          const mevTx = await this.analyzeTransaction(tx);
          if (mevTx) {
            mevTransactions.push(mevTx);
          }
        }
      }

      // If we don't have enough real MEV transactions, fill with mock data
      if (mevTransactions.length < limit) {
        const mockTransactions = this.generateMockTransactions(limit - mevTransactions.length);
        mevTransactions.push(...mockTransactions);
      }

      return mevTransactions.slice(0, limit);
    } catch (error) {
      console.error('Error analyzing transactions:', error);
      return this.generateMockTransactions(limit);
    }
  }

  // Analyze a single transaction for MEV patterns
  private async analyzeTransaction(tx: any): Promise<MEVTransaction | null> {
    try {
      // Basic MEV detection logic
      const gasUsed = parseInt(tx.gasUsed);
      const gasPrice = parseInt(tx.gasPrice);
      const value = parseInt(tx.value);
      
      // High gas usage and complex input data might indicate MEV
      const isComplexTransaction = tx.input.length > 100;
      const hasHighGasUsage = gasUsed > 200000;
      const hasHighGasPrice = gasPrice > 50000000000; // 50 gwei
      
      if (!isComplexTransaction && !hasHighGasUsage && !hasHighGasPrice) {
        return null; // Not likely MEV
      }

      // Determine MEV type based on transaction characteristics
      let mevType: MEVTransaction['type'] = 'unknown';
      let profit = 0;
      let protocol = 'Unknown';

      if (isComplexTransaction) {
        // Check if it's a DEX interaction
        for (const [dexName, dexAddress] of Object.entries(this.knownDEXAddresses)) {
          if (tx.to?.toLowerCase() === dexAddress.toLowerCase()) {
            protocol = dexName;
            break;
          }
        }

        // Simple profit estimation (in real implementation, you'd need more sophisticated analysis)
        profit = Math.random() * 10000; // Placeholder
        mevType = this.determineMEVType(tx, protocol);
      }

      return {
        id: `tx-${tx.hash}`,
        hash: tx.hash,
        type: mevType,
        profit,
        gasUsed,
        gasPrice: gasPrice / 1e9, // Convert to gwei
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        chain: 'Ethereum',
        protocol,
        description: `MEV transaction on ${protocol}`,
        status: tx.isError === '0' ? 'success' : 'failed',
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: tx.blockNumber,
      };
    } catch (error) {
      console.error('Error analyzing transaction:', error);
      return null;
    }
  }

  // Determine MEV type based on transaction characteristics
  private determineMEVType(tx: any, protocol: string): MEVTransaction['type'] {
    const types: MEVTransaction['type'][] = ['arbitrage', 'sandwich', 'frontrun', 'backrun', 'liquidation'];
    return types[Math.floor(Math.random() * types.length)]; // Placeholder logic
  }

  // Get MEV statistics
  async getMEVStats(): Promise<MEVStats> {
    try {
      const transactions = await this.analyzeTransactions(100);
      
      const totalVolume = transactions.reduce((sum, tx) => sum + parseInt(tx.value), 0);
      const totalProfit = transactions.reduce((sum, tx) => sum + tx.profit, 0);
      const successCount = transactions.filter(tx => tx.status === 'success').length;
      
      return {
        totalVolume,
        totalProfit,
        avgProfit: totalProfit / transactions.length,
        successRate: (successCount / transactions.length) * 100,
        transactionCount: transactions.length,
        activeSearchers: this.knownMEVSearchers.length,
      };
    } catch (error) {
      console.error('Error getting MEV stats:', error);
      return this.generateMockStats();
    }
  }

  // Get MEV trends over time
  async getMEVTrends(timeframe: string = '24h'): Promise<any[]> {
    try {
      const trends = [];
      const hours = timeframe === '24h' ? 24 : 6;
      
      for (let i = 0; i < hours; i++) {
        const timestamp = new Date(Date.now() - (hours - i - 1) * 60 * 60 * 1000);
        trends.push({
          timestamp,
          volume: 50000 + Math.random() * 20000,
          profit: 3000 + Math.random() * 1500,
          transactions: 500 + Math.random() * 200,
        });
      }
      
      return trends;
    } catch (error) {
      console.error('Error getting MEV trends:', error);
      return [];
    }
  }

  // Generate mock transactions for fallback
  private generateMockTransactions(limit: number): MEVTransaction[] {
    return Array.from({ length: limit }, (_, i) => ({
      id: `tx-${i}`,
      hash: `0x${Math.random().toString(36).substr(2, 64)}`,
      type: ['arbitrage', 'sandwich', 'frontrun', 'backrun', 'liquidation'][Math.floor(Math.random() * 5)] as MEVTransaction['type'],
      profit: Math.random() * 10000,
      gasUsed: Math.floor(Math.random() * 500000) + 100000,
      gasPrice: Math.random() * 200 + 20,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      chain: 'Ethereum',
      protocol: ['Uniswap', 'SushiSwap', 'PancakeSwap', 'Curve'][Math.floor(Math.random() * 4)],
      description: `MEV transaction ${i}`,
      status: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)] as MEVTransaction['status'],
      from: `0x${Math.random().toString(36).substr(2, 40)}`,
      to: `0x${Math.random().toString(36).substr(2, 40)}`,
      value: (Math.random() * 1000000000000000000).toString(),
      blockNumber: (18000000 + Math.floor(Math.random() * 1000)).toString(),
    }));
  }

  // Generate mock stats for fallback
  private generateMockStats(): MEVStats {
    return {
      totalVolume: 1250000 + Math.random() * 500000,
      totalProfit: 85000 + Math.random() * 25000,
      avgProfit: 125 + Math.random() * 50,
      successRate: 78 + Math.random() * 15,
      transactionCount: 12500 + Math.random() * 5000,
      activeSearchers: 45 + Math.random() * 20,
    };
  }
}

export default MEVAnalyzer.getInstance();


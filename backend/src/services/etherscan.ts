import axios from 'axios';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '6EXCVEPB1KF672UWNDNFH4WAJH1RXV7IFV';
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';

interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  contractAddress: string;
  confirmations: string;
  isError: string;
  txreceipt_status: string;
}

interface GasPrice {
  SafeLow: string;
  Standard: string;
  Fast: string;
  Fastest: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
}

export class EtherscanService {
  private static instance: EtherscanService;

  private constructor() {}

  public static getInstance(): EtherscanService {
    if (!EtherscanService.instance) {
      EtherscanService.instance = new EtherscanService();
    }
    return EtherscanService.instance;
  }

  // Get recent transactions for a specific address (MEV searchers)
  async getTransactions(address: string, startBlock: number = 0, endBlock: number = 99999999): Promise<Transaction[]> {
    try {
      const response = await axios.get<EtherscanResponse<Transaction[]>>(
        `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        console.error('Etherscan API error:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching transactions from Etherscan:', error);
      return [];
    }
  }

  // Get gas prices
  async getGasPrices(): Promise<GasPrice | null> {
    try {
      const response = await axios.get<EtherscanResponse<GasPrice>>(
        `${ETHERSCAN_BASE_URL}?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`
      );

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        console.error('Etherscan API error:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching gas prices from Etherscan:', error);
      return null;
    }
  }

  // Get block information
  async getBlockByNumber(blockNumber: string): Promise<any> {
    try {
      const response = await axios.get<EtherscanResponse<any>>(
        `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${ETHERSCAN_API_KEY}`
      );

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        console.error('Etherscan API error:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching block from Etherscan:', error);
      return null;
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      const response = await axios.get<EtherscanResponse<any>>(
        `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
      );

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        console.error('Etherscan API error:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching transaction receipt from Etherscan:', error);
      return null;
    }
  }

  // Get latest block number
  async getLatestBlockNumber(): Promise<string | null> {
    try {
      const response = await axios.get<EtherscanResponse<string>>(
        `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_blockNumber&apikey=${ETHERSCAN_API_KEY}`
      );

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        console.error('Etherscan API error:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching latest block number from Etherscan:', error);
      return null;
    }
  }

  // Get transactions for a specific block
  async getBlockTransactions(blockNumber: string): Promise<Transaction[]> {
    try {
      const response = await axios.get<EtherscanResponse<Transaction[]>>(
        `${ETHERSCAN_BASE_URL}?module=account&action=txlistinternal&startblock=${blockNumber}&endblock=${blockNumber}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );

      if (response.data.status === '1') {
        return response.data.result;
      } else {
        console.error('Etherscan API error:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching block transactions from Etherscan:', error);
      return [];
    }
  }
}

export default EtherscanService.getInstance();


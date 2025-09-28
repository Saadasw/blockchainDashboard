import axios from 'axios';

const UNISWAP_V2_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

export interface Swap {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  sender: string;
  recipient: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  amountUSD: string;
}

export async function getUniswapV2PoolSwaps(poolAddress: string, limit: number = 10): Promise<Swap[]> {
  const query = `{
    swaps(
      first: ${limit},
      orderBy: timestamp,
      orderDirection: desc,
      where: { pair: \"${poolAddress.toLowerCase()}\" }
    ) {
      id
      transaction { id timestamp }
      sender
      to
      amount0In
      amount1In
      amount0Out
      amount1Out
      amountUSD
      pair { id }
    }
  }`;

  try {
    const response = await axios.post(UNISWAP_V2_SUBGRAPH_URL, { query });
    const swaps = response.data.data.swaps;
    return swaps.map((swap: any) => ({
      txHash: swap.transaction.id,
      blockNumber: 0, // The Graph V2 subgraph does not return blockNumber directly
      timestamp: Number(swap.transaction.timestamp),
      sender: swap.sender,
      recipient: swap.to,
      amount0In: swap.amount0In,
      amount1In: swap.amount1In,
      amount0Out: swap.amount0Out,
      amount1Out: swap.amount1Out,
      amountUSD: swap.amountUSD,
    }));
  } catch (error) {
    console.error('Error fetching swaps from The Graph:', error);
    return [];
  }
}

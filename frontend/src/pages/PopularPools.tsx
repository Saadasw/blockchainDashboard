import React, { useEffect, useState } from 'react';

interface Transaction {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  sender: string;
  recipient: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  gasUsed: string;
  gasPrice: string;
}

interface Pool {
  name: string;
  address: string;
  transactions: Transaction[];
}

const POPULAR_POOLS: Pool[] = [
  {
    name: 'Uniswap V2 USDC/WETH',
    address: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    transactions: [],
  },
  {
    name: 'Uniswap V2 DAI/WETH',
    address: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
    transactions: [],
  },
  // Add more pools as needed
];

const PopularPools: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>(POPULAR_POOLS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        // Replace with actual backend API call
        const response = await fetch('/api/pools/transactions');
        if (response.ok) {
          const data = await response.json();
          setPools((prev) =>
            prev.map((pool) => ({
              ...pool,
              transactions: data[pool.address] || [],
            }))
          );
        } else {
          // fallback: use placeholder data
          setPools((prev) =>
            prev.map((pool) => ({
              ...pool,
              transactions: [],
            }))
          );
        }
      } catch (err) {
        setPools((prev) =>
          prev.map((pool) => ({
            ...pool,
            transactions: [],
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Popular Pool Transactions</h1>
      {loading && <div>Loading...</div>}
      {pools.map((pool) => (
        <div key={pool.address} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{pool.name}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Tx Hash</th>
                  <th className="border px-2 py-1">Block</th>
                  <th className="border px-2 py-1">Timestamp</th>
                  <th className="border px-2 py-1">Sender</th>
                  <th className="border px-2 py-1">Recipient</th>
                  <th className="border px-2 py-1">Amount0 In</th>
                  <th className="border px-2 py-1">Amount1 In</th>
                  <th className="border px-2 py-1">Amount0 Out</th>
                  <th className="border px-2 py-1">Amount1 Out</th>
                  <th className="border px-2 py-1">Gas Used</th>
                  <th className="border px-2 py-1">Gas Price</th>
                </tr>
              </thead>
              <tbody>
                {pool.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="border px-2 py-1 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  pool.transactions.map((tx) => (
                    <tr key={tx.txHash}>
                      <td className="border px-2 py-1">
                        <a
                          href={`https://etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                        </a>
                      </td>
                      <td className="border px-2 py-1">{tx.blockNumber}</td>
                      <td className="border px-2 py-1">{new Date(tx.timestamp * 1000).toLocaleString()}</td>
                      <td className="border px-2 py-1">{tx.sender}</td>
                      <td className="border px-2 py-1">{tx.recipient}</td>
                      <td className="border px-2 py-1">{tx.amount0In}</td>
                      <td className="border px-2 py-1">{tx.amount1In}</td>
                      <td className="border px-2 py-1">{tx.amount0Out}</td>
                      <td className="border px-2 py-1">{tx.amount1Out}</td>
                      <td className="border px-2 py-1">{tx.gasUsed}</td>
                      <td className="border px-2 py-1">{tx.gasPrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularPools;

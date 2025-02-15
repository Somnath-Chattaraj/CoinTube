import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL, MARKETPLACE_CONTRACT_ADDRESS } from '@/config';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Abi, Address } from 'viem';
import { token_abi } from '@/lib/token_lib';
import { marketplace_abi } from '@/lib/marketplace_abi';

export interface Token {
  id: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  price: number;
  creatorAddress: string;
  royaltyRecipientAddress: string;
  royaltyFee: number;
  createdAt: string;
}

export interface Wallet {
  walletAddress: string;
  tokens: {
    token: Token;
    quantity: number;
  }[];
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  wallets: Wallet[];
}

export function Portfolio() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (txHash) {
      useWaitForTransactionReceipt({
        hash: txHash as Address,
        // @ts-ignore
        onSuccess: () => console.log('Transaction Successful:', txHash),
        onError: (error : any) => console.error('Transaction Failed:', error),
      });
    }
  }, [txHash]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await axios.get<UserProfile>(`${BACKEND_URL}/user/getTokens`,{
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSellToken = async (token: Token, quantity: number, price: number) => {
    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    try {
      console.log(`Selling ${quantity} ${token.name} (${token.symbol})`);

      // Approve Marketplace to Spend Tokens
      const approveTx = await writeContractAsync({
        address: token.tokenAddress as Address,
        abi: token_abi as Abi,
        functionName: 'approveMarketplace',
      });
      console.log('Approval Transaction Hash:', approveTx);
      setTxHash(approveTx);

      // Sell Token on Marketplace
      const sellTx = await writeContractAsync({
        address: MARKETPLACE_CONTRACT_ADDRESS as Address,
        abi: marketplace_abi as Abi,
        functionName: 'listTokenForSale',
        args: [token.tokenAddress as Address, quantity, price],
      });
      console.log('Sell Transaction Hash:', sellTx);
      setTxHash(sellTx);
    } catch (error) {
      console.error('Error selling token:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">No user data available.</div>;
  }

  const totalBalance = user.wallets.reduce(
    (sum, wallet) => sum + wallet.tokens.reduce((tSum, t) => tSum + t.quantity * t.token.price, 0),
    0
  );

  const totalCoins = user.wallets.reduce((sum, wallet) => sum + wallet.tokens.length, 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Total Balance</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
          </div>
          {/* <div>
            <h2 className="text-lg font-semibold text-gray-900">Staking Rewards</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">$890.45</p>
          </div> */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Total Coins</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalCoins}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Holdings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {user.wallets.map(wallet =>
            wallet.tokens.map(token => (
              <div key={token.token.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{token.token.name}</h3>
                    <p className="text-sm text-gray-500">{token.quantity} {token.token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(token.quantity * token.token.price).toFixed(2)}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="px-2 py-1 border rounded-md"
                      min="1"
                      max={token.quantity}
                    />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="px-2 py-1 border rounded-md"
                      min="1"
                    />
                    <button
                      onClick={() => handleSellToken(token.token, quantity, price)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL, MARKETPLACE_CONTRACT_ADDRESS } from '../config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Abi, Address } from 'viem';
import { marketplace_abi as marketplaceABI } from '@/lib/marketplace_abi';



interface Transaction {
  id: string;
  price: number;
  amount: number;
  timestamp: string;
  buyerWalletAddress: string;
  sellerWalletAddress: string;
}

interface ListedToken {
  id: string;
  tokenAddress : string;
  sellerWalletAddress: string;
  price: number;
  amount: number;
  createdAt: string;
}

interface Token {
  name: string;
  symbol: string;
  price: number;
  creatorAddress: string;
  royaltyRecipientAddress: string;
  transactions: Transaction[];
  listedTokens: ListedToken[];
}

export function ChannelCoin() {
  const { id } = useParams();
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get<Token>(`${BACKEND_URL}/token/transaction/${id}`,{
          withCredentials: true,
        });
        setToken(response.data);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, [id]);

  const handleTransaction = async (
    type: 'buy',
    sellerWalletAddress: String,
    price: number,
    amount: number,
    tokenAddress: String
  ) => {
    if (type !== 'buy') return;
  
    const amountInWei = parseEther((price * Number(amount)).toString());
  
    try {
      // Execute transaction
      const { writeContractAsync } = useWriteContract();
  
      const txHash = await writeContractAsync({
        address: MARKETPLACE_CONTRACT_ADDRESS as Address,
        abi: marketplaceABI as Abi,
        functionName: 'buyToken',
        args: [tokenAddress as Address, sellerWalletAddress as Address, Number(amount)],
        value: amountInWei, // Sending ETH in WEI
      });
  
      console.log('Transaction Sent:', txHash);
  
      // Wait for transaction confirmation
      const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
      if (isSuccess) {
        console.log('Transaction Successful:', txHash);
      }
    } catch (error) {
      console.error('Transaction Error:', error);
    }
  };
  if (!token) return <div className="text-center p-8">Loading...</div>;

  const totalListed = token.listedTokens.reduce((sum, lt) => sum + lt.amount, 0);
  const totalVolume = token.transactions.reduce((sum, t) => sum + (t.amount * t.price), 0);

  return (
    <div className="space-y-6">
      {/* Channel Banner */}
      <div className="relative h-64 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&h=400&fit=crop"
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 flex items-center">
          <img
            src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop"
            alt="Channel Profile"
            className="w-20 h-20 rounded-full border-4 border-white"
          />
          <div className="ml-4 text-white">
            <h1 className="text-2xl font-bold">{token.name}</h1>
            <p className="text-sm opacity-90">Creator: {token.creatorAddress.slice(0, 6)}...{token.creatorAddress.slice(-4)}</p>
          </div>
        </div>
      </div>

      {/* Coin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Price', value: `$${token.price.toFixed(4)}`, icon: DollarSign },
          { label: 'Listed Supply', value: totalListed, icon: BarChart3 },
          { label: 'Total Volume', value: `$${totalVolume.toFixed(2)}`, icon: TrendingUp },
          { label: 'Transactions', value: token.transactions.length, icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Trading Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Chart */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Price History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={token.transactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(ts : any) => new Date(ts).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(ts: any) => new Date(ts).toLocaleString()}
                  formatter={(value : any) => [`$${Number(value).toFixed(4)}`, 'Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Buy/Sell Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Available Listings</h2>
          {token.listedTokens.length > 0 ? (
            <div className="space-y-4">
              {token.listedTokens.map((listing) => (
                <div key={listing.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">
                      {listing.amount} {token.symbol} @ ${listing.price.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Seller: {listing.sellerWalletAddress.slice(0, 6)}...{listing.sellerWalletAddress.slice(-4)}
                    </p>
                  </div>
                  <button
                    className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700"
                    onClick={() => handleTransaction('buy', listing.sellerWalletAddress, listing.price, listing.amount, listing.tokenAddress)}
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No tokens currently listed for sale.</p>
          )}
        </div>

      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {token.transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {tx.amount} {token.symbol} @ ${tx.price.toFixed(4)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {tx.buyerWalletAddress.slice(0, 6)}...{tx.buyerWalletAddress.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ← {tx.sellerWalletAddress.slice(0, 6)}...{tx.sellerWalletAddress.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
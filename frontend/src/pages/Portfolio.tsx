import React from 'react';
import { Coins, ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react';

export function Portfolio() {
  const portfolio = [
    {
      name: 'MrBeast Coin',
      amount: '150.5 BEAST',
      value: '$6,892.90',
      change: '+12.5%',
      image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop',
    },
    {
      name: 'PewDiePie Coin',
      amount: '420.0 PEW',
      value: '$5,229.00',
      change: '-2.3%',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
    },
  ];

  const transactions = [
    {
      type: 'buy',
      coin: 'BEAST',
      amount: '50.0',
      price: '$45.78',
      total: '$2,289.00',
      date: '2h ago',
    },
    {
      type: 'sell',
      coin: 'PEW',
      amount: '100.0',
      price: '$12.45',
      total: '$1,245.00',
      date: '1d ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Total Balance</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">$12,121.90</p>
            <p className="mt-1 text-sm text-green-600">+8.2% (24h)</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Staking Rewards</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">$890.45</p>
            <p className="mt-1 text-sm text-gray-500">This month</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Total Coins</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
            <p className="mt-1 text-sm text-gray-500">Different creators</p>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Holdings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {portfolio.map((coin, i) => (
            <div key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{coin.name}</h3>
                    <p className="text-sm text-gray-500">{coin.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{coin.value}</p>
                  <p className={`text-sm ${
                    coin.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((tx, i) => (
            <div key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {tx.type === 'buy' ? (
                    <ArrowDownRight className="h-8 w-8 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-8 w-8 text-red-600" />
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.coin}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {tx.amount} @ {tx.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{tx.total}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staking Rewards */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Staking Rewards</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((coin, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="h-8 w-8 text-indigo-600" />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{coin.name}</h3>
                      <p className="text-sm text-gray-500">5.2% APY</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Claim
                  </button>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Rewards Available</div>
                  <div className="text-lg font-semibold text-gray-900">2.5 {coin.name.split(' ')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
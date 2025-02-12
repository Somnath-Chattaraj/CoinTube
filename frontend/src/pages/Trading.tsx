import React from 'react';
import { TrendingUp } from 'lucide-react';

export function Trading() {
  const orderBook = {
    asks: [
      { price: '$46.12', size: '150.00', total: '$6,918.00' },
      { price: '$46.05', size: '85.50', total: '$3,937.28' },
      { price: '$45.98', size: '200.00', total: '$9,196.00' },
    ],
    bids: [
      { price: '$45.65', size: '120.00', total: '$5,478.00' },
      { price: '$45.58', size: '95.50', total: '$4,352.89' },
      { price: '$45.52', size: '180.00', total: '$8,193.60' },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trading Panel */}
      <div className="space-y-6">
        {/* Buy Order */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Buy MrBeast Coin</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (BEAST)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">BEAST</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total (USD)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              Place Buy Order
            </button>
          </div>
        </div>

        {/* Order Book */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Order Book</h2>
          <div className="space-y-4">
            {/* Asks */}
            <div>
              <div className="grid grid-cols-3 text-sm font-medium text-gray-500 mb-2">
                <div>Price (USD)</div>
                <div className="text-right">Size (BEAST)</div>
                <div className="text-right">Total (USD)</div>
              </div>
              <div className="space-y-1">
                {orderBook.asks.map((order, i) => (
                  <div key={i} className="grid grid-cols-3 text-sm">
                    <div className="text-red-600">{order.price}</div>
                    <div className="text-right">{order.size}</div>
                    <div className="text-right">{order.total}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-2 text-center">
              <span className="text-2xl font-bold text-gray-900">$45.78</span>
              <span className="ml-2 text-sm text-green-600">+8.7%</span>
            </div>

            {/* Bids */}
            <div>
              <div className="space-y-1">
                {orderBook.bids.map((order, i) => (
                  <div key={i} className="grid grid-cols-3 text-sm">
                    <div className="text-green-600">{order.price}</div>
                    <div className="text-right">{order.size}</div>
                    <div className="text-right">{order.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">MrBeast Coin Price</h2>
          <div className="flex space-x-2">
            {['1H', '24H', '7D', '1M', '1Y'].map((period) => (
              <button
                key={period}
                className="px-3 py-1 text-sm rounded-md hover:bg-gray-100"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Price chart visualization goes here</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: '24h High', value: '$46.92' },
            { label: '24h Low', value: '$44.15' },
            { label: '24h Volume', value: '$2.5M' },
            { label: 'Market Cap', value: '$45.7M' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
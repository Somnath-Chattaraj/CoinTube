// import React from 'react';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function ChannelCoin() {
  const trendingChannels = [
    {
      name: 'PewDiePie Coin',
      creator: 'Pewdiepie',
      price: '$12.45',
      change: '+15.2%',
      volume: '$1.2M',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    },
    {
      name: 'MrBeast Coin',
      creator: 'MrBeast',
      price: '$45.78',
      change: '+8.7%',
      volume: '$2.5M',
      image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop',
    },
    {
      name: 'Markiplier Coin',
      creator: 'Markiplier',
      price: '$8.92',
      change: '-3.4%',
      volume: '$892K',
      image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&h=400&fit=crop',
    },
  ];

  const { id } = useParams();
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
            <h1 className="text-2xl font-bold">{trendingChannels[Number(id)].name}</h1>
            <p className="text-sm opacity-90">{"@"+trendingChannels[Number(id)].creator}</p>
          </div>
        </div>
      </div>

      {/* Coin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Price', value: trendingChannels[Number(id)].price, icon: DollarSign, change: trendingChannels[Number(id)].change },
          { label: 'Market Cap', value: '$45.7M', icon: BarChart3 },
          { label: '24h Volume', value: trendingChannels[Number(id)].volume, icon: TrendingUp },
          { label: 'Holders', value: '12,345', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.change && (
                  <p className="text-sm text-green-600">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    {stat.change}
                  </p>
                )}
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
          <h2 className="text-lg font-semibold mb-4">Price Chart</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Price chart visualization goes here</p>
          </div>
        </div>

        {/* Buy/Sell Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Trade</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
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
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              Buy
            </button>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Governance Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Active Proposals</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Proposal #{i}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    New community event funding proposal
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '65%' }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  65% Yes · 35% No · 2 days remaining
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
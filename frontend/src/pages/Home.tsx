// import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

export function Home() {
  const trendingChannels = [
    {
      name: 'PewDiePie Coin',
      price: '$12.45',
      change: '+15.2%',
      volume: '$1.2M',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
    },
    {
      name: 'MrBeast Coin',
      price: '$45.78',
      change: '+8.7%',
      volume: '$2.5M',
      image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop',
    },
    {
      name: 'Markiplier Coin',
      price: '$8.92',
      change: '-3.4%',
      volume: '$892K',
      image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&h=400&fit=crop',
    },
  ];

  const marketNews = [
    {
      title: 'New Creator Coin Launch: Tech Reviews Daily',
      date: '2h ago',
      description: 'Popular tech reviewer launches channel coin with exclusive review access for holders.',
    },
    {
      title: 'MrBeast Coin Hits All-Time High',
      date: '5h ago',
      description: 'Following announcement of new holder benefits, MrBeast coin surges 25%.',
    },
    {
      title: 'Creator Economy Report Q1 2025',
      date: '1d ago',
      description: 'Channel coins show 300% growth in trading volume year over year.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Trending Channels */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Channel Coins</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingChannels.map((channel) => (
            <div
              key={channel.name}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            >
              <img
                src={channel.image}
                alt={channel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">{channel.price}</span>
                  <span className={`flex items-center ${
                    channel.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {channel.change.startsWith('+') ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {channel.change}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  24h Volume: {channel.volume}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Creators</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                <Star className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="font-medium">Creator {i}</div>
                  <div className="text-sm text-gray-500">1.2M Subscribers</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market News */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Market News</h2>
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {marketNews.map((news, i) => (
            <div key={i} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{news.title}</h3>
                  <p className="mt-1 text-gray-500">{news.description}</p>
                </div>
                <span className="text-sm text-gray-500">{news.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
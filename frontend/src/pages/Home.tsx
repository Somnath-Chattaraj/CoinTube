// import React from 'react';
import { TrendingUp, TrendingDown, Star, Car } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface Token {
  tokenId: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  tokenPrice: number;
  walletAddress: string;
  Seller_name: string;
  email: string;
  amount: number;
}

export function Home() {
  // Renamed state variable to avoid conflict with the Token type
  const [tokenListData, setTokenListData] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch token list from backend
  const fetchTokenList = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Token[]>(`${BACKEND_URL}/token/listedToken`);
      setTokenListData(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenList();
  }, []);

  // Market news
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
          {tokenListData.map((token) => (
            <Link
              key={token.tokenAddress}
              to={`/coin/${token.tokenAddress}`}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{token.name}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${token.tokenPrice.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Volume: {token.amount}
                </div>
              </div>
            </Link>
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

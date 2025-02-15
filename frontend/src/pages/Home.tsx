// import React from 'react';
import { TrendingUp, TrendingDown, Star, Car } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useUser, useAuth } from '@clerk/clerk-react';

interface tokenList {
  tokenId : String,
  tokenAddress: String,
  name : String,
  symbol : String,
  tokenPrice: Number,
  walletAddress: String,
  Seller_name: String,
  email: String,
  amount: Number
}

export function Home() {

  const [tokenList, setTokenList] = useState<tokenList[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth(); // Get access token
  const [token, setToken] = useState<string | null>(null);
  const [channelData, setChannelData] = useState(null);

  // useEffect(() => {
  //   async function fetchChannel() {
  //     try {
  //       // Get the Google OAuth access token
  //       const googleToken = await getToken({ template: "google" });
  //       setToken(googleToken)
  //     if (!googleToken) {
  //       console.error("Failed to get Google OAuth token");
  //       return;
  //     }

  //     // Get actual Google access token from user's external accounts
  //     // const googleAccount = user?.externalAccounts.find(
  //     //   (account) => account.provider == "google"
  //     // );
      
  //     // if (!googleAccount?.oauthAccessToken) {
  //     //   console.error("No Google OAuth access token found");
  //     //   return;
  //     // }
  //     // console.log(googleAccount);
  //     // // Call YouTube API with actual Google token
  //     // const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
  //     //   headers: {
  //     //     Authorization: `Bearer ${googleToken}`,
  //     //     Accept: "application/json",
  //     //   },
  //     // });

  //     const data = await response.json();
  //     setChannelData(data);
  //   } catch (error) {
  //     console.error("Error fetching YouTube channel data:", error);
  //   }
  // }

  // if (user) {
  //   fetchChannel();
  // }

  //   fetchChannel();
  // }, [getToken]);

  // console.log(user);
  // console.log(token);
  // console.log(channelData);
  // const fetchTokenList = async () => {
  //   setLoading(true);
  //   try{
  //     const response = await axios.get(`${BACKEND_URL}/token/listedToken`);
  //     //@ts-ignore
  //     setTokenList(response.data);
  //     console.log(response.data);
  //     setLoading(false);
  //   }
  //   catch (error){
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
    
  // });
  // const trendingChannels = [
  //   {
  //     name: 'PewDiePie Coin',
  //     price: '$12.45',
  //     change: '+15.2%',
  //     volume: '$1.2M',
  //     image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
  //   },
  //   {
  //     name: 'MrBeast Coin',
  //     price: '$45.78',
  //     change: '+8.7%',
  //     volume: '$2.5M',
  //     image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop',
  //   },
  //   {
  //     name: 'Markiplier Coin',
  //     price: '$8.92',
  //     change: '-3.4%',
  //     volume: '$892K',
  //     image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&h=400&fit=crop',
  //   },
  // ];
  // console.log(user?.fullName);
  // console.log(user?.primaryEmailAddress?.emailAddress);
  const sendUserData = async () => {
    const response = await axios.post(`${BACKEND_URL}/user/signup`, {
      email: user?.primaryEmailAddress?.emailAddress
    }, {withCredentials: true})
    console.log(response.data);
  }
  sendUserData();
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

          {tokenList.map((token) => (
            <Link
              to= {"/coin/" + `${token.tokenAddress}`}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            >
              {/* <img
                src={channel.image}
                alt={channel.name}
                className="w-full h-48 object-cover"
              /> */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{token.name}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">{String(token.tokenPrice)} </span>
                  {/* <span className={`flex items-center ${
                    channel.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {channel.change.startsWith('+') ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {channel.change}
                  </span> */}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Volume: {String(token.amount)}
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
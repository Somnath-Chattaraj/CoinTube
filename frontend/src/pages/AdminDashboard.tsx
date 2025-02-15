// import React from 'react';
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react';


export function AdminDashboard() {
  const transactions = [
    {
      type: 'Royalty',
      amount: '+$1,234.56',
      date: '2h ago',
      status: 'Completed',
    },
    {
      type: 'Holder Reward',
      amount: '-$567.89',
      date: '5h ago',
      status: 'Completed',
    },
    {
      type: 'Trading Fee',
      amount: '+$89.12',
      date: '1d ago',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$45,789.12', icon: DollarSign },
          { label: 'Coin Holders', value: '12,345', icon: Users },
          { label: 'Trading Volume', value: '$2.5M', icon: TrendingUp },
          { label: 'Avg Hold Time', value: '45 days', icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <stat.icon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Revenue chart visualization goes here</p>
        </div>
      </div>

      {/* Holder Benefits */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Holder Benefits</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Early Access to Videos',
              description: '24h early access for holders with 100+ coins',
              status: 'Active',
            },
            {
              title: 'Monthly Meetup',
              description: 'Virtual meetup for top 100 holders',
              status: 'Scheduled',
            },
            {
              title: 'Exclusive Merch',
              description: 'Limited edition merch for holders',
              status: 'Draft',
            },
          ].map((benefit, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                benefit.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : benefit.status === 'Scheduled'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {benefit.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((tx, i) => (
            <div key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{tx.type}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount}
                  </p>
                  <p className="text-sm text-gray-500">{tx.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
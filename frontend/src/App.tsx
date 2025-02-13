// import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ChannelCoin } from './pages/ChannelCoin';
import { Portfolio } from './pages/Portfolio';
import { Trading } from './pages/Trading';
import { AdminDashboard } from './pages/AdminDashboard';
import { Routes, Route } from 'react-router-dom';
import { Marketplace} from './pages/marketplace'
import { config } from './config';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route path='/home' element={<Home />}/>
            <Route path='/trading' element={<Trading />}/>
            <Route path='/admin' element={<AdminDashboard />}/>
            <Route path='/portfolio' element={<Portfolio />}/>
            <Route path='/coin/:id' element={<ChannelCoin />}/>
            <Route path='/marketplace' element={<Marketplace />}/>
          </Route>
        </Routes>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
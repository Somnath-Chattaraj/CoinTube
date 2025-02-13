// import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ChannelCoin } from './pages/ChannelCoin';
import { Portfolio } from './pages/Portfolio';
import { Trading } from './pages/Trading';
import { AdminDashboard } from './pages/AdminDashboard';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='/home' element={<Home />}/>
        <Route path='/trading' element={<Trading />}/>
        <Route path='/admin' element={<AdminDashboard />}/>
        <Route path='/portfolio' element={<Portfolio />}/>
        <Route path='/coin' element={<ChannelCoin />}/>
      </Route>
    </Routes>
  );
}

export default App;
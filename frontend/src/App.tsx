import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ChannelCoin } from './pages/ChannelCoin';
import { Portfolio } from './pages/Portfolio';
import { Trading } from './pages/Trading';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'channel':
        return <ChannelCoin />;
      case 'portfolio':
        return <Portfolio />;
      case 'trading':
        return <Trading />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
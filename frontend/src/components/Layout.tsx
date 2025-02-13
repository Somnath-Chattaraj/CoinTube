import { useState } from 'react';
import { Search, Wallet, User, Menu, X, Youtube } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = [
    { name: 'Home', value: 'home' },
    { name: 'Trading', value: 'trading' },
    { name: 'Portfolio', value: 'portfolio' },
    { name: 'Creator Dashboard', value: 'admin' },
    { name: 'Marketplace', value: 'marketplace' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Youtube className="h-8 w-8 text-red-600" />
                <span className="ml-2 text-xl font-bold">CoinTube</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.value}
                    to = {item.value}
                    className={({ isActive }) =>
                      isActive 
                        ? 'text-indigo-600 border-b-2 border-indigo-600 inline-flex items-center px-1 pt-1 text-sm font-medium'
                         : 'text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium'
                     }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search YouTube channels"
                  />
                </div>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center">
              <button title='wallet' className="p-2 text-gray-600 hover:text-gray-900">
                <Wallet className="h-6 w-6" />
              </button>
              
              <div className="ml-3 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <User className="h-6 w-6" />
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700">
                        <div>Balance: 1,234 ETH</div>
                        <div className="mt-1">Portfolio Value: $2.3M</div>
                      </div>
                      <hr />
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.value}
                  to = {item.value}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    isActive 
                      ? 'border-indigo-500 text-indigo-700 bg-indigo-50 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                       : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                   }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';

// En una implementación real, esto usaría un contexto de autenticación
// Para este ejemplo, simulamos un usuario autenticado
const fakeAuth = {
  isAuthenticated: true,
  isAdmin: true
};

const Header: React.FC = () => {
  const location = useLocation();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  return (
    <header className="flex justify-between items-center py-5 px-6 md:px-10 bg-black text-white">
      <div className="text-2xl font-bold">
        <Link to="/" className="flex items-center">
          <span className="text-white">DEMIANZX</span>
          <span className="text-purple-500"> GAMES</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-6">
        <nav className={`${searchExpanded ? 'hidden md:block' : 'block'}`}>
          <ul className="flex space-x-8">
            <li><Link to="/" className={`hover:text-purple-400 transition-colors ${location.pathname === '/' ? 'text-purple-400' : ''}`}>Home</Link></li>
            <li><Link to="/articles" className={`hover:text-purple-400 transition-colors ${location.pathname.includes('/articles') ? 'text-purple-400' : ''}`}>Articles</Link></li>
            <li><Link to="/reviews" className={`hover:text-purple-400 transition-colors ${location.pathname.includes('/reviews') ? 'text-purple-400' : ''}`}>Reviews</Link></li>
            {fakeAuth.isAdmin && (
              <li><Link to="/admin" className="hover:text-purple-400 transition-colors">Admin</Link></li>
            )}
          </ul>
        </nav>
        
        {searchExpanded ? (
          <div className="relative flex items-center flex-grow md:flex-grow-0">
            <input 
              type="text"
              placeholder="Search..."
              className="bg-gray-800 rounded-full py-2 px-4 pr-10 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-600"
              autoFocus
            />
            <button 
              className="absolute right-3 text-gray-400"
              onClick={() => setSearchExpanded(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            className="text-gray-300 hover:text-white transition-colors"
            onClick={() => setSearchExpanded(true)}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        
        {fakeAuth.isAuthenticated ? (
          <div className="relative group">
            <button className="flex items-center space-x-2">
              <img 
                src="https://picsum.photos/100/100?random=10" 
                alt="User Avatar" 
                className="w-8 h-8 rounded-full"
              />
              <span>John Doe</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</Link>
              {fakeAuth.isAdmin && (
                <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Admin Dashboard</Link>
              )}
              <Link to="/" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Logout</Link>
            </div>
          </div>
        ) : (
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </button>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminBreadcrumb from '../admin/AdminBreadcrumb';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 md:px-10 bg-black border-b border-gray-800">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-white">DEMIANZX</span>
          <span className="text-purple-500"> GAMES</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/admin" className="hover:text-purple-400 transition-colors">
            Admin
          </Link>
          <Link to="/admin" className="hover:text-purple-400 transition-colors">
            Dashboard
          </Link>
          <Link to="/" className="hover:text-purple-400 transition-colors">
            Log out
          </Link>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-60 bg-gray-900 md:min-h-screen p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/admin" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin') && location.pathname === '/admin'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/posts" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/posts')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Posts
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/categories" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/categories')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/users" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/users')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/settings" 
                  className={`block px-4 py-2 rounded-md ${
                    isActiveRoute('/admin/settings')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-grow p-6">
          <AdminBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
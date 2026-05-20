import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Book, PlusCircle, Bookmark, Users, LogOut, Menu, X, User as UserIcon, Search } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'My Books', path: '/books', icon: <Book size={18} /> },
    { name: 'Categories', path: '/categories', icon: <Bookmark size={18} /> },
    { name: 'Lending Tracker', path: '/lending', icon: <Users size={18} /> },
    { name: 'Add Book', path: '/add-book', icon: <PlusCircle size={18} /> },
    { name: 'Book Search', path: '/search', icon: <Search size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#161618] text-gray-300 font-sans selection:bg-[#f59e0b]/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#1c1c1f] border-r border-white/5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Area */}
        <div className="flex flex-col px-8 py-8">
          <div className="flex items-center justify-between lg:block">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#f59e0b]">Vayana</h1>
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase mt-1">Private Library</p>
            </div>
            <button className="lg:hidden text-gray-500 hover:text-white transition-colors" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#f59e0b]/10 text-[#f59e0b] ring-1 ring-[#f59e0b]/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={`mr-3 ${isActive ? 'text-[#f59e0b]' : 'text-gray-500'}`}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="space-y-1">
             <Link 
               to="/profile"
               onClick={() => setIsSidebarOpen(false)}
               className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                 location.pathname === '/profile'
                   ? 'bg-[#f59e0b]/10 text-[#f59e0b] ring-1 ring-[#f59e0b]/20'
                   : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
               }`}
             >
              <UserIcon size={18} className={`mr-3 ${location.pathname === '/profile' ? 'text-[#f59e0b]' : 'text-gray-500'}`} />
              Profile
             </Link>
            <button 
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 transition-colors rounded-xl hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} className="mr-3 text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#161618]">
        {/* Mobile Top Nav */}
        <header className="flex items-center justify-between px-6 py-4 glass-panel border-b-0 lg:hidden sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-white transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#f59e0b]">Vayana</h1>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-[#2a2a2e] flex items-center justify-center text-[#f59e0b] text-xs font-bold border border-white/10 transition-transform duration-200 hover:scale-105" title="View Profile">
            {user?.name?.charAt(0).toUpperCase()}
          </Link>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-12 lg:py-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

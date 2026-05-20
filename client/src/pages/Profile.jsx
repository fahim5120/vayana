import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, BookMarked, BookOpen, CheckCircle, TrendingUp, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books');
        setBooks(data);
      } catch (err) {
        console.error('Failed to load books stats in profile', err);
        setError('Unable to load reading statistics at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Compute stats
  const totalBooks = books.length;
  const currentlyReadingCount = books.filter(b => b.status === 'Reading').length;
  const completedCount = books.filter(b => b.status === 'Completed').length;
  const totalPagesRead = books.reduce((acc, book) => acc + (book.currentPage || 0), 0);

  // Generate User Initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const statItems = [
    { label: 'Total Shelved', value: totalBooks, icon: <BookMarked size={20} className="text-[#f59e0b]" />, desc: 'Books in your private vault' },
    { label: 'In Progress', value: currentlyReadingCount, icon: <BookOpen size={20} className="text-[#3b82f6]" />, desc: 'Books currently active' },
    { label: 'Completed', value: completedCount, icon: <CheckCircle size={20} className="text-[#10b981]" />, desc: 'Finished reading journeys' },
    { label: 'Pages Consumed', value: totalPagesRead, icon: <TrendingUp size={20} className="text-[#8b5cf6]" />, desc: 'Aggregate page progress' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          My Account & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]">Profile</span>
        </h2>
        <p className="mt-2 text-gray-400">
          Manage your personal credentials and view your reading progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Account Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden premium-shadow flex flex-col items-center text-center">
            {/* Ambient Background Blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f59e0b]/5 blur-[60px] rounded-full"></div>
            
            {/* Avatar Initials with ambient border glow */}
            <div className="relative mt-4 mb-5 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#f59e0b]/20 to-[#fbbf24]/5 border-2 border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="text-3xl font-extrabold text-white tracking-wider select-none font-serif">
                {getInitials(user?.name)}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white line-clamp-1">{user?.name || 'Library Member'}</h3>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-1">Authorized Member</p>
            
            <div className="w-full mt-6 pt-6 border-t border-white/5 space-y-3.5 text-left text-sm text-gray-400">
              <div className="flex justify-between items-center">
                <span>Account Status</span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-[#10b981] bg-[#10b981]/15 border border-[#10b981]/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Member ID</span>
                <code className="text-xs text-gray-500 font-mono tracking-tight bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {user?._id ? user._id.substring(0, 12) + '...' : 'Unknown'}
                </code>
              </div>
            </div>
          </div>

          {/* Security status panel */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden premium-shadow space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-[#f59e0b]" />
              Security Integrity
            </h3>
            
            <div className="space-y-3.5 text-sm text-gray-400">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <KeyRound size={14} className="text-gray-600" />
                  Session Token
                </span>
                <span className="text-xs text-[#10b981] font-semibold bg-[#10b981]/5 px-2 py-0.5 rounded border border-[#10b981]/10">JWT Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Shield size={14} className="text-gray-600" />
                  Vault Isolation
                </span>
                <span className="text-xs text-blue-400 font-semibold bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">Private Shelves</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Cards: Details and Reading Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Information Form Panel */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden premium-shadow">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3b82f6]/5 blur-[80px] rounded-full"></div>
            
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <User size={18} className="text-[#f59e0b]" />
              Account Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-[#161618]/50 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed select-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-[#161618]/50 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed select-none font-medium"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-xl flex gap-3 text-xs text-gray-400 leading-relaxed">
              <Shield size={16} className="text-[#f59e0b] shrink-0 mt-0.5" />
              <p>
                Your library account is secured using industry-standard JSON Web Tokens (JWT) for authentication. Profile credentials cannot be modified directly from this panel for security containment.
              </p>
            </div>
          </div>

          {/* Reading Accomplishments grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-[#f59e0b]" />
                Reading Metrics
              </h3>
              {loading && <RefreshCw size={14} className="animate-spin text-gray-500" />}
            </div>

            {/* Error handling block */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statItems.map((item, i) => (
                <div 
                  key={i} 
                  className={`p-5 glass-panel rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    loading ? 'animate-pulse' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</span>
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                      {item.icon}
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-white">
                    {loading ? '—' : item.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

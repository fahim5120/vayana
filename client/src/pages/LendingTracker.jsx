import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Users, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';

const LendingTracker = () => {
  const [lendings, setLendings] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    book: '',
    borrowerName: '',
    returnDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchLendings();
    fetchBooks();
  }, []);

  const fetchLendings = async () => {
    try {
      const { data } = await api.get('/lending');
      setLendings(data);
    } catch (err) {
      setError('Failed to fetch lendings');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      console.error('Failed to fetch books');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lending', formData);
      setFormData({ book: '', borrowerName: '', returnDate: '', notes: '' });
      setShowAddForm(false);
      fetchLendings();
    } catch (err) {
      setError('Failed to add lending record');
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      await api.put(`/lending/${id}`, { returned: true });
      fetchLendings();
    } catch (err) {
      alert('Failed to update lending record');
    }
  };

  const activeLoans = lendings.filter(l => !l.returned);
  const overdueLoans = activeLoans.filter(l => l.returnDate && new Date(l.returnDate) < new Date());
  
  // Calculate due soon (within next 3 days)
  const dueSoonLoans = activeLoans.filter(l => {
    if (!l.returnDate) return false;
    const returnDate = new Date(l.returnDate);
    const today = new Date();
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  });

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading lending records...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Lending Tracker</h2>
          <p className="mt-2 text-gray-400">Manage and track your private collection currently in the hands of others.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#d97706] to-[#b45f06] rounded-xl hover:from-[#f59e0b] hover:to-[#d97706] premium-shadow transition-all"
        >
          {showAddForm ? 'Cancel' : 'Lend New Book'}
        </button>
      </div>

      {error && <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={64} /></div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Total Lent</h3>
          <p className="text-4xl font-bold text-white">{activeLoans.length}</p>
        </div>
        <div className="p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={64} className="text-[#f59e0b]" /></div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Due Soon</h3>
          <p className="text-4xl font-bold text-[#f59e0b]">{dueSoonLoans.length}</p>
          <p className="text-xs text-gray-500 mt-2">Within next 3 days</p>
        </div>
        <div className="p-6 glass-panel rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-500" /></div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Overdue</h3>
          <p className="text-4xl font-bold text-red-400">{overdueLoans.length}</p>
          <p className="text-xs text-red-500/70 mt-2 flex items-center"><AlertTriangle size={12} className="mr-1" /> Follow up required</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-8 glass-panel rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Record New Loan</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Book</label>
              <div className="relative">
                <select 
                  required
                  value={formData.book}
                  onChange={(e) => setFormData({...formData, book: e.target.value})}
                  className="w-full py-3 pl-4 pr-10 bg-[#161618] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] appearance-none"
                >
                  <option value="">Select Book</option>
                  {books.map(b => (
                    <option key={b._id} value={b._id}>{b.title}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Borrower Name</label>
              <input 
                type="text" required
                value={formData.borrowerName}
                placeholder="e.g. Elena Moore"
                onChange={(e) => setFormData({...formData, borrowerName: e.target.value})}
                className="w-full py-3 px-4 bg-[#161618] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">Expected Return</label>
              <input 
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                className="w-full py-3 px-4 bg-[#161618] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-3 px-4 font-semibold text-white bg-green-600/90 hover:bg-green-600 rounded-xl transition-colors">
                Save Record
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Active Loans Table */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">Active Loans</h3>
        <div className="overflow-hidden glass-panel rounded-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Borrower</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Lent</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Expected Return</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeLoans.length > 0 ? (
                  activeLoans.map(record => {
                    const isOverdue = record.returnDate && new Date(record.returnDate) < new Date();
                    const isDueSoon = record.returnDate && !isOverdue && (() => {
                      const returnDate = new Date(record.returnDate);
                      const today = new Date();
                      const diffTime = returnDate - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays >= 0 && diffDays <= 3;
                    })();

                    return (
                      <tr key={record._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="w-10 h-14 shrink-0 rounded overflow-hidden mr-4 border border-white/10 bg-gray-800">
                              {record.book?.coverImage ? (
                                <img src={record.book.coverImage} alt={record.book.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-serif">
                                  {record.book?.title?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{record.book?.title || 'Unknown Book'}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{record.book?.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#3f3f46] flex items-center justify-center text-gray-300 text-xs font-bold mr-3 border border-white/10">
                              {record.borrowerName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-300">{record.borrowerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">
                          {new Date(record.borrowDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">
                          {record.returnDate ? new Date(record.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Set'}
                        </td>
                        <td className="px-6 py-5 text-sm">
                          {isOverdue ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                              Overdue
                            </span>
                          ) : isDueSoon ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                              Due Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/5 text-gray-400 border border-white/10">
                              On Time
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleMarkReturned(record._id)}
                            className="inline-flex items-center text-sm font-medium text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
                          >
                            Mark Returned
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No active loans found. Your library is intact.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* History Table (Returned Loans) */}
      {lendings.filter(l => l.returned).length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-400 mb-6">Loan History</h3>
          <div className="overflow-hidden glass-panel rounded-2xl border border-white/5 opacity-70 hover:opacity-100 transition-opacity">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <tbody className="divide-y divide-white/5">
                  {lendings.filter(l => l.returned).map(record => (
                    <tr key={record._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400 line-through decoration-gray-600">{record.book?.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">to {record.borrowerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 text-right">
                        <span className="inline-flex items-center text-green-500"><CheckCircle size={14} className="mr-1" /> Returned</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LendingTracker;

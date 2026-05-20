import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import BookCard from '../components/BookCard';
import { BookOpen, CheckCircle, Clock, BookMarked, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books');
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;

  const totalBooks = books.length;
  const currentlyReadingBooks = books.filter(b => b.status === 'Reading');
  const currentlyReadingCount = currentlyReadingBooks.length;
  const completedCount = books.filter(b => b.status === 'Completed').length;
  // A rough estimate for total pages read across all books
  const totalPagesRead = books.reduce((acc, book) => acc + (book.currentPage || 0), 0);
  
  const recentBooks = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const continueReading = [...currentlyReadingBooks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 2);

  const stats = [
    { label: 'Total Books', value: totalBooks, icon: <BookMarked size={20} className="text-[#f59e0b]" /> },
    { label: 'Currently Reading', value: currentlyReadingCount, icon: <BookOpen size={20} className="text-[#3b82f6]" /> },
    { label: 'Completed', value: completedCount, icon: <CheckCircle size={20} className="text-[#10b981]" /> },
    { label: 'Pages Read', value: totalPagesRead, icon: <TrendingUp size={20} className="text-[#8b5cf6]" /> },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Reader'}.
        </h2>
        <p className="mt-2 text-gray-400">
          You've cataloged {totalBooks} books and read {totalPagesRead} pages. Keep it up!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 transition-colors glass-panel rounded-2xl hover:bg-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Continue Reading & Weekly Focus) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Reading */}
          {continueReading.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Continue Reading</h3>
                <Link to="/books" className="text-sm font-medium text-[#f59e0b] hover:text-[#fbbf24] transition-colors">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {continueReading.map(book => (
                  <div key={book._id} className="flex gap-4 p-4 glass-panel rounded-2xl hover:bg-white/5 transition-all group">
                    <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow-md border border-white/10 relative">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-600 font-bold">
                          {book.title.substring(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 py-1">
                      <h4 className="font-semibold text-gray-200 line-clamp-1">{book.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                      <div className="mt-auto">
                        <ProgressBar current={book.currentPage} total={book.totalPages} />
                        <Link 
                          to={`/books/${book._id}`}
                          className="block w-full py-2 mt-3 text-xs font-medium text-center text-gray-300 transition-colors bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 group-hover:border-white/20"
                        >
                          Resume
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Focus (Placeholder Widget) */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Weekly Focus</h3>
            <div className="h-64 glass-panel rounded-2xl p-6 flex items-end justify-between gap-2 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-[#f59e0b]/5 to-transparent pointer-events-none"></div>
               {/* Mock Bar Chart */}
               {[40, 70, 30, 90, 60, 50, 80].map((height, i) => (
                 <div key={i} className="flex flex-col items-center flex-1 gap-3 z-10">
                   <div 
                     className="w-full max-w-[2.5rem] bg-[#f59e0b] rounded-t-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:opacity-80"
                     style={{ height: `${height}%`, opacity: height === 90 ? 1 : 0.4 }}
                   ></div>
                   <span className="text-xs text-gray-600 font-medium">
                     {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                   </span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column (Daily Goals / Insights) */}
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f59e0b]/20 blur-[50px] rounded-full"></div>
             <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6 flex items-center">
               <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mr-2"></span>
               Daily Goal
             </h3>
             <div className="flex flex-col items-center justify-center my-8">
               <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-white/5">
                 <div className="absolute inset-0 rounded-full border-8 border-[#f59e0b] border-l-transparent border-b-transparent transform rotate-45 shadow-[0_0_20px_rgba(245,158,11,0.4)]"></div>
                 <div className="text-center">
                   <span className="text-4xl font-bold text-white">75<span className="text-lg text-gray-500">%</span></span>
                   <p className="text-xs text-gray-500 mt-1">Pages</p>
                 </div>
               </div>
             </div>
             <div className="space-y-3 pt-6 border-t border-white/5">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Daily Progress</span>
                 <span className="text-gray-300">37 / 50 pages</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Current Streak</span>
                 <span className="font-medium text-[#f59e0b]">12 Days</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recently Added</h3>
          <Link to="/books" className="text-sm font-medium text-[#f59e0b] hover:text-[#fbbf24] transition-colors">
            Library
          </Link>
        </div>
        
        {recentBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {recentBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-panel border border-dashed rounded-2xl border-white/20">
            <p className="text-gray-500 mb-6">Your shelf is empty.</p>
            <Link to="/add-book" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-[#f59e0b] rounded-xl hover:bg-[#d97706] transition-colors premium-shadow">
              Add your first book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import BookCard from '../components/BookCard';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Curate Your Collection</h2>
          <p className="mt-2 text-gray-400">Manage and explore your private digital archive.</p>
        </div>
        <Link 
          to="/add-book" 
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#d97706] to-[#b45f06] rounded-xl hover:from-[#f59e0b] hover:to-[#d97706] premium-shadow transition-all group"
        >
          <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
          Add Volume
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row glass-panel p-2 rounded-2xl">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full py-3 pl-12 pr-4 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:ring-0 focus:outline-none"
            placeholder="Search archive by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden sm:block w-px bg-white/10 my-2"></div>
        <div className="relative sm:w-56">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
            <Filter size={18} />
          </div>
          <select
            className="block w-full py-3 pl-12 pr-10 bg-transparent border-none appearance-none text-gray-300 focus:ring-0 focus:outline-none cursor-pointer [&>option]:bg-[#1c1c1f]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="Reading">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-500 animate-pulse">Loading archive...</div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel border border-dashed rounded-2xl border-white/20">
          <p className="text-gray-400">No volumes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Books;

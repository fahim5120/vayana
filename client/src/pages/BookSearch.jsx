import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, User, ExternalLink, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Suggestions for fast searches
  const suggestions = [
    { label: 'Harry Potter', query: 'harry potter' },
    { label: 'Lord of the Rings', query: 'the lord of the rings' },
    { label: 'Dune', query: 'dune' },
    { label: 'The Hobbit', query: 'the hobbit' },
    { label: 'Game of Thrones', query: 'game of thrones' },
  ];

  // Fetch books from Open Library API
  const fetchBooks = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setQuery(searchQuery);

    try {
      // Encode query parameter to be URL safe
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodedQuery}`);
      
      // Standardize response extraction with optional chaining
      const docs = response?.data?.docs || [];
      setBooks(docs);
    } catch (err) {
      console.error('Error fetching books from Open Library:', err);
      setError(
        err?.response?.data?.message || 
        err?.message || 
        'Something went wrong while contacting the Open Library servers. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Perform search on component mount for immediate dynamic content
  useEffect(() => {
    const defaultSearch = 'the lord of the rings';
    setSearchInput(defaultSearch);
    fetchBooks(defaultSearch);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(searchInput);
  };

  const handleSuggestionClick = (suggestedQuery) => {
    setSearchInput(suggestedQuery);
    fetchBooks(suggestedQuery);
  };

  return (
    <div className="space-y-10">
      {/* Header section with gradient accent */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]">Online Catalog</span>
          </h2>
          <p className="mt-2 text-gray-400">
            Search millions of books dynamically from the global Open Library index.
          </p>
        </div>
      </div>

      {/* Search Input Panel */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden premium-shadow">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#f59e0b]/5 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3b82f6]/5 blur-[80px] rounded-full"></div>
        
        <form onSubmit={handleSearchSubmit} className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Search size={20} />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by book title, author, or keyword..."
                className="w-full pl-11 pr-4 py-3.5 bg-[#161618] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-6 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#f59e0b]/15 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Search Catalog
                </>
              )}
            </button>
          </div>

          {/* Quick suggestions tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-gray-500 font-medium mr-1">Suggestions:</span>
            {suggestions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSuggestionClick(item.query)}
                className={`px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  query.toLowerCase() === item.query.toLowerCase()
                    ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-[#f59e0b]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Main Results Board */}
      <div className="space-y-6">
        {hasSearched && !loading && !error && (
          <div className="flex justify-between items-center px-1">
            <p className="text-sm text-gray-400">
              Showing search results for <span className="text-[#f59e0b] font-semibold">"{query}"</span>
            </p>
            <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gray-400">
              {books?.length || 0} books found
            </span>
          </div>
        )}

        {/* Error State Banner */}
        {error && (
          <div className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300">
            <AlertCircle size={22} className="shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <h4 className="font-semibold text-white">Search Failed</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{error}</p>
              <button
                onClick={() => fetchBooks(query)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
              >
                <RefreshCw size={12} />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading skeletons grid loader */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="flex flex-col h-full bg-[#1c1c1f] rounded-2xl border border-white/5 overflow-hidden animate-pulse"
              >
                {/* Cover skeleton */}
                <div className="relative aspect-[2/3] w-full bg-[#2a2a2e]/60"></div>
                {/* Details skeleton */}
                <div className="p-5 flex flex-col flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-[#2a2a2e]/60 rounded w-5/6"></div>
                    <div className="h-4 bg-[#2a2a2e]/40 rounded w-1/2"></div>
                  </div>
                  <div className="mt-auto pt-6 flex justify-between">
                    <div className="h-3 bg-[#2a2a2e]/40 rounded w-1/3"></div>
                    <div className="h-3 bg-[#2a2a2e]/60 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Card Grid */}
        {!loading && !error && hasSearched && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => {
              const coverUrl = book?.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                : null;
              
              const bookTitle = book?.title || 'Unknown Title';
              const firstAuthor = book?.author_name?.[0] || 'Unknown Author';
              const publishYear = book?.first_publish_year || null;

              return (
                <div 
                  key={book?.key || Math.random()} 
                  className="flex flex-col h-full bg-[#1c1c1f] rounded-2xl overflow-hidden border border-white/5 hover-elevate group"
                >
                  {/* Cover Photo Container */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#2a2a2e]">
                    {coverUrl ? (
                      <img 
                        src={coverUrl} 
                        alt={bookTitle} 
                        loading="lazy"
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-8 text-center">
                        <span className="text-5xl font-extrabold text-gray-700 font-serif mb-2 select-none">
                          {bookTitle.substring(0, 1).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest bg-black/20 px-2 py-1 rounded border border-white/5">
                          No Cover Image
                        </span>
                      </div>
                    )}
                    
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Quick Link Badge to Open Library Page */}
                    {book?.key && (
                      <a 
                        href={`https://openlibrary.org${book.key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-gray-400 hover:text-white transition-all duration-200"
                        title="View details on Open Library"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  {/* Text Details Area */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Title */}
                    <h3 
                      className="text-base font-semibold text-white line-clamp-2 mb-1 group-hover:text-[#f59e0b] transition-colors duration-200" 
                      title={bookTitle}
                    >
                      {bookTitle}
                    </h3>
                    
                    {/* Author */}
                    <p className="text-sm text-gray-400 line-clamp-1 font-light flex items-center gap-1.5 mt-1">
                      <User size={13} className="text-gray-500 shrink-0" />
                      {firstAuthor}
                    </p>
                    
                    {/* Publish Year */}
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={13} className="text-gray-600 shrink-0" />
                        <span>First published</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-white/5 rounded border border-white/10 text-gray-300">
                        {publishYear ? publishYear : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State / No Books Found */}
        {!loading && !error && hasSearched && books.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 glass-panel rounded-2xl text-center border border-dashed border-white/15 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-500/5 blur-[50px] rounded-full"></div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4 text-[#f59e0b] shadow-inner">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Books Found</h3>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
              We couldn't find any books matching <span className="text-[#f59e0b]">"{query}"</span>. Try checking for typos or searching for a different keyword.
            </p>
            <button
              onClick={() => {
                setSearchInput('');
                fetchBooks('the lord of the rings');
              }}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors duration-200"
            >
              Reset to Default Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;

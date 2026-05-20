import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book._id}`} className="block group">
      <div className="flex flex-col h-full bg-[#1c1c1f] rounded-2xl hover-elevate overflow-hidden border border-white/5">
        
        {/* Cover Area */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#2a2a2e]">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" 
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
              <span className="text-4xl font-bold text-gray-700 font-serif">{book.title.substring(0, 1)}</span>
            </div>
          )}
          
          {/* Subtle gradient overlay at the bottom of the cover for text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1f] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-md rounded-md border border-white/10">
            {book.status}
          </div>
        </div>

        {/* Details Area */}
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-base font-semibold text-white line-clamp-1 mb-1 group-hover:text-[#f59e0b] transition-colors" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1 font-light">{book.author}</p>
          
          <div className="mt-auto pt-5">
            <ProgressBar current={book.currentPage} total={book.totalPages} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;

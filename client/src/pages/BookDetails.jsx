import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProgressBar from '../components/ProgressBar';
import { ArrowLeft, Edit, Trash2, BookOpen, Clock, Tag } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        setError('Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this volume from your archive?')) {
      try {
        await api.delete(`/books/${id}`);
        navigate('/books');
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Retrieving archive details...</div>;
  if (error) return <div className="p-12 text-center text-red-400">{error}</div>;
  if (!book) return <div className="p-12 text-center text-gray-500">Volume not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/books')}
          className="group flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Library
        </button>
        <div className="flex space-x-4">
          <Link 
            to={`/edit-book/${book._id}`}
            className="flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors premium-shadow"
          >
            <Edit size={16} className="mr-2 text-gray-400" /> Edit Metadata
          </Link>
          <button 
            onClick={handleDelete}
            className="flex items-center px-5 py-2.5 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors premium-shadow"
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Book Content */}
      <div className="flex flex-col gap-12 lg:flex-row">
        
        {/* Cover Area */}
        <div className="w-full lg:w-1/3 shrink-0">
          <div className="aspect-[2/3] w-full bg-[#1c1c1f] rounded-2xl overflow-hidden premium-shadow border border-white/10 relative group">
             {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-600 text-8xl font-bold font-serif uppercase">
                  {book.title.substring(0, 1)}
                </div>
              )}
             <div className="absolute top-4 right-4 px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-white bg-black/60 backdrop-blur-md rounded-lg shadow-sm border border-white/10">
              {book.status}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1 flex flex-col pt-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-400 font-light">{book.author}</p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pb-8 border-b border-white/10">
            {book.category && (
              <div className="flex items-center px-4 py-2 text-sm font-medium text-[#f59e0b] bg-[#f59e0b]/10 rounded-xl ring-1 ring-[#f59e0b]/20">
                <Tag size={16} className="mr-2" />
                {book.category.name}
              </div>
            )}
            <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 rounded-xl border border-white/5">
              <BookOpen size={16} className="mr-2 text-gray-500" />
              {book.totalPages} Pages
            </div>
            <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 rounded-xl border border-white/5">
              <Clock size={16} className="mr-2 text-gray-500" />
              Added {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-8 p-8 glass-panel rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Reading Progress</h3>
              <span className="text-sm font-medium text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1 rounded-full">
                {book.status === 'Completed' ? 'Finished' : book.status === 'Not Started' ? 'Not Started' : 'In Progress'}
              </span>
            </div>
            <ProgressBar current={book.currentPage} total={book.totalPages} />
            <p className="mt-6 text-sm text-gray-400 leading-relaxed">
              {book.status === 'Completed' ? 'You have finished reading this volume. A great addition to your completed archive.' :
               book.status === 'Not Started' ? 'You haven\'t opened this volume yet. The journey awaits.' :
               `You are currently engaged with this text. You have ${book.totalPages - book.currentPage} pages left to complete.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

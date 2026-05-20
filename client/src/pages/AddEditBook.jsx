import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { BookOpen, UploadCloud } from 'lucide-react';

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    totalPages: 1,
    currentPage: 0,
    status: 'Not Started',
    coverImage: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          const { data } = await api.get(`/books/${id}`);
          setFormData({
            title: data.title,
            author: data.author,
            category: data.category ? data.category._id : '',
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            status: data.status,
            coverImage: data.coverImage || ''
          });
        } catch (err) {
          setError('Failed to load book details.');
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalPages' || name === 'currentPage' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditMode) {
        await api.put(`/books/${id}`, formData);
      } else {
        await api.post('/books', formData);
      }
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading archive details...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {isEditMode ? 'Edit Volume' : 'Curate Your Collection'}
        </h2>
        <p className="mt-2 text-gray-400">
          {isEditMode ? 'Update metadata for this archive entry.' : 'Add a new volume to your private digital archive with detailed metadata.'}
        </p>
      </div>

      {error && <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Book Cover Area */}
        <div className="w-full lg:w-1/3 shrink-0 space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Book Cover</h3>
          <div className="aspect-[2/3] w-full rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-[#1c1c1f] p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden group">
            {formData.coverImage ? (
              <>
                <img src={formData.coverImage} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <UploadCloud size={32} className="text-[#f59e0b] mb-3" />
                  <p className="text-sm font-medium text-white">Change Cover URL</p>
                </div>
              </>
            ) : (
              <>
                <UploadCloud size={32} className="text-[#f59e0b] mb-3" />
                <p className="text-sm font-medium text-white mb-1">Provide Image URL</p>
                <p className="text-xs text-gray-500">Supports JPG, PNG URLs</p>
              </>
            )}
            {/* Input is placed below instead of actual file upload since PRD uses string URL for now */}
          </div>
          <input 
            type="url" 
            name="coverImage"
            placeholder="https://example.com/cover.jpg"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full py-3 px-4 bg-[#1c1c1f] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all text-sm"
          />
          <p className="text-xs text-gray-500 italic leading-relaxed">
            A high-quality cover helps you identify your books at a glance in the library grid.
          </p>
        </div>

        {/* Right Side - Form Fields */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="p-8 glass-panel rounded-2xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Book Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="e.g. The Architecture of Silence"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full py-3 px-4 bg-[#161618] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Author</label>
                <input 
                  type="text" 
                  name="author"
                  required
                  placeholder="e.g. Julian Barnes"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full py-3 px-4 bg-[#161618] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Category</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full py-3 pl-4 pr-10 bg-[#161618] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a genre</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Status (Styled as segmented control in reference, using select for simplicity but styling it nicely) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Reading Status</label>
                <div className="relative">
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full py-3 pl-4 pr-10 bg-[#161618] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all appearance-none cursor-pointer"
                  >
                    <option value="Not Started">To Read</option>
                    <option value="Reading">In Progress</option>
                    <option value="Completed">Finished</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Total Pages */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Total Pages</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="totalPages"
                    min="1"
                    value={formData.totalPages}
                    onChange={handleChange}
                    className="w-full py-3 pl-4 pr-16 bg-[#161618] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 text-sm">
                    Pages
                  </div>
                </div>
              </div>

              {/* Current Page */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Current Page</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="currentPage"
                    min="0"
                    max={formData.totalPages}
                    value={formData.currentPage}
                    onChange={handleChange}
                    className="w-full py-3 pl-4 pr-16 bg-[#161618] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500 text-sm">
                    Read
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6 flex items-center justify-end gap-4 border-t border-white/5">
              <button 
                type="button"
                onClick={() => navigate('/books')}
                className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#d97706] to-[#b45f06] rounded-xl hover:from-[#f59e0b] hover:to-[#d97706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161618] focus:ring-[#f59e0b] premium-shadow transition-all"
              >
                <BookOpen size={18} className="mr-2" />
                {isEditMode ? 'Update Archive' : 'Add to Library'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditBook;

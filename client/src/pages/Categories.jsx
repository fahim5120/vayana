import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Bookmark, Trash2, Plus, Search } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await api.post('/categories', { name: newCategoryName });
      setNewCategoryName('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading collections...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Collections</h2>
          <p className="mt-2 text-gray-400">Organize your archive into distinct thematic collections.</p>
        </div>
      </div>

      {error && <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

      <div className="p-2 glass-panel rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full py-3 pl-12 pr-4 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:ring-0 focus:outline-none"
            placeholder="Search collections..."
          />
        </div>
        <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>
        <form onSubmit={handleAddCategory} className="flex w-full md:w-auto gap-2 p-1">
          <input
            type="text"
            className="flex-1 md:w-64 px-4 py-2 bg-[#161618] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all text-sm"
            placeholder="New collection name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#d97706] to-[#b45f06] rounded-xl hover:from-[#f59e0b] hover:to-[#d97706] premium-shadow transition-all shrink-0"
          >
            <Plus size={16} className="mr-1.5" /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category._id} className="group relative overflow-hidden flex flex-col p-6 glass-panel rounded-2xl hover-elevate border border-white/5 cursor-pointer">
              {/* Subtle background glow effect */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#f59e0b]/10 blur-[30px] rounded-full group-hover:bg-[#f59e0b]/20 transition-colors"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <Bookmark size={20} className="text-[#f59e0b]" />
                </div>
                <button 
                  onClick={() => handleDeleteCategory(category._id)}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="mt-8 relative z-10">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#f59e0b] transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-500">Collection</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-panel border border-dashed rounded-2xl border-white/20">
            <p className="text-gray-400">No collections found. Create your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

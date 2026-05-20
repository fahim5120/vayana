import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#161618] selection:bg-[#f59e0b]/30">
      {/* Left side - Image & Branding */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-end">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Library" 
            className="object-cover w-full h-full opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161618] via-[#161618]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 p-16 max-w-2xl">
          <div className="flex items-center gap-3 mb-12 text-[#f59e0b]">
            <BookOpen size={32} />
            <span className="text-3xl font-bold tracking-tight">Vayana</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white leading-tight">Step back into your sanctuary of thought.</h2>
          <p className="text-lg text-gray-400 font-light max-w-md leading-relaxed">
            Manage your personal collection with the silence and focus it deserves.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2 sm:p-12">
        <div className="w-full max-w-md space-y-8 glass-panel p-10 rounded-2xl">
          
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8 text-[#f59e0b]">
            <BookOpen size={28} />
            <span className="text-2xl font-bold tracking-tight">Vayana</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">Access your private archive</p>
          </div>
          
          {error && (
            <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Library Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full py-3 pl-11 pr-4 bg-[#161618] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                  placeholder="name@archive.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Access Key</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="w-full py-3 pl-11 pr-4 bg-[#161618] border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group flex items-center justify-center w-full py-3.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[#d97706] to-[#b45f06] rounded-xl hover:from-[#f59e0b] hover:to-[#d97706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161618] focus:ring-[#f59e0b] transition-all disabled:opacity-70 premium-shadow"
            >
              {isLoading ? 'Authenticating...' : 'Unlock Library'}
              {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
          
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-400">
              New collector?{' '}
              <Link to="/register" className="font-semibold text-[#f59e0b] hover:text-[#fbbf24] transition-colors">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

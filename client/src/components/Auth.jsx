import React, { useState } from 'react';
import { authAPI } from '../api';
import { LogIn, UserPlus, Wallet } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = isLogin 
        ? await authAPI.login({ email, password })
        : await authAPI.register({ email, password });
      
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-3xl shadow-2xl border border-[#334155] animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#6366f1] p-3 rounded-2xl text-white mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Kharcha <span className="text-[#6366f1]">Tracker</span></h1>
          <p className="text-gray-400 text-sm mt-1">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        {error && (
          <div className="bg-[#ef4444]/10 text-[#ef4444] p-3 rounded-xl text-sm mb-6 border border-[#ef4444]/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required 
              className="w-full bg-[#334155] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              className="w-full bg-[#334155] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6366f1] outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#6366f1]/20 flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-[#6366f1] transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

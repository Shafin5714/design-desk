'use client';

import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

type AuthType = 'login' | 'register';

interface AuthModalProps {
  initialType: AuthType;
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ initialType, isOpen, onClose }: AuthModalProps) {
  const [type, setType] = useState<AuthType>(initialType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // Keep type synced if prop changes
  React.useEffect(() => {
    setType(initialType);
    setError('');
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'login') {
        const response = await api.post('/auth/login', { email, password });
        login(response.data.user, response.data.token);
      } else {
        const response = await api.post('/auth/register', { name, email, password });
        login(response.data.user, response.data.token);
      }
      onClose(); // Close modal
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = () => {
    setType(type === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container with gradient matching homepage */}
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Decorative Top Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#5e21d9] via-[#8d2de2] to-[#01b4e4]"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#5e21d9] to-[#01b4e4] flex items-center justify-center text-white shadow-lg mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {type === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {type === 'login' 
                ? 'Sign in to continue designing.' 
                : 'Join Design Desk and start creating amazing things.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {type === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8d2de2]/50 focus:border-[#8d2de2] transition-colors text-sm text-gray-900 placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8d2de2]/50 focus:border-[#8d2de2] transition-colors text-sm text-gray-900 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8d2de2]/50 focus:border-[#8d2de2] transition-colors text-sm text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg text-white font-semibold text-sm shadow-md bg-gradient-to-r from-[#5e21d9] via-[#8d2de2] to-[#01b4e4] hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {loading 
                ? (type === 'login' ? 'Signing in...' : 'Creating account...') 
                : (type === 'login' ? 'Sign in' : 'Sign up')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={toggleType}
              className="text-[#8d2de2] font-semibold hover:underline"
            >
              {type === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

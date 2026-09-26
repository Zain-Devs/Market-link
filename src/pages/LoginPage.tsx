import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: 'customer' | 'farmer' | 'admin') => {
    const creds = {
      customer: { email: 'customer@test.com', password: 'password' },
      farmer: { email: 'farmer@test.com', password: 'password' },
      admin: { email: 'admin@test.com', password: 'password' },
    };
    setForm(creds[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-green-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🌿</span>
            <span className="text-xs font-bold tracking-widest uppercase text-[#194D26]">
              MarketLink Access
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-stone-900 mb-6">
            Sign in to MarketLink
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#194D26] focus-within:bg-white transition">
                <Mail className="w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#194D26] focus-within:bg-white transition">
                <Lock className="w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#194D26] hover:bg-[#143e1f] text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In with Sanctum'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <div className="flex items-center gap-1.5 mb-3">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-medium text-stone-600">
                Quick Evaluation Logins:
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => quickLogin('customer')}
                className="flex-1 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-lg hover:bg-stone-50 transition"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => quickLogin('farmer')}
                className="flex-1 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-lg hover:bg-stone-50 transition"
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="flex-1 px-3 py-2 text-xs font-semibold border border-stone-200 rounded-lg hover:bg-stone-50 transition"
              >
                Admin
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-stone-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#194D26] underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
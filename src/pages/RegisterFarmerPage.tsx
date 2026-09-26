import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Phone, MapPin, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterFarmerPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', farmName: '', location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, role: 'farmer' });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <Sprout className="w-6 h-6 text-[#A6895C]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#A6895C]">
              Farmer Registration
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">
            Join as a Farmer
          </h1>
          <p className="text-xs text-stone-500 mb-6">
            Sell your harvest directly to the community.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#A6895C] focus-within:bg-white transition">
                <User className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Farm Name
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#A6895C] focus-within:bg-white transition">
                <Sprout className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Green Valley Farm"
                  required
                  value={form.farmName}
                  onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Location
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#A6895C] focus-within:bg-white transition">
                <MapPin className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="City, Region"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#A6895C] focus-within:bg-white transition">
                <Mail className="w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Phone
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#A6895C] focus-within:bg-white transition">
                <Phone className="w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#A6895C] focus-within:bg-white transition">
                <Lock className="w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#A6895C] hover:bg-[#8B6F44] text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register as Farmer'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-500">
            Just want to buy?{' '}
            <Link to="/register" className="font-semibold text-[#194D26] underline">
              Register as Customer
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Phone,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        ...form,
        role: 'customer',
      });

      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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

          {/* Logo / Heading */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🌿</span>
            <span className="text-xs font-bold tracking-widest uppercase text-[#194D26]">
              Join MarketLink
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-stone-900 mb-6">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Full Name
              </label>

              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#194D26] focus-within:bg-white transition">
                <User className="w-4 h-4 text-stone-400" />

                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Email */}
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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Phone (Optional)
              </label>

              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#194D26] focus-within:bg-white transition">
                <Phone className="w-4 h-4 text-stone-400" />

                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Address - ADDED */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Address
              </label>

              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl border border-stone-200 focus-within:border-[#194D26] focus-within:bg-white transition">
                <MapPin className="w-4 h-4 text-stone-400" />

                <input
                  type="text"
                  placeholder="Your address"
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#194D26] hover:bg-[#143e1f] text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Account'}

              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-xs text-stone-500">
            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold text-[#194D26] underline"
            >
              Sign in here
            </Link>
          </p>

          {/* Farmer */}
          <p className="mt-3 text-center text-xs text-stone-500">
            Want to sell?{' '}

            <Link
              to="/register-farmer"
              className="font-semibold text-[#A6895C] underline"
            >
              Join as Farmer
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
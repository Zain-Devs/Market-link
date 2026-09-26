import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sprout, ShoppingBag, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../types';
import { Modal3D } from './Modal3D';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  defaultRole?: 'customer' | 'farmer';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  defaultRole = 'customer'
}) => {
  const { login, register, switchDemoRole } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'farmer'>(defaultRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [stallName, setStallName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role: selectedRole,
          phone,
          address,
          stall_name: selectedRole === 'farmer' ? stallName : undefined
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <Modal3D>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">MarketLink Access</span>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              {mode === 'login' ? 'Sign in to MarketLink' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">I want to register as:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedRole === 'customer'
                        ? 'border-[#194D26] bg-emerald-50/70 text-[#194D26]'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('farmer')}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedRole === 'farmer'
                        ? 'border-[#194D26] bg-emerald-50/70 text-[#194D26]'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <Sprout className="w-4 h-4" />
                    <span>Farmer / Vendor</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
                />
              </div>

              {selectedRole === 'farmer' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Stall or Farm Name</label>
                  <input
                    type="text"
                    required
                    value={stallName}
                    onChange={(e) => setStallName(e.target.value)}
                    placeholder="e.g. High Creek Organics"
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Address / City</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Greenfield"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#194D26] hover:bg-[#143e1f] text-white font-medium rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{mode === 'login' ? 'Sign In with Sanctum' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Bar */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-[#194D26]" />
            <span className="font-semibold text-stone-700">Quick Evaluation Logins:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:border-stone-400 text-center"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer')}
              className="py-1.5 px-2 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:border-stone-400 text-center"
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white border border-stone-200 rounded text-[11px] font-medium text-stone-700 hover:border-stone-400 text-center"
            >
              Admin
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-stone-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-[#194D26] hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#194D26] hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
      </Modal3D>
    </div>
  );
};

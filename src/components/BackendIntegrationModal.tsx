import React, { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Server, Key, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import { UserRole } from '../types';
import { Modal3D } from './Modal3D';

interface BackendIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendIntegrationModal: React.FC<BackendIntegrationModalProps> = ({ isOpen, onClose }) => {
  const { user, token, role, switchDemoRole } = useAuth();
  const [mode, setMode] = useState<'mock' | 'live'>(api.getMode());
  const [baseUrl, setBaseUrl] = useState(api.getBaseUrl());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    api.setMode(mode);
    api.setBaseUrl(baseUrl);
    setTestStatus('idle');
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestResult(null);
    try {
      if (mode === 'mock') {
        const markets = await api.getMarkets();
        setTestStatus('success');
        setTestResult(`Mock Sandbox Healthy: ${markets.length} farmers markets and active Sanctum simulation active.`);
      } else {
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/markets`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          const json = await response.json();
          setTestStatus('success');
          setTestResult(`Laravel 10 Sanctum Connected (HTTP 200 OK)! Retrieved ${Array.isArray(json) ? json.length : 'active'} records.`);
        } else {
          setTestStatus('error');
          setTestResult(`Backend responded with HTTP ${response.status}: ${response.statusText}. Please verify CORS and Laravel server running on ${baseUrl}.`);
        }
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestResult(`Connection Failed: ${e.message}. Ensure your Laravel 10 server is running (e.g. 'php artisan serve' on port 8000) with CORS allowed in config/cors.php.`);
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'customer', title: 'Customer (Elena Rostova)', desc: 'Browse produce, map markets, place pre-orders, leave reviews' },
    { role: 'farmer', title: 'Farmer (Sarah Jenkins - Meadowbrook)', desc: 'Weekly stock catalog, manage pre-orders, pickup slots' },
    { role: 'admin', title: 'Admin Supervisor', desc: 'Approve farmers, manage markets, view reports & analytics' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <Modal3D>
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#194D26]/10 text-[#194D26] flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-base">Laravel 10 Sanctum Integration</h3>
              <p className="text-xs text-stone-500">API connection status, Sanctum token, and endpoint mapping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Environment Mode Switcher */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-stone-900 text-sm">Backend Engine Mode</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                mode === 'live' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {mode === 'live' ? 'Live Laravel Sanctum' : 'Integrated Mock Sandbox'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setMode('mock')}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                  mode === 'mock'
                    ? 'bg-[#194D26] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Mock Sandbox (Standalone)
              </button>
              <button
                type="button"
                onClick={() => setMode('live')}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                  mode === 'live'
                    ? 'bg-[#194D26] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Live Laravel 10 (Sanctum)
              </button>
            </div>

            <p className="text-xs text-stone-500 mt-2">
              {mode === 'live'
                ? 'All frontend requests will hit your running Laravel 10 backend via fetch() with Bearer Sanctum authorization.'
                : 'Runs instantly in this preview browser with complete mock persistence, allowing you to test the entire SRS flow right now.'}
            </p>
          </div>

          {/* Laravel Base URL Configuration */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Laravel API Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:8000/api"
                className="flex-1 px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#194D26] font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-4 py-2 text-xs font-semibold bg-[#194D26] text-white rounded-lg hover:bg-[#143e1f] transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                Test
              </button>
            </div>

            {testResult && (
              <div className={`mt-2 p-3 rounded-lg flex items-start gap-2 text-xs ${
                testStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {testStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{testResult}</span>
              </div>
            )}
          </div>

          {/* Sanctum Token & Active User */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-stone-500" />
                <span className="font-semibold text-xs text-stone-800 uppercase tracking-wider">Sanctum Bearer Token</span>
              </div>
              <button
                type="button"
                onClick={handleCopyToken}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedToken ? 'Copied' : 'Copy Token'}
              </button>
            </div>

            <div className="p-2.5 bg-white border border-stone-200 rounded-lg font-mono text-xs text-stone-600 break-all select-all">
              {token ? `Bearer ${token}` : 'No active token (Guest mode)'}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-stone-500">
              <span>Active User: <strong className="text-stone-800">{user ? user.name : 'Guest'}</strong></span>
              <span className="capitalize">Role: <strong className="text-[#194D26]">{role}</strong></span>
            </div>
          </div>

          {/* 1-Click Role Switcher for Fast Evaluation */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-[#194D26]" />
              <h4 className="font-semibold text-xs text-stone-800 uppercase tracking-wider">Instant Role Switcher (SRS Testing)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {roles.map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => switchDemoRole(r.role)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    role === r.role
                      ? 'border-[#194D26] bg-emerald-50/70 text-[#194D26] shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-[11px] text-stone-500 mt-1 line-clamp-2">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Laravel 10 Routes Verified Banner */}
          <div className="text-xs text-stone-500 bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Route Compatibility Ready</span>
            </div>
            <p>
              This React application communicates directly with your 34+ Laravel routes:
              <code className="mx-1 px-1 py-0.5 bg-stone-100 rounded text-stone-700">/auth/login</code>,
              <code className="mx-1 px-1 py-0.5 bg-stone-100 rounded text-stone-700">/markets</code>,
              <code className="mx-1 px-1 py-0.5 bg-stone-100 rounded text-stone-700">/products</code>,
              <code className="mx-1 px-1 py-0.5 bg-stone-100 rounded text-stone-700">/farmer/dashboard</code>,
              <code className="mx-1 px-1 py-0.5 bg-stone-100 rounded text-stone-700">/orders</code>,
              <code className="mx-1 px-1 py-0.5 bg-stone-100 rounded text-stone-700">/admin/dashboard</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-[#194D26] text-white rounded-lg hover:bg-[#143e1f] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
      </Modal3D>
    </div>
  );
};

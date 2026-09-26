import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Server, User as UserIcon, LogOut, LayoutDashboard, Heart, Package, ChevronDown } from 'lucide-react';
import { api } from '../api/client';
import { Tilt3D } from './Tilt3D';

interface NavbarProps {
  activeTab: 'browse' | 'markets' | 'farmers' | 'map' | 'orders' | 'favorites' | 'farmer-dash' | 'admin-dash' | 'product-detail';
  setActiveTab: (tab: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenBackendModal: () => void;
  onOpenAbout: () => void;
  onOpenAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenBackendModal,
  onOpenAbout,
  onOpenAi
}) => {
  const { user, role, logout } = useAuth();
  const { totalItems, setIsCartOpen, isCartBouncing } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const backendMode = api.getMode();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <Tilt3D maxTilt={14} lift={6} glare={false} scaleOnHover={1.04}>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-left group focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-[#194D26] group-hover:text-emerald-800 transition-colors">
              MarketLink
            </span>
          </button>
          </Tilt3D>
          <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide uppercase text-stone-400 pl-2 border-l border-stone-200">
            eGreen Basket
          </span>
        </div>

        {/* Zone 2: Navigation Links (Text with subtle hover underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('browse')}
            className={`transition-colors hover:text-stone-950 pb-0.5 ${
              activeTab === 'browse' || activeTab === 'product-detail' ? 'text-[#194D26] font-semibold border-b-2 border-[#194D26]' : ''
            }`}
          >
            Fresh Produce
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`transition-colors hover:text-stone-950 pb-0.5 ${
              activeTab === 'markets' ? 'text-[#194D26] font-semibold border-b-2 border-[#194D26]' : ''
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('farmers')}
            className={`transition-colors hover:text-stone-950 pb-0.5 ${
              activeTab === 'farmers' ? 'text-[#194D26] font-semibold border-b-2 border-[#194D26]' : ''
            }`}
          >
            Farmers
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`transition-colors hover:text-stone-950 pb-0.5 ${
              activeTab === 'map' ? 'text-[#194D26] font-semibold border-b-2 border-[#194D26]' : ''
            }`}
          >
            Map View
          </button>
          <button
            onClick={onOpenAbout}
            className="transition-colors hover:text-stone-950 pb-0.5"
          >
            About & Contact
          </button>
          <button
            onClick={onOpenAi}
            className="text-emerald-700 hover:text-emerald-900 transition-colors font-medium flex items-center gap-1"
          >
            <span>Ask eGreen</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Backend Status / Settings Button */}
          <button
            type="button"
            onClick={onOpenBackendModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              backendMode === 'live'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
            title="Laravel 10 Sanctum API Status"
          >
            <Server className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">
              {backendMode === 'live' ? 'Laravel Live' : 'Sanctum Mock'}
            </span>
          </button>

          {/* Cart / Pre-Orders Button with Dynamic Green Fill & Impact Animation */}
          <button
            type="button"
            id="navbar-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
              isCartBouncing ? 'animate-cart-impact' : ''
            } ${
              totalItems > 0
                ? 'bg-[#194D26] text-white shadow-md shadow-emerald-950/20 hover:bg-[#143e1f]'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
            title="Pre-Order Pickup Basket"
          >
            <ShoppingBag
              className={`w-5 h-5 transition-transform duration-300 ${
                totalItems > 0 ? 'fill-emerald-200 stroke-[#194D26]' : 'stroke-current'
              }`}
            />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 text-[11px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center tabular-nums shadow-sm border border-stone-900/10 animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Navigation */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-lg border border-stone-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#194D26] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-40 text-xs text-stone-700">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                      <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
                      <span className="inline-block mt-1 uppercase text-[10px] font-bold tracking-wider text-[#194D26] bg-emerald-50 px-1.5 py-0.5 rounded">
                        Role: {role}
                      </span>
                    </div>

                    {role === 'customer' && (
                      <>
                        <button
                          onClick={() => { setActiveTab('orders'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 font-medium"
                        >
                          <Package className="w-4 h-4 text-stone-500" />
                          <span>My Pre-Orders</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab('favorites'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 font-medium"
                        >
                          <Heart className="w-4 h-4 text-stone-500" />
                          <span>Saved Favorites</span>
                        </button>
                      </>
                    )}

                    {role === 'farmer' && (
                      <button
                        onClick={() => { setActiveTab('farmer-dash'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 font-medium text-[#194D26]"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Farmer Vendor Portal</span>
                      </button>
                    )}

                    {role === 'admin' && (
                      <button
                        onClick={() => { setActiveTab('admin-dash'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2 font-medium text-[#194D26]"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#194D26] text-white rounded-lg hover:bg-[#143e1f] transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

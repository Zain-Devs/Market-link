import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User as UserIcon, LogOut, LayoutDashboard, Heart, Package, ChevronDown } from 'lucide-react';
import { Tilt3D } from './Tilt3D';

interface NavbarProps {
  activeTab: 'browse' | 'markets' | 'farmers' | 'map' | 'orders' | 'favorites' | 'farmer-dash' | 'admin-dash' | 'product-detail';
  setActiveTab: (tab: any) => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAbout
}) => {
  const { user, role, logout } = useAuth();
  const { totalItems, setIsCartOpen, isCartBouncing } = useCart();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark with Custom SVG Logo */}
        <div className="flex items-center gap-3">
          <Tilt3D maxTilt={14} lift={6} glare={false} scaleOnHover={1.04}>
            <button
              onClick={() => setActiveTab('browse')}
              className="text-left group focus:outline-none flex items-center gap-2"
            >
              {/* Custom SVG Logo: Basket + Leaves + Location Pin */}
              <svg
                viewBox="0 0 64 64"
                className="h-10 w-10 shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Basket Handle (Arc) */}
                <path
                  d="M18 26 C18 12, 46 12, 46 26"
                  stroke="#194D26"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Basket Body (Trapezoid) */}
                <path
                  d="M12 26 L52 26 L47 54 C46.5 56, 45 57, 43 57 L21 57 C19 57, 17.5 56, 17 54 Z"
                  fill="#194D26"
                  stroke="#194D26"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Basket Rim (Top thick line) */}
                <rect
                  x="10"
                  y="23"
                  width="44"
                  height="6"
                  rx="3"
                  fill="#194D26"
                />

                {/* Vertical weave lines inside basket */}
                <line x1="22" y1="32" x2="21" y2="52" stroke="#F5F5F0" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="32" y1="32" x2="32" y2="52" stroke="#F5F5F0" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="42" y1="32" x2="43" y2="52" stroke="#F5F5F0" strokeWidth="1.8" strokeLinecap="round" />

                {/* Leaves on top (Left leaf) */}
                <path
                  d="M26 22 C26 14, 34 10, 38 14 C42 18, 36 24, 30 24 Z"
                  fill="#194D26"
                />
                {/* Leaves on top (Right leaf) */}
                <path
                  d="M34 22 C36 14, 44 12, 46 18 C48 24, 40 26, 36 24 Z"
                  fill="#4A7C59"
                />
                {/* Leaf veins */}
                <path
                  d="M28 22 C30 18, 34 15, 37 15"
                  stroke="#F5F5F0"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Location Pin (Brown) */}
                <path
                  d="M32 38 C32 38, 24 46, 24 51 C24 55.5, 27.6 58, 32 58 C36.4 58, 40 55.5, 40 51 C40 46, 32 38, 32 38 Z"
                  fill="#A6895C"
                  stroke="#8B6F44"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Inner circle of pin */}
                <circle cx="32" cy="50" r="2.8" fill="#F5F5F0" />
              </svg>

              {/* Brand Name Text (Market in Green + Link in Brown) */}
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-display">
                <span className="text-[#194D26] group-hover:text-emerald-800 transition-colors">
                  Market
                </span>
                <span className="text-[#A6895C] group-hover:text-[#8B6F44] transition-colors">
                  Link
                </span>
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
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
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
              {/* ✅ Yahan Link laga diya, ab popup ki jagah page khulega */}
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#194D26] text-white rounded-lg hover:bg-[#143e1f] transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { User, Product } from '../types';
import { MapPin, Calendar, Clock, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { api } from '../api/client';
import { Tilt3D } from './Tilt3D';
import { Scene3D } from './Scene3D';

interface FarmerDirectoryProps {
  farmers: User[];
  products: Product[];
  onOpenFarmerModal: (farmerId: number) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const FarmerDirectory: React.FC<FarmerDirectoryProps> = ({
  farmers,
  products,
  onOpenFarmerModal,
  onOpenProductDetail
}) => {
  return (
    <section className="relative py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 overflow-hidden">
      <Scene3D variant="section" className="absolute inset-0 -z-10 opacity-50" />
      {/* Header */}
      <div>
        <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Independent Producers</span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
          Meet Our Local Farmers & Artisans
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Support local regenerative agriculture. Connect directly with producers who grow your food.
        </p>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {farmers.map(farmer => {
          const profile = farmer.farmer_profile;
          if (!profile) return null;

          const farmerProducts = products.filter(p => p.farmer_id === farmer.id);

          return (
            <Tilt3D key={farmer.id} maxTilt={7} lift={14}>
            <div
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Farmer Info Banner */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.stall_name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-emerald-50 text-[#194D26] font-bold text-xl flex items-center justify-center border border-emerald-100">
                        {profile.stall_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold font-display text-stone-900">
                          {profile.stall_name}
                        </h3>
                        {profile.is_approved && (
                          <span title="Verified Producer">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Proprietor: {profile.contact_person}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenFarmerModal(farmer.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#194D26] hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View Stall</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {profile.bio || 'Local grower dedicated to fresh, seasonal, pesticide-free harvest.'}
                </p>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 rounded-xl p-3 border border-stone-100">
                  <div className="space-y-1">
                    <span className="text-stone-400 font-medium text-[11px] block">Operating Days</span>
                    <span className="font-semibold text-stone-800">{profile.operating_days.join(', ')}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-stone-400 font-medium text-[11px] block">Pickup Window</span>
                    <span className="font-semibold text-stone-800">{profile.pickup_windows[0] || 'Morning slots'}</span>
                  </div>
                </div>

                {/* Markets Selling At */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-[#194D26] shrink-0" />
                  <span>Stall Location: <strong className="text-stone-700">{profile.address}</strong></span>
                </div>
              </div>

              {/* Weekly Produce Preview */}
              <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
                  <span className="font-semibold text-stone-700 uppercase tracking-wider text-[10px]">
                    Current Stock ({farmerProducts.length} items)
                  </span>
                  <span>Direct Pre-Order</span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {farmerProducts.slice(0, 3).map(prod => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => onOpenProductDetail(prod)}
                      className="group flex-1 min-w-[130px] p-2 bg-white rounded-lg border border-stone-200 text-left hover:border-[#194D26] transition-colors"
                    >
                      <div className="aspect-square w-full rounded overflow-hidden bg-stone-100 mb-1.5">
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-[11px] font-semibold text-stone-900 truncate">
                        {prod.name}
                      </div>
                      <div className="text-[11px] font-mono tabular-nums text-[#194D26] font-bold">
                        ${prod.price.toFixed(2)} / {prod.unit}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            </Tilt3D>
          );
        })}
      </div>
    </section>
  );
};

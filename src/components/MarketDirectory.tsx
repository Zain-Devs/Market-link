import React, { useState } from 'react';
import { Market, User } from '../types';
import { OpenStreetMapViewer } from './OpenStreetMapViewer';
import { MapPin, Calendar, Clock, Navigation, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { Tilt3D } from './Tilt3D';
import { Scene3D } from './Scene3D';

interface MarketDirectoryProps {
  markets: Market[];
  farmers: User[];
  onSelectMarketForProducts: (marketId: number) => void;
  onOpenFarmerModal: (farmerId: number) => void;
}

export const MarketDirectory: React.FC<MarketDirectoryProps> = ({
  markets,
  farmers,
  onSelectMarketForProducts,
  onOpenFarmerModal
}) => {
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(markets[0]?.id || 1);
  const activeMarket = markets.find(m => m.id === selectedMarketId) || markets[0];

  // Find farmers present at this active market
  const marketFarmers = farmers.filter(f =>
    f.farmer_profile?.markets.some(m => m.id === activeMarket?.id)
  );

  return (
    <section className="relative py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 overflow-hidden">
      <Scene3D variant="section" className="absolute inset-0 -z-10 opacity-50" />
      {/* Header */}
      <div>
        <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Physical Pickup Hubs</span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
          Regional Farmers Markets
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore weekly market locations, operating schedules, and pickup points mapped with OpenStreetMap.
        </p>
      </div>

      {/* Embedded Map Section (SRS Section 1.6 & 1.8 OpenStreetMap integration) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-600">
          <span className="font-semibold text-stone-800 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-[#194D26]" />
            <span>Interactive OpenStreetMap Geolocation</span>
          </span>
          <span className="text-stone-400">Click marker or card to inspect pickup coordinates</span>
        </div>

        <OpenStreetMapViewer
          markets={markets}
          selectedMarketId={selectedMarketId}
          onSelectMarket={(m) => setSelectedMarketId(m.id)}
          className="h-[380px] w-full"
        />
      </div>

      {/* Markets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {markets.map(market => {
          const isSelected = market.id === activeMarket?.id;
          const assignedFarmers = farmers.filter(f =>
            f.farmer_profile?.markets.some(m => m.id === market.id)
          );

          return (
            <Tilt3D key={market.id} maxTilt={7} lift={14}>
            <div
              onClick={() => setSelectedMarketId(market.id)}
              className={`rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[#194D26] bg-emerald-50/20 shadow-md ring-1 ring-[#194D26]'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Header row */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#194D26]" />
                    <span className="font-medium text-stone-700">{market.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{market.stall_count || 20} Stalls</span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-stone-900 leading-snug">
                    {market.name}
                  </h3>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {market.description}
                </p>

                {/* Operating details */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Operating Days: <strong className="text-stone-800">{market.operating_days.join(', ')}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Pickup Hours: <strong className="text-stone-800">{market.timings}</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="text-stone-500 leading-tight">{market.address}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMarketForProducts(market.id);
                  }}
                  className="px-3.5 py-1.5 bg-[#194D26] text-white hover:bg-[#143e1f] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Browse Produce</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${market.latitude},${market.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-medium flex items-center gap-1"
                  title="Directions"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
            </Tilt3D>
          );
        })}
      </div>

      {/* Farmers Present at Selected Market */}
      {activeMarket && (
        <div className="pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900">
                Farmers at {activeMarket.name}
              </h3>
              <p className="text-xs text-stone-500">
                Verified growers with scheduled pickup stalls at this location
              </p>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {marketFarmers.length} registered farmers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketFarmers.map(farmer => (
              <div
                key={farmer.id}
                onClick={() => onOpenFarmerModal(farmer.id)}
                className="p-4 rounded-xl border border-stone-200/90 bg-white hover:border-[#194D26] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">
                    {farmer.farmer_profile?.stall_name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Contact: {farmer.name}
                  </p>
                  <p className="text-[11px] text-[#194D26] font-medium mt-1">
                    Pickup: {farmer.farmer_profile?.pickup_windows?.[0] || 'Morning slots'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

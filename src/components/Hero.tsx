import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ShieldCheck, Clock } from 'lucide-react';
import {
  basketHarvest3DImg,
  heroMarket3DImg,
  iconProduce3D,
  iconMarket3D,
  iconPickup3D,
  iconHoney3D
} from '../api/mockData';
import { Tilt3D } from './Tilt3D';
import { RevealText } from './RevealText';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  onExploreMarkets: () => void;
  onSelectCategory: (categoryId: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDay,
  setSelectedDay,
  onExploreMarkets,
  onSelectCategory
}) => {
  const days = ['All Days', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];

  const quick3DHighlights = [
    { title: 'Fresh Harvest', subtitle: 'Dawn picked greens', icon: iconProduce3D, catId: 1 },
    { title: 'Local Markets', subtitle: '3 Regional hubs', icon: iconMarket3D, action: onExploreMarkets },
    { title: 'Artisan Goods', subtitle: 'Honey & sourdough', icon: iconHoney3D, catId: 6 },
    { title: 'Zero Risk Pickup', subtitle: 'Pay cash at stall', icon: iconPickup3D }
  ];

  return (
    <section className="relative overflow-hidden border-b border-stone-900">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <img
          src={heroMarket3DImg}
          alt="MarketLink farmers market"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/75 to-[#0B2A15]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Search */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <RevealText
              as="h1"
              type="words"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Farm Fresh Just a Click Away.
            </RevealText>

            <p className="text-stone-200/80 text-base sm:text-lg max-w-xl leading-relaxed">
              Connect directly with verified local farmers in your valley. Reserve your weekly seasonal harvest before market day and collect your basket at the stall with zero pre-payment required.
            </p>

            {/* Functional Search Bar */}
            <Tilt3D maxTilt={4} lift={12} className="max-w-xl">
              <div className="bg-white p-2.5 rounded-2xl shadow-2xl space-y-3 transition-all focus-within:shadow-emerald-900/30">
                <div className="flex items-center px-3 py-1">
                  <Search className="w-5 h-5 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search heirloom tomatoes, honey, artisan sourdough, or stall..."
                    className="w-full px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100 overflow-x-auto px-1">
                  <span className="text-xs text-stone-400 font-medium pl-1 pr-1 shrink-0 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Market Day:
                  </span>
                  {days.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d === 'All Days' ? '' : d)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                        (d === 'All Days' && !selectedDay) || selectedDay === d
                          ? 'bg-[#194D26] text-white shadow-xs scale-102 font-semibold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </Tilt3D>

            {/* Proof Points */}
            <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">Verified Independent Growers</span>
              </div>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">Real-Time Stock Visibility</span>
              </div>
              <span aria-hidden="true" className="text-stone-500">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">OpenStreetMap Coordinates</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <Tilt3D maxTilt={8} lift={20}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 aspect-[4/3] bg-stone-800 group">
                <img
                  src={basketHarvest3DImg}
                  alt="MarketLink organic farm fresh harvest basket"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-lg sm:text-xl font-bold">
                    Pick Up at Greenfield Market
                  </h3>
                  <p className="text-xs text-stone-200 mt-1">
                    Wednesday & Saturday Mornings · Pay cash or scan at stall
                  </p>
                </div>
              </div>
            </Tilt3D>
          </motion.div>
        </div>

        {/* Quick Highlights */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quick3DHighlights.map((item, idx) => (
            <Tilt3D key={idx} maxTilt={12} lift={16} scaleOnHover={1.03}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (item.action) item.action();
                  else if (item.catId) onSelectCategory(item.catId);
                }}
                className="group p-3.5 bg-white/95 hover:bg-white rounded-2xl border border-white/60 shadow-xs hover:shadow-md transition-shadow duration-300 cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-13 h-13 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#194D26] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
};
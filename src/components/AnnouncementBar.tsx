import React, { useState } from 'react';
import { Sprout, Clock, ShieldCheck, MapPin, X, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onExploreMarkets: () => void;
  onExploreMap: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onExploreMarkets,
  onExploreMap
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#143e1f] text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/60 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-semibold text-white">
            🌱 Harvest Week Active:
          </span>
          <span className="text-emerald-200/90 hidden sm:inline">
            Greenfield & Valley Hubs open Wed & Sat · Direct farmer reservations with zero pre-payment.
          </span>
          <span className="text-emerald-200/90 sm:hidden">
            Wed & Sat Morning Stalls Active
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px]">
          <button
            type="button"
            onClick={onExploreMarkets}
            className="hover:text-white underline underline-offset-2 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View 3 Hub Schedules</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <span className="text-emerald-700">|</span>

          <button
            type="button"
            onClick={onExploreMap}
            className="hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>OpenStreetMap Navigator</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-emerald-400 hover:text-white p-0.5 rounded transition-colors"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

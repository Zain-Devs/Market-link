import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: any) => void;
  onOpenAbout: () => void;
  onOpenBackendModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAbout, onOpenBackendModal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-display text-white tracking-tight">MarketLink</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                eGreen Basket
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Empowering regional organic growers and community shoppers with transparent weekly harvest availability, stall mapping, and pre-order pickups.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Platform Directory</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-white transition-colors">
                  Fresh Produce Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('markets')} className="hover:text-white transition-colors">
                  Farmers Markets Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('farmers')} className="hover:text-white transition-colors">
                  Verified Local Producers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">
                  OpenStreetMap Location Finder
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Architecture */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">SRS & Technology</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Aptech TechWiz 7 Specification</li>
              <li>Theme: eGreen Basket</li>
              <li>Backend: Laravel 10 (Sanctum Auth)</li>
              <li>
                <button onClick={onOpenBackendModal} className="text-emerald-400 hover:text-emerald-300 underline">
                  Sanctum API Status & Endpoints
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Pre-Order Notice */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Pickup Guarantee</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              All pre-orders are paid in person at the farmer's stall upon pickup. No credit card required to pre-order. Inspect your produce directly before settling payment.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAbout}
                className="text-xs text-stone-300 hover:text-white underline font-medium"
              >
                About Team & Contact
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © 2026 MarketLink (Theme: eGreen Basket). Aptech TechWiz 7 Championship Submission.
          </div>
          <div className="flex items-center gap-4">
            <span>OpenStreetMap Geolocation</span>
            <span>·</span>
            <span>Laravel 10 Sanctum API</span>
            <span>·</span>
            <span>Zero Pre-Payment Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

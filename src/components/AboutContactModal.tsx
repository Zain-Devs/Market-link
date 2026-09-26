import React from 'react';
import { X, Sprout, MapPin, Mail, Phone, Clock, Award, ShieldCheck, Heart } from 'lucide-react';
import { Modal3D } from './Modal3D';

interface AboutContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs">
      <Modal3D>
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#194D26] flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#194D26]">Aptech TechWiz 7 · Theme: eGreen Basket</span>
              <h3 className="font-bold text-stone-900 text-lg font-display">About MarketLink & Contact Info</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-600 leading-relaxed">
          {/* Mission */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">Background & Necessity</h4>
            <p>
              Local farmers markets are booming as shoppers seek fresh, seasonal, and locally grown produce. However, customers rarely know in advance which farmers will be at a market on a given day, what stock they have, or at what price.
            </p>
            <p>
              <strong>MarketLink</strong> bridges local farmers and community shoppers on a unified web platform. Farmers publish weekly inventory and set pickup slots, while shoppers browse, view stall geolocations via OpenStreetMap, reserve produce, and pay directly at pickup.
            </p>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <span className="font-semibold text-stone-800 block text-xs">Project Specifications</span>
              <ul className="mt-1 space-y-1 text-stone-500">
                <li>• Project: MarketLink</li>
                <li>• Theme: eGreen Basket</li>
                <li>• Category: End-to-End Web Solutions</li>
                <li>• Framework: React 19 + Laravel 10 (Sanctum)</li>
              </ul>
            </div>
            <div>
              <span className="font-semibold text-stone-800 block text-xs">Pickup Policies</span>
              <ul className="mt-1 space-y-1 text-stone-500">
                <li>• Zero Online Payment: Settle at pickup</li>
                <li>• Market-Only Collection (No courier transit)</li>
                <li>• OpenStreetMap Geolocation Integration</li>
                <li>• Weekly Stock Visibility</li>
              </ul>
            </div>
          </div>

          {/* Contact Us (SRS Section 1.6 & 1.12) */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="font-bold text-stone-900 text-sm">Team Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <MapPin className="w-4 h-4 text-[#194D26]" />
                <span className="font-semibold text-stone-800 block">Headquarters</span>
                <p className="text-stone-500">142 Orchard Grove Blvd, Greenfield</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <Mail className="w-4 h-4 text-[#194D26]" />
                <span className="font-semibold text-stone-800 block">Support Email</span>
                <p className="text-stone-500 font-mono">support@marketlink.org</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                <Phone className="w-4 h-4 text-[#194D26]" />
                <span className="font-semibold text-stone-800 block">Direct Line</span>
                <p className="text-stone-500 font-mono">+1 (555) 019-2831</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#194D26] text-white rounded-lg text-xs font-semibold hover:bg-[#143e1f]"
          >
            Close
          </button>
        </div>
      </div>
      </Modal3D>
    </div>
  );
};

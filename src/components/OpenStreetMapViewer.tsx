import React, { useState } from 'react';
import { Market } from '../types';
import { MapPin, Navigation, Compass, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';

interface OpenStreetMapViewerProps {
  markets: Market[];
  selectedMarketId?: number | null;
  onSelectMarket?: (market: Market) => void;
  className?: string;
  zoomLevel?: number;
}

export const OpenStreetMapViewer: React.FC<OpenStreetMapViewerProps> = ({
  markets,
  selectedMarketId,
  onSelectMarket,
  className = 'h-96'
}) => {
  const [zoom, setZoom] = useState(13);
  const activeMarket = markets.find(m => m.id === selectedMarketId) || markets[0];
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>({
    lat: activeMarket ? activeMarket.latitude : 37.7749,
    lng: activeMarket ? activeMarket.longitude : -122.4194
  });

  const handleCenterMarket = (market: Market) => {
    setCurrentCenter({ lat: market.latitude, lng: market.longitude });
    if (onSelectMarket) onSelectMarket(market);
  };

  // Convert lat/lng to OpenStreetMap tile coordinates
  const lat2tile = (lat: number, z: number) => {
    return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
  };

  const lon2tile = (lon: number, z: number) => {
    return Math.floor((lon + 180) / 360 * Math.pow(2, z));
  };

  const centerTileX = lon2tile(currentCenter.lng, zoom);
  const centerTileY = lat2tile(currentCenter.lat, zoom);

  // 3x3 tile grid around center
  const tiles: { x: number; y: number; offsetX: number; offsetY: number }[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      tiles.push({
        x: centerTileX + dx,
        y: centerTileY + dy,
        offsetX: dx * 256,
        offsetY: dy * 256
      });
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 shadow-sm ${className}`}>
      {/* Map Tile Canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div className="relative w-[768px] h-[768px]">
          {tiles.map(tile => (
            <img
              key={`${zoom}-${tile.x}-${tile.y}`}
              src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
              alt="OpenStreetMap tile"
              className="absolute w-[256px] h-[256px] object-cover transition-opacity duration-300 filter contrast-[0.98] brightness-[1.02]"
              style={{
                left: `${384 + tile.offsetX - 128}px`,
                top: `${384 + tile.offsetY - 128}px`
              }}
              onError={(e) => {
                // Subtle fallback pattern if offline
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ))}
        </div>
      </div>

      {/* SVG Decorative Grid & Coordinate Overlay */}
      <div className="absolute inset-0 bg-emerald-950/5 pointer-events-none" />

      {/* Market Markers Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {markets.map((market, idx) => {
          const isSelected = market.id === activeMarket?.id;
          // Approximate relative pixel offsets from center for demo
          const dLat = (market.latitude - currentCenter.lat) * 2000 * (zoom / 12);
          const dLng = (market.longitude - currentCenter.lng) * 2000 * (zoom / 12);

          return (
            <div
              key={market.id}
              className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-auto transition-all duration-300 z-10"
              style={{
                transform: `translate(${dLng}px, ${-dLat}px)`
              }}
            >
              <button
                type="button"
                onClick={() => handleCenterMarket(market)}
                className={`group flex flex-col items-center focus:outline-none transition-transform ${
                  isSelected ? 'scale-110 z-20' : 'hover:scale-105 opacity-90'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md border whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#194D26] text-white border-emerald-900'
                      : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#194D26]'}`} />
                  <span>{market.name.split(' ')[0]}</span>
                </div>
                <div
                  className={`w-3 h-3 rotate-45 -mt-1.5 border-r border-b ${
                    isSelected ? 'bg-[#194D26] border-emerald-900' : 'bg-white border-stone-200'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setZoom(z => Math.min(16, z + 1))}
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm border border-stone-200 text-stone-700 hover:text-stone-950 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(z => Math.max(10, z - 1))}
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm border border-stone-200 text-stone-700 hover:text-stone-950 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => activeMarket && handleCenterMarket(activeMarket)}
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm border border-stone-200 text-stone-700 hover:text-[#194D26] flex items-center justify-center shadow-sm hover:bg-stone-50 transition-colors"
          title="Recenter"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Market Info Card */}
      {activeMarket && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200/80 shadow-lg z-20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span className="font-semibold text-[#194D26]">OpenStreetMap Integration</span>
                <span>·</span>
                <span className="font-mono tabular-nums">{activeMarket.latitude.toFixed(4)}, {activeMarket.longitude.toFixed(4)}</span>
              </div>
              <h4 className="font-semibold text-stone-900 text-sm">{activeMarket.name}</h4>
              <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">{activeMarket.address}</p>
            </div>
            <a
              href={`https://www.openstreetmap.org/?mlat=${activeMarket.latitude}&mlon=${activeMarket.longitude}#map=16/${activeMarket.latitude}/${activeMarket.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
              title="Open in OpenStreetMap"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-stone-100 text-xs text-stone-600">
            <span className="font-medium text-stone-700">Days: {activeMarket.operating_days.join(', ')}</span>
            <span>·</span>
            <span>{activeMarket.timings}</span>
          </div>
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 text-[10px] text-stone-500 bg-white/80 px-1.5 py-0.5 rounded shadow-xs z-10">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-stone-800">OpenStreetMap</a> contributors
      </div>
    </div>
  );
};

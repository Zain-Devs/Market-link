import React, { useEffect, useState } from 'react';
import { useCart, FlyingArrow } from '../context/CartContext';

interface ActiveFlight {
  id: number;
  progress: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  controlX: number;
  controlY: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

export const FlyingArrowOverlay: React.FC = () => {
  const { flyingArrows } = useCart();
  const [flights, setFlights] = useState<ActiveFlight[]>([]);
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (flyingArrows.length === 0) {
      setFlights([]);
      return;
    }

    // Initialize flights with dynamic natural curve
    const newFlights: ActiveFlight[] = flyingArrows.map(arrow => {
      // Dynamic arc control point:
      // Pull upwards higher if vertical distance is large, or curve to the side
      const midX = (arrow.startX + arrow.targetX) / 2;
      const arcHeight = Math.max(140, Math.abs(arrow.startY - arrow.targetY) * 0.45 + 80);
      const midY = Math.min(arrow.startY, arrow.targetY) - arcHeight;

      return {
        id: arrow.id,
        progress: 0,
        startX: arrow.startX,
        startY: arrow.startY,
        targetX: arrow.targetX,
        targetY: arrow.targetY,
        controlX: midX,
        controlY: midY,
        productName: arrow.productName,
        productImage: arrow.productImage,
        productPrice: arrow.productPrice,
        quantity: arrow.quantity || 1
      };
    });

    setFlights(newFlights);

    const startTime = performance.now();
    const duration = 720; // ms
    let animId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const p = Math.min(1, elapsed / duration);
      // Ease in-out cubic for realistic launch acceleration and snap into cart
      const easedProgress = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      setFlights(prev =>
        prev.map(f => ({
          ...f,
          progress: easedProgress
        }))
      );

      if (p >= 0.92) {
        // Trigger impact shockwave at target cart
        newFlights.forEach(f => {
          setShockwaves(sw => {
            if (sw.some(s => s.id === f.id)) return sw;
            return [...sw, { id: f.id, x: f.targetX, y: f.targetY }];
          });
        });
      }

      if (p < 1) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [flyingArrows]);

  // Clean shockwaves
  useEffect(() => {
    if (shockwaves.length > 0) {
      const timer = setTimeout(() => {
        setShockwaves([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [shockwaves]);

  if (flights.length === 0 && shockwaves.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* SVG Canvas for Dynamic Curved Glowing Flight Trajectory Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Luminous Emerald Gradient for Flight Laser */}
          <linearGradient id="emeraldFlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="1" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {flights.map(f => {
          const pathD = `M ${f.startX} ${f.startY} Q ${f.controlX} ${f.controlY} ${f.targetX} ${f.targetY}`;
          return (
            <g key={`svg-${f.id}`}>
              {/* Background ambient glowing trace */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeOpacity="0.35"
                filter="url(#laserGlow)"
              />

              {/* Animated high-velocity dashed flight tracer line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#emeraldFlightGradient)"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                strokeDashoffset={-f.progress * 180}
                strokeLinecap="round"
                className="opacity-90"
              />
            </g>
          );
        })}
      </svg>

      {/* Target Shockwave Rings on Cart Impact */}
      {shockwaves.map(sw => (
        <div
          key={`shock-${sw.id}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400 animate-shockwave pointer-events-none"
          style={{
            left: `${sw.x}px`,
            top: `${sw.y}px`,
            width: '60px',
            height: '60px'
          }}
        />
      ))}

      {/* Dynamic Flying Arrow Heads + Mini Product Thumbnails & Trailing Sparks */}
      {flights.map(f => {
        const t = f.progress;
        // Bezier interpolation
        const currentX = (1 - t) * (1 - t) * f.startX + 2 * (1 - t) * t * f.controlX + t * t * f.targetX;
        const currentY = (1 - t) * (1 - t) * f.startY + 2 * (1 - t) * t * f.controlY + t * t * f.targetY;

        // Tangent derivative for dynamic orientation
        const dx = 2 * (1 - t) * (f.controlX - f.startX) + 2 * t * (f.targetX - f.controlX);
        const dy = 2 * (1 - t) * (f.controlY - f.startY) + 2 * t * (f.targetY - f.controlY);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Dynamic scale & opacity physics
        const scale = t < 0.2 ? 0.7 + t * 2 : t > 0.85 ? Math.max(0.2, 1 - (t - 0.85) * 6) : 1.1;
        const opacity = t > 0.95 ? (1 - t) / 0.05 : 1;

        // Trailing sparks calculation (previous fractions along the curve)
        const trailOffsets = [0.035, 0.07, 0.11];

        return (
          <React.Fragment key={`flight-${f.id}`}>
            {/* Trailing Luminous Star Particles */}
            {trailOffsets.map((offset, i) => {
              const trailT = Math.max(0, t - offset);
              const tx = (1 - trailT) * (1 - trailT) * f.startX + 2 * (1 - trailT) * trailT * f.controlX + trailT * trailT * f.targetX;
              const ty = (1 - trailT) * (1 - trailT) * f.startY + 2 * (1 - trailT) * trailT * f.controlY + trailT * trailT * f.targetY;
              const pSize = Math.max(2, 6 - i * 1.5);
              const pOpacity = Math.max(0, (1 - offset * 8) * opacity * (1 - t * 0.4));

              return (
                <div
                  key={`spark-${f.id}-${i}`}
                  className="absolute rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${tx}px`,
                    top: `${ty}px`,
                    width: `${pSize}px`,
                    height: `${pSize}px`,
                    opacity: pOpacity
                  }}
                />
              );
            })}

            {/* Flying Arrow + Mini Product Crate Object */}
            <div
              className="absolute left-0 top-0 will-change-transform pointer-events-none"
              style={{
                transform: `translate3d(${currentX}px, ${currentY}px, 0px)`,
                opacity
              }}
            >
              <div
                className="flex items-center gap-2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `rotate(${angle}deg) scale(${scale})`
                }}
              >
                {/* Luminous Speed Tail */}
                <div className="w-16 h-3 bg-gradient-to-r from-transparent via-emerald-400/80 to-emerald-500 rounded-full blur-[1.5px] -mr-2" />

                {/* Flying 3D Mini Thumbnail Badge */}
                {f.productImage && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-white shadow-lg shrink-0 -mr-2 z-10">
                    <img
                      src={f.productImage}
                      alt={f.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* High-Impact Green Arrow Badge */}
                <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#194D26] text-white shadow-[0_0_24px_rgba(25,77,38,0.95)] border-2 border-emerald-300 ring-4 ring-emerald-500/40">
                  <svg
                    className="w-6 h-6 text-emerald-100 fill-emerald-200"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <polyline points="13 5 20 12 13 19" />
                  </svg>

                  {/* Quantity Indicator */}
                  {f.quantity > 1 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md font-mono border border-white">
                      +{f.quantity}
                    </span>
                  )}

                  {/* Sparkling Glow Pins */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping opacity-90" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

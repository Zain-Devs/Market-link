import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, CheckCircle2, ArrowRight } from 'lucide-react';

export const CartToastNotification: React.FC = () => {
  const { activeToast, dismissToast, setIsCartOpen, totalItems, totalAmount } = useCart();

  if (!activeToast) return null;

  const { product, quantity } = activeToast;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-toast">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-500/30 p-4 relative overflow-hidden ring-1 ring-stone-900/5">
        {/* Top subtle green indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-[#194D26]" />

        <div className="flex items-start gap-3.5">
          {/* Thumbnail */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 bg-[#194D26] text-white text-[9px] font-bold px-1 rounded-tl-md font-mono">
              x{quantity}
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Added to Farm Basket</span>
            </div>

            <h4 className="text-sm font-bold text-stone-900 truncate mt-0.5">
              {product.name}
            </h4>

            <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
              <span className="font-mono font-semibold text-stone-800">
                ${(product.price * quantity).toFixed(2)}
              </span>
              <span>·</span>
              <span className="truncate">{product.stall_name}</span>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={dismissToast}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action footer */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">
            Basket: <strong className="text-stone-900 font-mono">{totalItems} items</strong> (${totalAmount.toFixed(2)})
          </span>

          <button
            type="button"
            onClick={() => {
              dismissToast();
              setIsCartOpen(true);
            }}
            className="inline-flex items-center gap-1 text-[#194D26] font-bold hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <span>View Basket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { X, Trash2, Plus, Minus, Calendar, Clock, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  onOrderSuccess: (orderId: number) => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOrderSuccess, onOpenAuth }) => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();

  const [pickupDate, setPickupDate] = useState('2026-09-26');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('08:00 AM - 10:00 AM');
  const [pickupNotes, setPickupNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Group items by farmer
  const farmerId = items[0]?.product.farmer_id || 2;
  const marketId = items[0]?.product.market_id || 1;
  const farmerStallName = items[0]?.product.stall_name || 'Meadowbrook Organics';

  const handlePlaceOrder = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (items.length === 0) return;

    setError(null);
    setSubmitting(true);

    try {
      const order = await api.storeOrder({
        farmer_id: farmerId,
        market_id: marketId,
        pickup_date: pickupDate,
        pickup_time_slot: pickupTimeSlot,
        pickup_notes: pickupNotes,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      });

      clearCart();
      setIsCartOpen(false);
      onOrderSuccess(order.id);
    } catch (err: any) {
      setError(err.message || 'Failed to place pre-order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10" style={{ perspective: 1400 }}>
        <motion.div
          initial={{ opacity: 0, rotateY: 35, x: 40 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          exit={{ opacity: 0, rotateY: 25, x: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'right center' }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#194D26] font-semibold">
                Direct Pre-Order Basket
              </span>
              <h3 className="text-xl font-bold font-display text-stone-900 mt-0.5">
                Stall Pickup Reservation
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                {error}
              </div>
            )}

            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-stone-500 font-medium text-sm">Your pre-order basket is currently empty.</p>
                <p className="text-stone-400 text-xs max-w-xs mx-auto">
                  Browse fresh heirloom produce from our regional farmers and reserve your weekly harvest.
                </p>
              </div>
            ) : (
              <>
                {/* Farmer Stall Header */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#194D26]">
                    <span>Pickup Stall: {farmerStallName}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Reserved items will be hand-packed and tagged for collection at market day.
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Reserved Items ({items.length})
                  </span>

                  {items.map(item => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80"
                    >
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 text-xs truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] font-mono tabular-nums text-stone-500 mt-0.5">
                          ${item.product.price.toFixed(2)} / {item.product.unit}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-950"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-950"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pickup Window Selection (SRS Requirement) */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                    Select Pickup Window
                  </span>

                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Pickup Market Day</label>
                    <select
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#194D26]"
                    >
                      <option value="2026-09-26">Saturday, Sep 26 (Greenfield Market)</option>
                      <option value="2026-09-27">Sunday, Sep 27 (Oakridge Heritage Market)</option>
                      <option value="2026-09-30">Wednesday, Sep 30 (Midweek Morning Stall)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Time Slot</label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#194D26]"
                    >
                      <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Pick)</option>
                      <option value="10:30 AM - 01:00 PM">10:30 AM - 01:00 PM (Midday)</option>
                      <option value="01:00 PM - 02:30 PM">01:00 PM - 02:30 PM (Afternoon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Notes for Farmer (Optional)</label>
                    <input
                      type="text"
                      value={pickupNotes}
                      onChange={(e) => setPickupNotes(e.target.value)}
                      placeholder="e.g. Please select slightly greener bananas, bringing reusable tote"
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#194D26]"
                    />
                  </div>
                </div>

                {/* Cash at Pickup Disclosure (SRS Section 1.5 & 1.6: "orders are paid for at pickup") */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Pay at Stall Upon Pickup</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-500">
                    No credit card charge now. Inspect your fresh produce at the stall and settle payment directly in person (cash, check, or stall QR).
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50/80 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-stone-500">Total Pre-Order Amount:</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-950">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={handlePlaceOrder}
                className="w-full py-3 px-4 bg-[#194D26] hover:bg-[#143e1f] text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span>{user ? 'Confirm Pre-Order Pickup' : 'Sign In to Confirm Pre-Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { api } from '../api/client';
import { Package, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ExternalLink, RefreshCw, QrCode, X, Printer, MapPin, Calendar } from 'lucide-react';

interface CustomerOrdersViewProps {
  onBrowseProduce: () => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({ onBrowseProduce }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [selectedPassOrder, setSelectedPassOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this market pickup reservation?')) return;

    setCancellingId(orderId);
    try {
      await api.cancelOrder(orderId, 'Customer cancelled before morning cutoff.');
      await fetchOrders();
    } catch (e: any) {
      alert(e.message || 'Could not cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'placed':
        return (
          <span className="text-amber-800 bg-amber-50 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Placed · Awaiting Farmer Acceptance</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="text-blue-800 bg-blue-50 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Accepted · Preparing Basket</span>
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Ready for Stall Pickup</span>
          </span>
        );
      case 'completed':
        return (
          <span className="text-stone-800 bg-stone-100 border border-stone-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Picked Up & Settled</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-rose-800 bg-rose-50 border border-rose-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Customer Portal</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
            My Pre-Order Pickup History
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track stall preparation, pickup windows, and order statuses in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="p-2 text-stone-500 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs font-medium self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-stone-400 text-xs">Loading your pre-orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
          <Package className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">No pre-orders placed yet</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Reserve fresh seasonal harvest from local farmers before market day to guarantee availability.
          </p>
          <button
            type="button"
            onClick={onBrowseProduce}
            className="px-4 py-2 bg-[#194D26] text-white rounded-lg text-xs font-semibold hover:bg-[#143e1f] transition-colors"
          >
            Browse Fresh Produce
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
            >
              {/* Order Header */}
              <div className="p-5 bg-stone-50/80 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-stone-900 text-sm">{order.order_number}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-xs text-stone-500">
                      Reserved {new Date(order.order_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Farmer Stall: <strong className="text-stone-900">{order.stall_name}</strong> ({order.farmer_name})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.order_status)}
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 space-y-4">
                {/* Pickup Window Card */}
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#194D26]">
                      Pickup Slot: {order.pickup_date} · {order.pickup_time_slot}
                    </div>
                    <div className="text-stone-600">
                      Location: {order.market_name} ({order.market_address})
                    </div>
                    {order.pickup_notes && (
                      <div className="text-stone-500 italic mt-1">
                        Note: "{order.pickup_notes}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedPassOrder(order)}
                      className="px-3 py-1.5 bg-[#194D26] text-white hover:bg-[#143e1f] rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Digital Pickup Pass</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.market_address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-white border border-emerald-200 text-[#194D26] hover:bg-emerald-50 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Reserved Produce Items
                  </span>
                  <div className="divide-y divide-stone-100">
                    {order.items.map(item => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover bg-stone-100"
                            />
                          )}
                          <div>
                            <div className="font-semibold text-stone-900">{item.product_name}</div>
                            <div className="text-stone-500 text-[11px]">
                              {item.quantity} {item.unit}s @ ${item.unit_price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                          ${item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total & Cancellation row */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs text-stone-500">
                    Payment Method: <span className="font-medium text-stone-800">Cash / QR at Pickup</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-stone-400 mr-2">Total:</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-stone-950">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>

                    {order.can_cancel && order.order_status === 'placed' && (
                      <button
                        type="button"
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                      >
                        {cancellingId === order.id ? 'Cancelling...' : 'Cancel Reservation'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Pickup Pass / QR Code Modal */}
      {selectedPassOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-toast">
            {/* Header */}
            <div className="bg-[#194D26] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedPassOrder(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                Official Pre-Order Pass
              </div>
              <h3 className="text-xl font-bold font-display mt-0.5">
                Stall Collection Voucher
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1">
                Show this barcode or pass at the grower's stall on market morning.
              </p>
            </div>

            {/* Pass Content */}
            <div className="p-6 space-y-5 bg-stone-50">
              {/* QR Code Mockup Graphic */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center text-center space-y-3">
                <div className="w-36 h-36 bg-stone-50 border-2 border-stone-900 rounded-xl p-2.5 flex items-center justify-center">
                  <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100">
                    <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                    <rect x="12" y="12" width="14" height="14" fill="currentColor" />
                    <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                    <rect x="74" y="12" width="14" height="14" fill="currentColor" />
                    <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" rx="2" />
                    <rect x="12" y="74" width="14" height="14" fill="currentColor" />
                    <rect x="42" y="10" width="8" height="8" fill="currentColor" />
                    <rect x="42" y="24" width="8" height="8" fill="currentColor" />
                    <rect x="10" y="42" width="8" height="8" fill="currentColor" />
                    <rect x="24" y="42" width="8" height="8" fill="currentColor" />
                    <rect x="40" y="40" width="20" height="20" fill="currentColor" rx="2" />
                    <rect x="68" y="42" width="10" height="8" fill="currentColor" />
                    <rect x="85" y="42" width="8" height="18" fill="currentColor" />
                    <rect x="42" y="68" width="8" height="12" fill="currentColor" />
                    <rect x="42" y="85" width="16" height="8" fill="currentColor" />
                    <rect x="68" y="68" width="12" height="12" fill="currentColor" />
                    <rect x="85" y="70" width="8" height="22" fill="currentColor" />
                  </svg>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Reservation Verification Code</span>
                  <span className="text-base font-extrabold font-mono text-stone-900 tracking-wider">
                    {selectedPassOrder.order_number}
                  </span>
                </div>
              </div>

              {/* Stall and Pickup Details */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Grower Stall:</span>
                  <span className="font-bold text-stone-900">{selectedPassOrder.stall_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Market Hub:</span>
                  <span className="font-semibold text-stone-800">{selectedPassOrder.market_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Pickup Date & Time:</span>
                  <span className="font-bold text-[#194D26]">{selectedPassOrder.pickup_date} · {selectedPassOrder.pickup_time_slot}</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-stone-900">Total at Collection:</span>
                  <span className="font-extrabold font-mono text-emerald-800">${selectedPassOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 bg-stone-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPassOrder(null)}
                  className="py-3 px-4 bg-white border border-stone-200 rounded-xl font-semibold text-xs text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { User, Product, Review } from '../types';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { X, MapPin, Calendar, Clock, ShieldCheck, Plus, Check, Star, MessageSquare } from 'lucide-react';
import { Modal3D } from './Modal3D';

interface FarmerProfileModalProps {
  farmerId: number | null;
  onClose: () => void;
  onOpenProductDetail: (product: Product) => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmerId,
  onClose,
  onOpenProductDetail
}) => {
  const [farmer, setFarmer] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart, items: cartItems } = useCart();

  useEffect(() => {
    if (farmerId) {
      setLoading(true);
      Promise.all([
        api.getFarmer(farmerId),
        api.getProducts({ farmer_id: farmerId }),
        api.getFarmerReviews(farmerId)
      ])
        .then(([f, prods, revs]) => {
          setFarmer(f);
          setProducts(prods);
          setReviews(revs);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [farmerId]);

  if (!farmerId || !farmer) return null;

  const profile = farmer.farmer_profile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs">
      <Modal3D>
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-stone-50 border-b border-stone-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white text-stone-500 hover:text-stone-900 shadow-sm border border-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.stall_name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-[#194D26] font-bold text-2xl flex items-center justify-center shrink-0">
                {profile?.stall_name?.charAt(0) || 'F'}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-display text-stone-900">
                  {profile?.stall_name}
                </h2>
                {profile?.is_approved && (
                  <span title="Verified Farm Producer">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600">
                Contact: <strong className="text-stone-800">{profile?.contact_person}</strong> · {profile?.contact_number}
              </p>
              <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
                {profile?.bio}
              </p>
            </div>
          </div>

          {/* Logistics metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-stone-200/80 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Operating Days</span>
              <span className="font-semibold text-stone-800">{profile?.operating_days.join(', ')}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Pickup Slots</span>
              <span className="font-semibold text-stone-800">{profile?.pickup_windows.join(' / ')}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Stall Address</span>
              <span className="font-semibold text-stone-800 truncate block">{profile?.address}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm">
          {/* Products List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900 text-lg font-display">
                Weekly Available Harvest ({products.length})
              </h3>
              <span className="text-xs text-stone-500">Pick up at stall</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(prod => {
                const inCart = cartItems.find(i => i.product.id === prod.id);

                return (
                  <div
                    key={prod.id}
                    className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl flex items-center justify-between gap-3 hover:border-stone-300 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => {
                        onClose();
                        onOpenProductDetail(prod);
                      }}
                    >
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-stone-900 text-xs truncate hover:text-[#194D26]">
                          {prod.name}
                        </h4>
                        <div className="text-[11px] font-mono tabular-nums text-stone-700 font-bold mt-0.5">
                          ${prod.price.toFixed(2)} / {prod.unit}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={prod.is_sold_out || prod.stock_quantity <= 0}
                      onClick={(e) => addToCart(prod, 1, e)}
                      className={`p-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                        prod.is_sold_out
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : inCart
                          ? 'bg-emerald-100 text-[#194D26]'
                          : 'bg-[#194D26] text-white hover:bg-[#143e1f]'
                      }`}
                      title="Add to pre-order"
                    >
                      {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Farmer Reviews */}
          <div className="border-t border-stone-200 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#194D26]" />
              <h3 className="font-bold text-stone-900 text-base font-display">Customer Feedback for Stall</h3>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500">No stall-level feedback posted yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{r.customer_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </Modal3D>
    </div>
  );
};

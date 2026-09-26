import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { api } from '../api/client';
import { Heart, ArrowRight, Star, ShoppingBag, Sprout } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FavoritesViewProps {
  onOpenProductDetail: (product: Product) => void;
  onOpenFarmerModal: (farmerId: number) => void;
  onBrowseProduce: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  onOpenProductDetail,
  onOpenFarmerModal,
  onBrowseProduce
}) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favoriteFarmers, setFavoriteFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchFavs = async () => {
    setLoading(true);
    try {
      const res = await api.getFavorites();
      setFavoriteProducts(res.products);
      setFavoriteFarmers(res.farmers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  return (
    <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Saved Collection</span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
          My Favorite Farms & Produce
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Quickly re-order favorite seasonal goods and follow local producers for harvest updates.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-stone-400 text-xs">Loading favorites...</div>
      ) : favoriteProducts.length === 0 && favoriteFarmers.length === 0 ? (
        <div className="py-20 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
          <Heart className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">No favorites saved yet</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Click the heart icon on any product or farm stall while browsing to save it here for fast re-ordering.
          </p>
          <button
            type="button"
            onClick={onBrowseProduce}
            className="px-4 py-2 bg-[#194D26] text-white rounded-lg text-xs font-semibold hover:bg-[#143e1f] transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Favorite Products */}
          {favoriteProducts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-lg font-display flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#194D26]" />
                <span>Favorite Produce Items ({favoriteProducts.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {favoriteProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => onOpenProductDetail(prod)}
                    className="p-4 bg-white rounded-2xl border border-stone-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-[#194D26] uppercase tracking-wider block">
                        {prod.category_name}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm mt-0.5">{prod.name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{prod.stall_name}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                        ${prod.price.toFixed(2)} / {prod.unit}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="px-3 py-1 bg-[#194D26] text-white rounded-lg text-xs font-medium hover:bg-[#143e1f]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Farmers */}
          {favoriteFarmers.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="font-bold text-stone-900 text-lg font-display flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#194D26]" />
                <span>Favorite Farm Stalls ({favoriteFarmers.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteFarmers.map(farmer => (
                  <div
                    key={farmer.id}
                    onClick={() => onOpenFarmerModal(farmer.id)}
                    className="p-4 bg-white rounded-xl border border-stone-200 hover:border-[#194D26] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{farmer.farmer_profile?.stall_name}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Proprietor: {farmer.name}</p>
                      <p className="text-[11px] text-[#194D26] font-medium mt-1">
                        Days: {farmer.farmer_profile?.operating_days.join(', ')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory, Market } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Check, Star, Filter, Heart, Eye } from 'lucide-react';
import { api } from '../api/client';
import { Tilt3D } from './Tilt3D';

interface ProductCatalogProps {
  products: Product[];
  categories: ProductCategory[];
  markets: Market[];
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  selectedMarketId: number | null;
  setSelectedMarketId: (id: number | null) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenFarmerModal: (farmerId: number) => void;
  searchQuery: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  markets,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedMarketId,
  setSelectedMarketId,
  onOpenProductDetail,
  onOpenFarmerModal,
  searchQuery
}) => {
  const { addToCart, items: cartItems } = useCart();
  const [maxPrice, setMaxPrice] = useState<number>(25);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating' | 'stock'>('featured');
  const [favorites, setFavorites] = useState<number[]>([1]); // initial favorite

  const handleToggleFavorite = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    try {
      const res = await api.toggleFavorite(productId, 'product');
      if (res.favorited) {
        setFavorites(prev => [...prev, productId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== productId));
      }
    } catch {
      // Toggle locally
      setFavorites(prev =>
        prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      );
    }
  };

  const filteredProducts = products
    .filter(p => {
      if (selectedCategoryId && p.category_id !== selectedCategoryId) return false;
      if (selectedMarketId && p.market_id !== selectedMarketId) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && (p.is_sold_out || p.stock_quantity <= 0)) return false;
      if (organicOnly && !p.organic_certified) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.stall_name.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating_avg || 5) - (a.rating_avg || 5);
      if (sortBy === 'stock') return b.stock_quantity - a.stock_quantity;
      return 0; // featured default order
    });

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200"
      >
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Weekly Harvest Catalog</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
            Available for Market Pickup
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse current stock from verified regional growers. Quantities updated directly by farmers.
          </p>
        </div>

        {/* Count Indicator */}
        <div className="text-xs text-stone-500">
          Showing <span className="font-semibold text-stone-900 tabular-nums">{filteredProducts.length}</span> items
        </div>
      </motion.div>

      {/* Filter Bar (Interactive segmented controls) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="py-6 space-y-4"
      >
        {/* Category Selector with 3D Rendered Icons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              selectedCategoryId === null
                ? 'bg-[#194D26] text-white shadow-sm scale-102 ring-2 ring-[#194D26]/20'
                : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            <span>All Categories</span>
          </motion.button>
          {categories.map(cat => (
            <motion.button
              whileTap={{ scale: 0.94 }}
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
                selectedCategoryId === cat.id
                  ? 'bg-[#194D26] text-white shadow-sm scale-102 ring-2 ring-[#194D26]/20'
                  : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              {cat.icon && (
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-5 h-5 rounded-md object-cover shadow-2xs"
                />
              )}
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Secondary Filters: Market, Sort By, Price Slider & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Market Filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Market:</span>
              <select
                value={selectedMarketId || ''}
                onChange={(e) => setSelectedMarketId(e.target.value ? Number(e.target.value) : null)}
                className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#194D26]"
              >
                <option value="">All Farmers Markets</option>
                {markets.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#194D26]"
              >
                <option value="featured">Featured / Harvest Curated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated Growers</option>
                <option value="stock">Highest Stock Remaining</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Max Price:</span>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-[#194D26] cursor-pointer"
              />
              <span className="font-semibold text-stone-800 tabular-nums">${maxPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Organic Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="rounded text-[#194D26] focus:ring-[#194D26] w-4 h-4 cursor-pointer accent-[#194D26]"
              />
              <span className="text-[#194D26] font-semibold">Certified Organic</span>
            </label>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#194D26] focus:ring-[#194D26] w-4 h-4 cursor-pointer accent-[#194D26]"
              />
              <span>In-Stock Only</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Product Grid (3-column desktop baseline with uniform cards) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p className="text-stone-500 text-sm">No produce items found matching your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId(null);
              setSelectedMarketId(null);
              setMaxPrice(25);
              setInStockOnly(false);
            }}
            className="mt-3 text-xs font-semibold text-[#194D26] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProducts.map(product => {
            const isFav = favorites.includes(product.id);
            const inCart = cartItems.find(item => item.product.id === product.id);

            return (
              <Tilt3D key={product.id} maxTilt={7} lift={14} scaleOnHover={1.015}>
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
                onClick={() => onOpenProductDetail(product)}
                className="group relative bg-[#FAF9F6] border border-stone-200/90 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer hover:border-[#194D26]/40"
              >
                {/* Image Container (65%-75% card visual emphasis) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Top Action Overlay: Favorite & Stock tag */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <div>
                      {product.is_sold_out || product.stock_quantity <= 0 ? (
                        <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
                          Sold Out
                        </span>
                      ) : product.stock_quantity <= 10 ? (
                        <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
                          Low Stock: {product.stock_quantity} {product.unit}s left
                        </span>
                      ) : (
                        <span className="bg-emerald-800/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
                          Harvest Fresh
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, product.id)}
                      className="p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-500 hover:text-rose-600 shadow-sm pointer-events-auto transition-colors"
                      title="Save to favorites"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Clean unboxed metadata per Zero-Pill rule */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <span className="uppercase tracking-wider font-semibold text-[11px] text-[#194D26]">
                        {product.category_name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenFarmerModal(product.farmer_id);
                        }}
                        className="hover:text-stone-900 hover:underline font-medium text-stone-600 truncate max-w-[150px]"
                      >
                        {product.stall_name}
                      </button>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-base font-bold text-stone-900 mt-1 group-hover:text-[#194D26] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-stone-500">/ {product.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-stone-800">{product.rating_avg?.toFixed(1) || '5.0'}</span>
                        <span>({product.reviews_count || 0})</span>
                      </div>
                    </div>

                    {/* Pre-Order Quick Button with Flying Arrow Trigger */}
                    <button
                      type="button"
                      disabled={product.is_sold_out || product.stock_quantity <= 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1, e);
                      }}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                        product.is_sold_out
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : inCart
                          ? 'bg-emerald-100 text-[#194D26] hover:bg-emerald-200 font-bold'
                          : 'bg-[#194D26] text-white hover:bg-[#143e1f] shadow-sm hover:shadow-md'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added ({inCart.quantity})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pre-Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
              </Tilt3D>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

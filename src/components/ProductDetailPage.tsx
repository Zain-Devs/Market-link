import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, Review, Market } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Tilt3D } from './Tilt3D';
import {
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Package,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { iconPickup3D, iconProduce3D } from '../api/mockData';

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onOpenFarmerModal: (farmerId: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onOpenFarmerModal,
  onSelectProduct
}) => {
  const { addToCart, items: cartItems } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Review submission
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setQuantity(1);

    Promise.all([
      api.getProduct(productId),
      api.getProductReviews(productId),
      api.getProducts()
    ])
      .then(([prod, revs, allProds]) => {
        setProduct(prod);
        setReviews(revs);
        const related = allProds
          .filter(p => p.id !== prod.id && (p.category_id === prod.category_id || p.farmer_id === prod.farmer_id))
          .slice(0, 3);
        setRelatedProducts(related);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500 text-sm">
          <div className="w-5 h-5 border-2 border-[#194D26] border-t-transparent rounded-full animate-spin" />
          <span>Loading farm fresh product details...</span>
        </div>
      </div>
    );
  }

  const inCart = cartItems.find(item => item.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    addToCart(product, quantity, e);
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await api.toggleFavorite(product.id, 'product');
      setIsFavorited(res.favorited);
    } catch {
      setIsFavorited(!isFavorited);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const created = await api.storeReview({
        reviewable_type: 'product',
        reviewable_id: product.id,
        rating: newRating,
        comment: newComment.trim()
      });
      setReviews(prev => [created, ...prev]);
      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#194D26] transition-colors p-2 rounded-xl hover:bg-stone-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Rich Product Visuals & Origins */}
        <div className="lg:col-span-6 space-y-6">
          <Tilt3D maxTilt={9} lift={22}>
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100 aspect-[4/3] group">
            <img
              src={product.image_url}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />

            {/* Organic certification badge */}
            {product.organic_certified && (
              <div className="absolute top-4 left-4 bg-[#194D26]/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Certified Organic / Pesticide-Free</span>
              </div>
            )}

            {/* Floating 3D Ready Badge */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/80 flex items-center gap-2.5">
              <img
                src={iconPickup3D}
                alt="3D Pickup crate"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="pr-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Stall Ready</span>
                <span className="text-xs font-extrabold text-stone-900 font-mono">100% Guaranteed</span>
              </div>
            </div>
          </div>
          </Tilt3D>

          {/* Farmer Stall Callout Card */}
          <div
            onClick={() => onOpenFarmerModal(product.farmer_id)}
            className="p-5 rounded-2xl border border-stone-200 bg-gradient-to-r from-emerald-50/50 to-stone-50 hover:border-[#194D26]/50 transition-all cursor-pointer flex items-center justify-between shadow-xs hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#194D26] text-white flex items-center justify-center font-bold text-lg font-display shadow-xs">
                {product.stall_name.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#194D26]">Grown & Harvested By</span>
                <h4 className="text-base font-bold text-stone-900 font-display">{product.stall_name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">Proprietor: {product.farmer_name} · {product.market_name || 'Regional Market'}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#194D26] bg-white px-3 py-1.5 rounded-lg border border-emerald-100 shadow-2xs">
              View Stall &rarr;
            </span>
          </div>

          {/* Harvest & Quality Attributes */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-400 block font-medium">Harvest Window</span>
              <span className="font-semibold text-stone-900 text-sm">{product.harvest_date || 'Dawn of Market Day'}</span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-400 block font-medium">Customer Rating</span>
              <div className="flex items-center gap-1 font-semibold text-stone-900 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating_avg?.toFixed(1) || '5.0'}</span>
                <span className="text-xs text-stone-500 font-normal">({product.reviews_count || reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Stock, Quantity & Pre-Order Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase font-bold tracking-wider text-[#194D26] bg-emerald-50 px-2.5 py-1 rounded-md">
                {product.category_name}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-medium">Direct Producer Pre-Order</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-4xl font-extrabold font-mono tabular-nums text-stone-950">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-stone-500">per {product.unit}</span>
            </div>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Stock Availability */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Weekly Inventory Status:</span>
              {product.is_sold_out || product.stock_quantity <= 0 ? (
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Sold Out</span>
              ) : (
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {product.stock_quantity} {product.unit}s available
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  product.stock_quantity > 10 ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(10, (product.stock_quantity / 50) * 100))}%`
                }}
              />
            </div>
          </div>

          {/* Purchase Action Box */}
          {(!product.is_sold_out && product.stock_quantity > 0) ? (
            <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-700 block">Select Quantity</span>
                  <span className="text-[11px] text-stone-500">Unit: {product.unit}</span>
                </div>

                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 text-stone-600 hover:text-stone-950 transition-colors rounded-lg hover:bg-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-stone-900 font-mono text-base tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                    className="p-2 text-stone-600 hover:text-stone-950 transition-colors rounded-lg hover:bg-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add To Cart with Flying Green Arrow */}
              <button
                type="button"
                onClick={(e) => handleAdd(e)}
                className="w-full py-4 px-6 bg-[#194D26] hover:bg-[#143e1f] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-base active:scale-98 group cursor-pointer"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>
                  {inCart ? `Add ${quantity} More to Pre-Order Basket` : `Add ${quantity} to Pre-Order Basket`} · ${(product.price * quantity).toFixed(2)}
                </span>
              </button>

              {/* SRS Payment Disclosure */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                <div className="font-bold text-[#194D26] flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>No Pre-Payment Required</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Per the MarketLink project specification, pre-orders are confirmed immediately and settled in person upon collection at the farmer's stall.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-stone-100 rounded-2xl text-center space-y-2">
              <h4 className="font-bold text-stone-800 text-sm">Currently Unavailable for this Cycle</h4>
              <p className="text-stone-500 text-xs">
                Check back for next week's morning harvest or explore related produce below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="pt-10 border-t border-stone-200 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#194D26]" />
            <h3 className="font-bold text-stone-900 text-xl font-display">Customer Feedback & Reviews</h3>
          </div>
          <span className="text-xs text-stone-500 font-mono tabular-nums font-semibold">
            {reviews.length} Verified Reviews
          </span>
        </div>

        {/* Post a Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Share Your Experience</h4>
              <p className="text-xs text-stone-500">Rate the produce freshness and pickup convenience</p>
            </div>

            {/* Star Rating Picker */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your honest thoughts about the taste, texture, and stall experience..."
            className="w-full text-xs sm:text-sm p-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#194D26]"
          />

          <div className="flex items-center justify-between">
            {reviewSuccess && (
              <span className="text-xs font-semibold text-emerald-700">Thank you! Your review was recorded.</span>
            )}
            <button
              type="submit"
              disabled={submittingReview}
              className="ml-auto px-5 py-2 bg-[#194D26] text-white text-xs font-bold rounded-xl hover:bg-[#143e1f] transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.18 } }}
              key={rev.id}
              className="p-4 bg-white rounded-2xl border border-stone-200/90 text-xs space-y-2.5 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{rev.customer_name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-stone-400">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-stone-600 leading-relaxed">{rev.comment}</p>

              {rev.farmer_reply && (
                <div className="p-3 bg-emerald-50 rounded-xl border-l-3 border-[#194D26] text-[11px] space-y-1">
                  <span className="font-bold text-[#194D26] block">Farmer Response ({product.stall_name}):</span>
                  <p className="text-stone-700">{rev.farmer_reply.reply}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Related Seasonal Produce */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-10 border-t border-stone-200 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#194D26]">You Might Also Like</span>
              <h3 className="font-bold text-stone-900 text-xl font-display mt-0.5">More from this Farmer & Category</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel, idx) => (
              <Tilt3D key={rel.id} maxTilt={7} lift={12}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => onSelectProduct(rel)}
                className="group p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#194D26]/40 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={rel.image_url}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#194D26] uppercase tracking-wider block">{rel.category_name}</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-0.5 group-hover:text-[#194D26] transition-colors">{rel.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{rel.stall_name}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                    ${rel.price.toFixed(2)} / {rel.unit}
                  </span>
                  <span className="text-xs font-semibold text-[#194D26]">View &rarr;</span>
                </div>
              </motion.div>
              </Tilt3D>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

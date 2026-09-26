import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { Tilt3D } from './Tilt3D';
import { Scene3D } from './Scene3D';
import { useAuth } from '../context/AuthContext';
import { FarmerDashboardStats, Product, ProductCategory, Order, Review, OrderStatus } from '../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Settings,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const statCardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const FarmerDashboard: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [stats, setStats] = useState<FarmerDashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'profile' | 'reviews'>('overview');

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCatId, setNewProdCatId] = useState<number>(1);
  const [newProdPrice, setNewProdPrice] = useState<number>(4.5);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdStock, setNewProdStock] = useState<number>(30);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Profile Edit State
  const [stallName, setStallName] = useState(user?.farmer_profile?.stall_name || '');
  const [contactPerson, setContactPerson] = useState(user?.farmer_profile?.contact_person || '');
  const [contactPhone, setContactPhone] = useState(user?.farmer_profile?.contact_number || '');
  const [stallAddress, setStallAddress] = useState(user?.farmer_profile?.address || '');
  const [bio, setBio] = useState(user?.farmer_profile?.bio || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Review reply state
  const [replyText, setReplyText] = useState<{ [id: number]: string }>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashStats, prods, cats] = await Promise.all([
        api.getFarmerDashboard(),
        api.getProducts({ farmer_id: user?.id }),
        api.getCategories()
      ]);
      setStats(dashStats);
      setProducts(prods);
      setCategories(cats);

      if (user?.id) {
        const revs = await api.getFarmerReviews(user.id);
        setReviews(revs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to update order status');
    }
  };

  const handleToggleSoldOut = async (product: Product) => {
    try {
      await api.markProductSoldOut(product.id, !product.is_sold_out);
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to update stock status');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Delete this product from your weekly harvest catalog?')) return;
    try {
      await api.deleteProduct(productId);
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete product');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProduct({
        name: newProdName,
        category_id: newProdCatId,
        price: newProdPrice,
        unit: newProdUnit,
        stock_quantity: newProdStock,
        description: newProdDesc
      });
      setShowAddProductModal(false);
      setNewProdName('');
      setNewProdDesc('');
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to create product');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateFarmerProfile({
        stall_name: stallName,
        contact_person: contactPerson,
        contact_number: contactPhone,
        address: stallAddress,
        bio: bio
      });
      await refreshProfile();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to update profile');
    }
  };

  const handleReplyReview = async (reviewId: number) => {
    const text = replyText[reviewId];
    if (!text?.trim()) return;
    try {
      await api.replyToReview(reviewId, text);
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to reply to review');
    }
  };

  return (
    <section className="relative py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 overflow-hidden">
      <Scene3D variant="minimal" className="absolute inset-0 -z-10 opacity-30" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Farmer Vendor Console</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
            {user?.farmer_profile?.stall_name || 'My Farm Stall'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage weekly harvest stock, review incoming pre-orders, and configure market stall pickup slots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2 border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddProductModal(true)}
            className="px-3.5 py-2 bg-[#194D26] text-white rounded-lg text-xs font-semibold hover:bg-[#143e1f] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Produce Item</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 text-xs">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'bg-[#194D26] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Overview & Insights
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-3 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders' ? 'bg-[#194D26] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <span>Incoming Pre-Orders</span>
          {stats?.pending_orders ? (
            <span className="bg-amber-400 text-stone-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {stats.pending_orders}
            </span>
          ) : null}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('products')}
          className={`py-2 px-3 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'products' ? 'bg-[#194D26] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Weekly Stock ({products.length})
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-3 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'bg-[#194D26] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Stall & Pickup Settings
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('reviews')}
          className={`py-2 px-3 font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'reviews' ? 'bg-[#194D26] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Customer Reviews
        </motion.button>
      </div>

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        {/* Tab 1: Overview & Metrics (SRS Section 1.6: Total Orders, Pending Orders, Revenue Summary) */}
        {activeTab === 'overview' && (
          <motion.div
            key="farmer-overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <motion.div
              variants={statsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <Tilt3D maxTilt={10} lift={10}>
                <motion.div
                  variants={statCardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <span className="text-xs text-stone-400 block font-medium">Total Pre-Orders</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                    {stats?.total_orders || 0}
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">Lifetime reservations</span>
                </motion.div>
              </Tilt3D>

              <Tilt3D maxTilt={10} lift={10}>
                <motion.div
                  variants={statCardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <span className="text-xs text-stone-400 block font-medium">Pending Pickup</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 mt-1">
                    {stats?.pending_orders || 0}
                  </div>
                  <span className="text-[11px] text-amber-700 mt-1 block">Awaiting fulfillment</span>
                </motion.div>
              </Tilt3D>

              <Tilt3D maxTilt={10} lift={10}>
                <motion.div
                  variants={statCardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <span className="text-xs text-stone-400 block font-medium">Revenue Summary</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
                    ${stats?.total_revenue?.toFixed(2) || '0.00'}
                  </div>
                  <span className="text-[11px] text-emerald-800 mt-1 block">Payable at stall pickup</span>
                </motion.div>
              </Tilt3D>

              <Tilt3D maxTilt={10} lift={10}>
                <motion.div
                  variants={statCardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <span className="text-xs text-stone-400 block font-medium">Active Stock Items</span>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1">
                    {stats?.active_products_count || 0}
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">Available for pre-order</span>
                </motion.div>
              </Tilt3D>
            </motion.div>

          {/* Best Selling Products */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-2xs"
          >
            <h3 className="text-base font-bold font-display text-stone-900">
              Best-Selling Produce
            </h3>
            <div className="divide-y divide-stone-100">
              {stats?.best_selling_products?.map((item, idx) => (
                <motion.div
                  key={item.product_id}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  className="py-3 flex items-center justify-between text-xs hover:bg-stone-50/80 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-stone-400 font-bold font-mono">{idx + 1}</span>
                    <span className="font-semibold text-stone-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-6 font-mono tabular-nums">
                    <span className="text-stone-500">{item.units_sold} units reserved</span>
                    <span className="font-bold text-stone-900">${item.revenue.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <motion.div
          key="farmer-orders"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base font-display">Incoming Customer Pre-Orders</h3>
            <span className="text-xs text-stone-500">Update status as baskets are packed</span>
          </div>

          {stats?.recent_orders?.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs bg-stone-50 rounded-xl">
              No pre-orders recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recent_orders?.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="p-5 bg-white rounded-xl border border-stone-200 space-y-3 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm">{order.order_number}</span>
                      <span className="text-stone-400 text-xs mx-2">·</span>
                      <span className="text-xs text-stone-600">Customer: <strong>{order.customer_name}</strong> ({order.customer_phone})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 capitalize">
                        Status: {order.order_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-1">Pickup Window:</span>
                      <span className="font-medium text-stone-800">
                        {order.pickup_date} · {order.pickup_time_slot}
                      </span>
                      {order.pickup_notes && (
                        <p className="text-stone-500 italic mt-1">Customer Note: "{order.pickup_notes}"</p>
                      )}
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-1">Items in Reservation:</span>
                      <div className="space-y-1">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-stone-700">
                            <span>{item.quantity}× {item.product_name}</span>
                            <span className="font-mono tabular-nums">${item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold border-t border-stone-100 pt-1 mt-1 text-stone-900 font-mono">
                        <span>Total at Pickup:</span>
                        <span>${order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-stone-100">
                    {order.order_status === 'placed' && (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-2xs"
                        >
                          Accept Order
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => handleUpdateOrderStatus(order.id, 'declined' as any)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 cursor-pointer"
                        >
                          Decline
                        </motion.button>
                      </>
                    )}

                    {order.order_status === 'accepted' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, 'ready_for_pickup')}
                        className="px-3 py-1.5 bg-[#194D26] text-white rounded-lg text-xs font-semibold hover:bg-[#143e1f] cursor-pointer shadow-2xs"
                      >
                        Mark Ready for Pickup
                      </motion.button>
                    )}

                    {order.order_status === 'ready_for_pickup' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                        className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 cursor-pointer shadow-2xs"
                      >
                        Mark Picked Up & Paid
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 3: Weekly Stock Catalog */}
      {activeTab === 'products' && (
        <motion.div
          key="farmer-products"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base font-display">Weekly Produce Listings</h3>
            <span className="text-xs text-stone-500">Toggle sold-out status or adjust inventory quantities</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Produce Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Available Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="w-8 h-8 rounded object-cover bg-stone-100 shrink-0"
                        />
                        <span>{prod.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{prod.category_name}</td>
                    <td className="px-4 py-3 font-mono tabular-nums font-bold text-stone-900">
                      ${prod.price.toFixed(2)} / {prod.unit}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {prod.stock_quantity} {prod.unit}s
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleSoldOut(prod)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          prod.is_sold_out
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.is_sold_out ? 'Sold Out (Click to Unmark)' : 'Available'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}

      {/* Tab 4: Stall & Pickup Settings */}
      {activeTab === 'profile' && (
        <motion.form
          key="farmer-profile"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSaveProfile}
          className="bg-white p-6 rounded-2xl border border-stone-200 max-w-2xl space-y-4 text-xs shadow-2xs"
        >
          <h3 className="font-bold text-stone-900 text-base font-display">Stall Profile & Pickup Windows</h3>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
              Profile updated successfully!
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-medium mb-1">Stall or Farm Business Name</label>
            <input
              type="text"
              required
              value={stallName}
              onChange={(e) => setStallName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Contact Number</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Physical Stall Address / Market Spot</label>
            <input
              type="text"
              required
              value={stallAddress}
              onChange={(e) => setStallAddress(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Farm Bio & Heritage</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-900"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#194D26] text-white rounded-lg font-semibold hover:bg-[#143e1f] transition-colors cursor-pointer shadow-xs"
          >
            Save Stall Settings
          </button>
        </motion.form>
      )}

      {/* Tab 5: Customer Reviews & Replies */}
      {activeTab === 'reviews' && (
        <motion.div
          key="farmer-reviews"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h3 className="font-bold text-stone-900 text-base font-display">Customer Feedback & Vendor Replies</h3>

          {reviews.length === 0 ? (
            <p className="text-xs text-stone-500">No reviews received yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, idx) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-3 shadow-2xs hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{r.customer_name}</span>
                    <span className="text-stone-400">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-stone-700">{r.comment}</p>

                  {r.farmer_reply ? (
                    <div className="p-3 bg-emerald-50 rounded-lg border-l-2 border-[#194D26]">
                      <span className="font-bold text-[#194D26] block">Your Reply:</span>
                      <p className="text-stone-700">{r.farmer_reply.reply}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                      <input
                        type="text"
                        placeholder="Reply to customer..."
                        value={replyText[r.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 border border-stone-200 rounded-lg text-xs"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleReplyReview(r.id)}
                        className="px-3 py-1.5 bg-[#194D26] text-white rounded-lg font-medium text-xs hover:bg-[#143e1f] transition-colors cursor-pointer"
                      >
                        Send Reply
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add Produce Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base font-display">Add Produce to Harvest Stock</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crisp Fuji Apples"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Category</label>
                <select
                  value={newProdCatId}
                  onChange={(e) => setNewProdCatId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, bunch, jar"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe freshness, harvest day, flavor profile..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#194D26] text-white rounded-lg font-semibold hover:bg-[#143e1f]"
              >
                Publish to Weekly Stock
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

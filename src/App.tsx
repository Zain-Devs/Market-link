import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailPage } from './components/ProductDetailPage';
import { MarketDirectory } from './components/MarketDirectory';
import { FarmerDirectory } from './components/FarmerDirectory';
import { OpenStreetMapViewer } from './components/OpenStreetMapViewer';
import { CartDrawer } from './components/CartDrawer';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { AuthModal } from './components/AuthModal';
import { BackendIntegrationModal } from './components/BackendIntegrationModal';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { FavoritesView } from './components/FavoritesView';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AboutContactModal } from './components/AboutContactModal';
import { FlyingArrowOverlay } from './components/FlyingArrowOverlay';
import { CartToastNotification } from './components/CartToastNotification';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Footer } from './components/Footer';
import { api } from './api/client';
import { Product, Market, User, ProductCategory } from './types';
import { MapPin, Navigation, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';

function MarketLinkMain() {
  const { user, role } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'browse' | 'markets' | 'farmers' | 'map' | 'orders' | 'favorites' | 'farmer-dash' | 'admin-dash' | 'product-detail'
  >('browse');
  const [previousTab, setPreviousTab] = useState<string>('browse');

  // Master data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);

  // Selected entities & modals state
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [backendModalOpen, setBackendModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Navigation helper for opening product detail as a separate full page
  const handleOpenProductDetail = (prod: Product | number) => {
    const prodId = typeof prod === 'number' ? prod : prod.id;
    if (activeTab !== 'product-detail') {
      setPreviousTab(activeTab);
    }
    setSelectedProductId(prodId);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load initial catalog & markets
  const loadData = async () => {
    try {
      const [prods, cats, mrkts, frmrs] = await Promise.all([
        api.getProducts({ day: selectedDay || undefined }),
        api.getCategories(),
        api.getMarkets(),
        api.getFarmers()
      ]);
      setProducts(prods);
      setCategories(cats);
      setMarkets(mrkts);
      setFarmers(frmrs);
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDay]);

  const handleOrderSuccess = (orderId: number) => {
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1E2922]">
      {/* Top Announcement Ribbon */}
      <AnnouncementBar
        onExploreMarkets={() => setActiveTab('markets')}
        onExploreMap={() => setActiveTab('map')}
      />

      {/* Top Bar (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenBackendModal={() => setBackendModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenAi={() => setAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* TAB 1: BROWSE PRODUCE CATALOG (Main Storefront) */}
          {activeTab === 'browse' && (
            <motion.div
              key="tab-browse"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Hero
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                onExploreMarkets={() => setActiveTab('markets')}
                onSelectCategory={(catId) => {
                  setSelectedCategoryId(catId);
                  const catalogElem = document.getElementById('catalog-section');
                  if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <div id="catalog-section">
                <ProductCatalog
                  products={products}
                  categories={categories}
                  markets={markets}
                  selectedCategoryId={selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  selectedMarketId={selectedMarketId}
                  setSelectedMarketId={setSelectedMarketId}
                  onOpenProductDetail={(prod) => handleOpenProductDetail(prod)}
                  onOpenFarmerModal={(fId) => setSelectedFarmerId(fId)}
                  searchQuery={searchQuery}
                />
              </div>
            </motion.div>
          )}

          {/* TAB: SEPARATE DEDICATED PRODUCT DETAIL PAGE (Not a modal) */}
          {activeTab === 'product-detail' && selectedProductId && (
            <motion.div
              key={`tab-product-${selectedProductId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductDetailPage
                productId={selectedProductId}
                onBack={() => {
                  setActiveTab((previousTab as any) || 'browse');
                }}
                onOpenFarmerModal={(fId) => setSelectedFarmerId(fId)}
                onSelectProduct={(prod) => handleOpenProductDetail(prod)}
              />
            </motion.div>
          )}

          {/* TAB 2: MARKETS DIRECTORY */}
          {activeTab === 'markets' && (
            <motion.div
              key="tab-markets"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <MarketDirectory
                markets={markets}
                farmers={farmers}
                onSelectMarketForProducts={(mId) => {
                  setSelectedMarketId(mId);
                  setActiveTab('browse');
                }}
                onOpenFarmerModal={(fId) => setSelectedFarmerId(fId)}
              />
            </motion.div>
          )}

          {/* TAB 3: FARMERS & ARTISANS DIRECTORY */}
          {activeTab === 'farmers' && (
            <motion.div
              key="tab-farmers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <FarmerDirectory
                farmers={farmers}
                products={products}
                onOpenFarmerModal={(fId) => setSelectedFarmerId(fId)}
                onOpenProductDetail={(prod) => handleOpenProductDetail(prod)}
              />
            </motion.div>
          )}

          {/* TAB 4: DEDICATED OPENSTREETMAP VIEW */}
          {activeTab === 'map' && (
            <motion.div
              key="tab-map"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#194D26]">Geolocation Discovery</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 mt-1">
                      OpenStreetMap Stall & Hub Navigator
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                      View precise latitude and longitude coordinates for all scheduled pickup points.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Navigation className="w-4 h-4 text-[#194D26]" />
                    <span>Standard Leaflet/OpenStreetMap Tiles</span>
                  </div>
                </div>

                <OpenStreetMapViewer
                  markets={markets}
                  className="h-[520px] w-full"
                />
              </section>
            </motion.div>
          )}

          {/* TAB 5: CUSTOMER PRE-ORDERS */}
          {activeTab === 'orders' && (
            <motion.div
              key="tab-orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <CustomerOrdersView onBrowseProduce={() => setActiveTab('browse')} />
            </motion.div>
          )}

          {/* TAB 6: CUSTOMER FAVORITES */}
          {activeTab === 'favorites' && (
            <motion.div
              key="tab-favorites"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <FavoritesView
                onOpenProductDetail={(prod) => handleOpenProductDetail(prod)}
                onOpenFarmerModal={(fId) => setSelectedFarmerId(fId)}
                onBrowseProduce={() => setActiveTab('browse')}
              />
            </motion.div>
          )}

          {/* TAB 7: FARMER VENDOR PORTAL */}
          {activeTab === 'farmer-dash' && (
            <motion.div
              key="tab-farmer-dash"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <FarmerDashboard />
            </motion.div>
          )}

          {/* TAB 8: ADMIN GOVERNANCE CONSOLE */}
          {activeTab === 'admin-dash' && (
            <motion.div
              key="tab-admin-dash"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Flying Green Arrow Animation Overlay */}
      <FlyingArrowOverlay />

      {/* Modern Cart Toast Notification */}
      <CartToastNotification />

      {/* Cart Pre-Order Drawer */}
      <CartDrawer
        onOrderSuccess={handleOrderSuccess}
        onOpenAuth={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
      />

      {/* Farmer Profile Modal */}
      <FarmerProfileModal
        farmerId={selectedFarmerId}
        onClose={() => setSelectedFarmerId(null)}
        onOpenProductDetail={(prod) => handleOpenProductDetail(prod)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Backend Integration Modal */}
      <BackendIntegrationModal
        isOpen={backendModalOpen}
        onClose={() => setBackendModalOpen(false)}
      />

      {/* AI Assistant Modal (SRS Optional Feature) */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        products={products}
        markets={markets}
        farmers={farmers}
        onOpenProductDetail={(prod) => handleOpenProductDetail(prod)}
        onSelectMarket={(mId) => {
          setSelectedMarketId(mId);
          setActiveTab('browse');
        }}
      />

      {/* About & Contact Modal */}
      <AboutContactModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenBackendModal={() => setBackendModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MarketLinkMain />
      </CartProvider>
    </AuthProvider>
  );
}

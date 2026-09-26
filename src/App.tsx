import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailPage } from './components/ProductDetailPage';
import { MarketDirectory } from './components/MarketDirectory';
import { FarmerDirectory } from './components/FarmerDirectory';
import { OpenStreetMapViewer } from './components/OpenStreetMapViewer';
import { CartDrawer } from './components/CartDrawer';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { BackendIntegrationModal } from './components/BackendIntegrationModal';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { FavoritesView } from './components/FavoritesView';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AboutContactModal } from './components/AboutContactModal';
import { FlyingArrowOverlay } from './components/FlyingArrowOverlay';
import { CartToastNotification } from './components/CartToastNotification';
import { Footer } from './components/Footer';
import { api } from './api/client';
import { Product, Market, User, ProductCategory } from './types';
import { MapPin, Navigation, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';

function MarketLinkMain() {
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'browse' | 'markets' | 'farmers' | 'map' | 'orders' | 'favorites' | 'farmer-dash' | 'admin-dash' | 'product-detail'
  >('browse');
  const [previousTab, setPreviousTab] = useState<string>('browse');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);
  const [backendModalOpen, setBackendModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const handleOpenProductDetail = (prod: Product | number) => {
    const prodId = typeof prod === 'number' ? prod : prod.id;
    if (activeTab !== 'product-detail') {
      setPreviousTab(activeTab);
    }
    setSelectedProductId(prodId);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
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

      <FlyingArrowOverlay />
      <CartToastNotification />

      <CartDrawer
        onOrderSuccess={handleOrderSuccess}
        onOpenAuth={() => {}}
      />

      <FarmerProfileModal
        farmerId={selectedFarmerId}
        onClose={() => setSelectedFarmerId(null)}
        onOpenProductDetail={(prod) => handleOpenProductDetail(prod)}
      />

      <BackendIntegrationModal
        isOpen={backendModalOpen}
        onClose={() => setBackendModalOpen(false)}
      />

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

      <AboutContactModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenBackendModal={() => setBackendModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return <MarketLinkMain />;
}
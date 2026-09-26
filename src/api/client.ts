import {
  User,
  Market,
  Product,
  Order,
  Review,
  ProductCategory,
  FarmerDashboardStats,
  AdminDashboardStats,
  OrderStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MARKETS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_FAVORITES,
  freshProduceImg
} from './mockData';

// Local storage keys
const TOKEN_KEY = 'marketlink_sanctum_token';
const USER_KEY = 'marketlink_auth_user';
const API_URL_KEY = 'marketlink_api_base_url';
const API_MODE_KEY = 'marketlink_api_mode'; // 'mock' | 'live'

// Persistent in-memory / local storage state for Mock mode so changes persist across actions
const STORAGE_PREFIX = 'marketlink_db_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
}

class ApiClient {
  private baseUrl: string;
  private mode: 'mock' | 'live';
  private token: string | null = null;

  constructor() {
    this.baseUrl = localStorage.getItem(API_URL_KEY) || 'http://localhost:8000/api';
    this.mode = (localStorage.getItem(API_MODE_KEY) as 'mock' | 'live') || 'mock';
    this.token = localStorage.getItem(TOKEN_KEY) || 'sanctum_demo_token_customer';

    // Initialize mock database if first load
    if (!localStorage.getItem(STORAGE_PREFIX + 'initialized')) {
      setStored('users', INITIAL_USERS);
      setStored('markets', INITIAL_MARKETS);
      setStored('categories', INITIAL_CATEGORIES);
      setStored('products', INITIAL_PRODUCTS);
      setStored('orders', INITIAL_ORDERS);
      setStored('reviews', INITIAL_REVIEWS);
      setStored('favorites', INITIAL_FAVORITES);
      localStorage.setItem(STORAGE_PREFIX + 'initialized', 'true');
    }
  }

  // Settings getters / setters
  public getMode(): 'mock' | 'live' {
    return this.mode;
  }

  public setMode(mode: 'mock' | 'live') {
    this.mode = mode;
    localStorage.setItem(API_MODE_KEY, mode);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
    localStorage.setItem(API_URL_KEY, this.baseUrl);
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  public resetMockDatabase() {
    setStored('users', INITIAL_USERS);
    setStored('markets', INITIAL_MARKETS);
    setStored('categories', INITIAL_CATEGORIES);
    setStored('products', INITIAL_PRODUCTS);
    setStored('orders', INITIAL_ORDERS);
    setStored('reviews', INITIAL_REVIEWS);
    setStored('favorites', INITIAL_FAVORITES);
  }

  // Live HTTP request helper with Sanctum Bearer headers
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        errMessage = errJson.message || errJson.error || errMessage;
      } catch {}
      throw new Error(errMessage);
    }

    return response.json();
  }

  // Helper for mock latency
  private async mockDelay(ms = 180): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // AUTH ENDPOINTS (Laravel Sanctum)
  // ==========================================

  public async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (this.mode === 'live') {
      const data = await this.request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      this.setToken(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }

    // Mock implementation
    await this.mockDelay(250);
    const users = getStored<User[]>('users', INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      throw new Error('Invalid email credentials. Please check your email or select a demo account.');
    }

    const token = `sanctum_token_${user.role}_${Date.now()}`;
    this.setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token, user };
  }

  public async register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'farmer';
    phone: string;
    address: string;
    stall_name?: string;
  }): Promise<{ token: string; user: User }> {
    if (this.mode === 'live') {
      const data = await this.request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      this.setToken(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    }

    await this.mockDelay(300);
    const users = getStored<User[]>('users', INITIAL_USERS);

    if (users.some(u => u.email.toLowerCase() === payload.email.trim().toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
      address: payload.address,
      status: payload.role === 'farmer' ? 'pending' : 'active',
      created_at: new Date().toISOString()
    };

    if (payload.role === 'farmer') {
      newUser.farmer_profile = {
        id: Date.now() + 1,
        user_id: newUser.id,
        stall_name: payload.stall_name || `${payload.name}'s Farm Stall`,
        contact_person: payload.name,
        contact_number: payload.phone,
        bio: 'Freshly registered local producer on MarketLink eGreen Basket.',
        operating_days: ['Saturday', 'Sunday'],
        pickup_windows: ['08:00 AM - 11:00 AM', '11:30 AM - 02:00 PM'],
        address: payload.address,
        latitude: 37.7749,
        longitude: -122.4194,
        markets: [INITIAL_MARKETS[0]],
        is_approved: false
      };
    }

    users.push(newUser);
    setStored('users', users);

    const token = `sanctum_token_${newUser.role}_${Date.now()}`;
    this.setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return { token, user: newUser };
  }

  public async getProfile(): Promise<User> {
    if (this.mode === 'live') {
      const user = await this.request<User>('/auth/profile');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }

    await this.mockDelay(100);
    const storedUserJson = localStorage.getItem(USER_KEY);
    if (storedUserJson) {
      const parsed = JSON.parse(storedUserJson);
      const users = getStored<User[]>('users', INITIAL_USERS);
      const fresh = users.find(u => u.id === parsed.id) || parsed;
      return fresh;
    }
    // Default fallback to customer
    return INITIAL_USERS[3];
  }

  public async logout(): Promise<void> {
    if (this.mode === 'live') {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } catch (e) {
        console.warn('Logout backend call error:', e);
      }
    }
    this.setToken(null);
    localStorage.removeItem(USER_KEY);
  }

  // ==========================================
  // MARKETS ENDPOINTS
  // ==========================================

  public async getMarkets(): Promise<Market[]> {
    if (this.mode === 'live') {
      return this.request<Market[]>('/markets');
    }
    await this.mockDelay(120);
    return getStored<Market[]>('markets', INITIAL_MARKETS);
  }

  public async getNearbyMarkets(lat?: number, lng?: number): Promise<Market[]> {
    if (this.mode === 'live') {
      const q = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
      return this.request<Market[]>(`/markets/nearby${q}`);
    }
    await this.mockDelay(150);
    return getStored<Market[]>('markets', INITIAL_MARKETS);
  }

  public async getMarket(id: number): Promise<Market> {
    if (this.mode === 'live') {
      return this.request<Market>(`/markets/${id}`);
    }
    await this.mockDelay(100);
    const markets = getStored<Market[]>('markets', INITIAL_MARKETS);
    const market = markets.find(m => m.id === Number(id));
    if (!market) throw new Error('Market not found');
    return market;
  }

  // ==========================================
  // PRODUCTS ENDPOINTS
  // ==========================================

  public async getProducts(params?: {
    search?: string;
    category_id?: number;
    market_id?: number;
    day?: string;
    min_price?: number;
    max_price?: number;
    farmer_id?: number;
  }): Promise<Product[]> {
    if (this.mode === 'live') {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category_id) query.append('category_id', String(params.category_id));
      if (params?.market_id) query.append('market_id', String(params.market_id));
      if (params?.day) query.append('day', params.day);
      if (params?.min_price) query.append('min_price', String(params.min_price));
      if (params?.max_price) query.append('max_price', String(params.max_price));
      if (params?.farmer_id) query.append('farmer_id', String(params.farmer_id));
      const qStr = query.toString() ? `?${query.toString()}` : '';
      return this.request<Product[]>(`/products${qStr}`);
    }

    await this.mockDelay(150);
    let items = getStored<Product[]>('products', INITIAL_PRODUCTS);

    if (params?.search) {
      const s = params.search.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.stall_name.toLowerCase().includes(s)
      );
    }

    if (params?.category_id) {
      items = items.filter(p => p.category_id === Number(params.category_id));
    }

    if (params?.farmer_id) {
      items = items.filter(p => p.farmer_id === Number(params.farmer_id));
    }

    if (params?.market_id) {
      items = items.filter(p => p.market_id === Number(params.market_id));
    }

    if (params?.min_price !== undefined) {
      items = items.filter(p => p.price >= (params.min_price || 0));
    }

    if (params?.max_price !== undefined) {
      items = items.filter(p => p.price <= (params.max_price || Infinity));
    }

    return items;
  }

  public async getProduct(id: number): Promise<Product> {
    if (this.mode === 'live') {
      return this.request<Product>(`/products/${id}`);
    }
    await this.mockDelay(100);
    const products = getStored<Product[]>('products', INITIAL_PRODUCTS);
    const product = products.find(p => p.id === Number(id));
    if (!product) throw new Error('Product not found');
    return product;
  }

  // ==========================================
  // FARMERS ENDPOINTS
  // ==========================================

  public async getFarmers(): Promise<User[]> {
    if (this.mode === 'live') {
      return this.request<User[]>('/farmers');
    }
    await this.mockDelay(120);
    const users = getStored<User[]>('users', INITIAL_USERS);
    return users.filter(u => u.role === 'farmer' && u.farmer_profile);
  }

  public async getFarmer(id: number): Promise<User> {
    if (this.mode === 'live') {
      return this.request<User>(`/farmers/${id}`);
    }
    await this.mockDelay(100);
    const users = getStored<User[]>('users', INITIAL_USERS);
    const farmer = users.find(u => u.id === Number(id) && u.role === 'farmer');
    if (!farmer) throw new Error('Farmer not found');
    return farmer;
  }

  // ==========================================
  // REVIEWS ENDPOINTS
  // ==========================================

  public async getProductReviews(productId: number): Promise<Review[]> {
    if (this.mode === 'live') {
      return this.request<Review[]>(`/products/${productId}/reviews`);
    }
    await this.mockDelay(80);
    const reviews = getStored<Review[]>('reviews', INITIAL_REVIEWS);
    return reviews.filter(r => r.reviewable_type === 'product' && r.reviewable_id === Number(productId));
  }

  public async getFarmerReviews(farmerId: number): Promise<Review[]> {
    if (this.mode === 'live') {
      return this.request<Review[]>(`/farmers/${farmerId}/reviews`);
    }
    await this.mockDelay(80);
    const reviews = getStored<Review[]>('reviews', INITIAL_REVIEWS);
    return reviews.filter(r => r.reviewable_type === 'farmer' && r.reviewable_id === Number(farmerId));
  }

  public async storeReview(payload: {
    reviewable_type: 'product' | 'farmer';
    reviewable_id: number;
    rating: number;
    comment: string;
  }): Promise<Review> {
    if (this.mode === 'live') {
      return this.request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(200);
    const reviews = getStored<Review[]>('reviews', INITIAL_REVIEWS);
    const user = await this.getProfile();

    const newReview: Review = {
      id: Date.now(),
      reviewable_type: payload.reviewable_type,
      reviewable_id: payload.reviewable_id,
      customer_id: user.id,
      customer_name: user.name,
      rating: payload.rating,
      comment: payload.comment,
      created_at: new Date().toISOString()
    };

    reviews.unshift(newReview);
    setStored('reviews', reviews);
    return newReview;
  }

  // ==========================================
  // FAVORITES ENDPOINTS
  // ==========================================

  public async getFavorites(): Promise<{ products: Product[]; farmers: User[] }> {
    if (this.mode === 'live') {
      return this.request<{ products: Product[]; farmers: User[] }>('/favorites');
    }

    await this.mockDelay(120);
    const favs = getStored<any[]>('favorites', INITIAL_FAVORITES);
    const allProducts = getStored<Product[]>('products', INITIAL_PRODUCTS);
    const allUsers = getStored<User[]>('users', INITIAL_USERS);

    const products = allProducts.filter(p => favs.some(f => f.item_type === 'product' && f.item_id === p.id));
    const farmers = allUsers.filter(u => u.role === 'farmer' && favs.some(f => f.item_type === 'farmer' && f.item_id === u.id));

    return { products, farmers };
  }

  public async toggleFavorite(itemId: number, itemType: 'product' | 'farmer'): Promise<{ favorited: boolean }> {
    if (this.mode === 'live') {
      return this.request<{ favorited: boolean }>('/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId, item_type: itemType })
      });
    }

    await this.mockDelay(150);
    const favs = getStored<any[]>('favorites', INITIAL_FAVORITES);
    const existingIndex = favs.findIndex(f => f.item_type === itemType && f.item_id === itemId);

    let favorited = false;
    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
      favorited = false;
    } else {
      favs.push({
        id: Date.now(),
        user_id: 4,
        item_type: itemType,
        item_id: itemId,
        created_at: new Date().toISOString()
      });
      favorited = true;
    }

    setStored('favorites', favs);
    return { favorited };
  }

  // ==========================================
  // CUSTOMER ORDERS ENDPOINTS
  // ==========================================

  public async getOrders(): Promise<Order[]> {
    if (this.mode === 'live') {
      return this.request<Order[]>('/orders');
    }
    await this.mockDelay(120);
    return getStored<Order[]>('orders', INITIAL_ORDERS);
  }

  public async getOrder(id: number): Promise<Order> {
    if (this.mode === 'live') {
      return this.request<Order>(`/orders/${id}`);
    }
    await this.mockDelay(100);
    const orders = getStored<Order[]>('orders', INITIAL_ORDERS);
    const order = orders.find(o => o.id === Number(id));
    if (!order) throw new Error('Order not found');
    return order;
  }

  public async storeOrder(payload: {
    farmer_id: number;
    market_id: number;
    pickup_date: string;
    pickup_time_slot: string;
    pickup_notes?: string;
    items: { product_id: number; quantity: number }[];
  }): Promise<Order> {
    if (this.mode === 'live') {
      return this.request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(300);
    const user = await this.getProfile();
    const orders = getStored<Order[]>('orders', INITIAL_ORDERS);
    const products = getStored<Product[]>('products', INITIAL_PRODUCTS);
    const farmers = getStored<User[]>('users', INITIAL_USERS);
    const markets = getStored<Market[]>('markets', INITIAL_MARKETS);

    const farmer = farmers.find(f => f.id === payload.farmer_id);
    const market = markets.find(m => m.id === payload.market_id) || markets[0];

    let total = 0;
    const orderItems = payload.items.map((item, idx) => {
      const prod = products.find(p => p.id === item.product_id);
      const unit_price = prod ? prod.price : 5.0;
      const subtotal = unit_price * item.quantity;
      total += subtotal;

      // Deduct mock stock
      if (prod) {
        prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        if (prod.stock_quantity === 0) {
          prod.is_sold_out = true;
        }
      }

      return {
        id: Date.now() + idx,
        order_id: Date.now(),
        product_id: item.product_id,
        product_name: prod ? prod.name : 'Fresh Produce Item',
        unit: prod ? prod.unit : 'unit',
        quantity: item.quantity,
        unit_price,
        subtotal,
        image_url: prod?.image_url
      };
    });

    setStored('products', products);

    const newOrder: Order = {
      id: Date.now(),
      order_number: `ML-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: user.id,
      customer_name: user.name,
      customer_phone: user.phone || '+1 (555) 000-0000',
      customer_email: user.email,
      farmer_id: payload.farmer_id,
      farmer_name: farmer?.name || 'Local Farmer',
      stall_name: farmer?.farmer_profile?.stall_name || 'Farm Fresh Stall',
      market_id: payload.market_id,
      market_name: market.name,
      market_address: market.address,
      items: orderItems,
      total_amount: Number(total.toFixed(2)),
      order_status: 'placed',
      pickup_date: payload.pickup_date,
      pickup_time_slot: payload.pickup_time_slot,
      pickup_notes: payload.pickup_notes || '',
      order_date: new Date().toISOString(),
      payment_method: 'cash_at_pickup',
      can_cancel: true
    };

    orders.unshift(newOrder);
    setStored('orders', orders);
    return newOrder;
  }

  public async cancelOrder(id: number, reason?: string): Promise<Order> {
    if (this.mode === 'live') {
      return this.request<Order>(`/orders/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
    }

    await this.mockDelay(150);
    const orders = getStored<Order[]>('orders', INITIAL_ORDERS);
    const order = orders.find(o => o.id === Number(id));
    if (!order) throw new Error('Order not found');

    if (!order.can_cancel && order.order_status !== 'placed') {
      throw new Error('Order cannot be cancelled after farmer has accepted or prepared the basket.');
    }

    order.order_status = 'cancelled';
    order.can_cancel = false;
    order.cancellation_reason = reason || 'Customer requested cancellation prior to pickup cutoff.';
    setStored('orders', orders);
    return order;
  }

  // ==========================================
  // FARMER DASHBOARD & OPERATIONS
  // ==========================================

  public async getFarmerDashboard(): Promise<FarmerDashboardStats> {
    if (this.mode === 'live') {
      return this.request<FarmerDashboardStats>('/farmer/dashboard');
    }

    await this.mockDelay(180);
    const orders = getStored<Order[]>('orders', INITIAL_ORDERS);
    const products = getStored<Product[]>('products', INITIAL_PRODUCTS);

    const pendingOrders = orders.filter(o => o.order_status === 'placed' || o.order_status === 'accepted');
    const completedOrders = orders.filter(o => o.order_status === 'completed' || o.order_status === 'ready_for_pickup');
    const totalRev = orders.reduce((sum, o) => o.order_status !== 'cancelled' ? sum + o.total_amount : sum, 0);

    return {
      total_orders: orders.length,
      pending_orders: pendingOrders.length,
      completed_orders: completedOrders.length,
      total_revenue: Number(totalRev.toFixed(2)),
      active_products_count: products.filter(p => !p.is_sold_out).length,
      average_rating: 4.9,
      best_selling_products: [
        { product_id: 1, name: 'Heirloom Brandywine Tomatoes', units_sold: 84, revenue: 403.20 },
        { product_id: 4, name: 'Raw Spring Wildflower Honey', units_sold: 42, revenue: 483.00 },
        { product_id: 5, name: 'Country Sourdough Boule', units_sold: 38, revenue: 266.00 }
      ],
      recent_orders: orders.slice(0, 5)
    };
  }

  public async updateFarmerProfile(payload: {
    stall_name: string;
    contact_person: string;
    contact_number: string;
    bio?: string;
    operating_days?: string[];
    pickup_windows?: string[];
    address?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<User> {
    if (this.mode === 'live') {
      return this.request<User>('/farmer/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(200);
    const users = getStored<User[]>('users', INITIAL_USERS);
    const user = await this.getProfile();
    const target = users.find(u => u.id === user.id);

    if (target && target.farmer_profile) {
      target.farmer_profile = {
        ...target.farmer_profile,
        ...payload
      };
      setStored('users', users);
      localStorage.setItem(USER_KEY, JSON.stringify(target));
      return target;
    }

    throw new Error('Farmer profile not found for active user');
  }

  public async createProduct(payload: {
    name: string;
    category_id: number;
    price: number;
    unit: string;
    stock_quantity: number;
    description: string;
    image_url?: string;
    market_id?: number;
    organic_certified?: boolean;
  }): Promise<Product> {
    if (this.mode === 'live') {
      return this.request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(200);
    const products = getStored<Product[]>('products', INITIAL_PRODUCTS);
    const categories = getStored<ProductCategory[]>('categories', INITIAL_CATEGORIES);
    const cat = categories.find(c => c.id === Number(payload.category_id));
    const user = await this.getProfile();

    const newProduct: Product = {
      id: Date.now(),
      farmer_id: user.id,
      farmer_name: user.name,
      stall_name: user.farmer_profile?.stall_name || 'Meadowbrook Organics',
      category_id: Number(payload.category_id),
      category_name: cat ? cat.name : 'Fresh Produce',
      name: payload.name,
      description: payload.description,
      price: Number(payload.price),
      unit: payload.unit,
      stock_quantity: Number(payload.stock_quantity),
      is_sold_out: Number(payload.stock_quantity) <= 0,
      image_url: payload.image_url || freshProduceImg,
      harvest_date: new Date().toISOString().split('T')[0],
      organic_certified: payload.organic_certified ?? true,
      rating_avg: 5.0,
      reviews_count: 0,
      created_at: new Date().toISOString()
    };

    products.unshift(newProduct);
    setStored('products', products);
    return newProduct;
  }

  public async updateProduct(id: number, payload: Partial<Product>): Promise<Product> {
    if (this.mode === 'live') {
      return this.request<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(150);
    const products = getStored<Product[]>('products', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) throw new Error('Product not found');

    products[index] = {
      ...products[index],
      ...payload,
      is_sold_out: (payload.stock_quantity !== undefined && payload.stock_quantity <= 0) ? true : (payload.is_sold_out ?? products[index].is_sold_out)
    };

    setStored('products', products);
    return products[index];
  }

  public async deleteProduct(id: number): Promise<{ success: boolean }> {
    if (this.mode === 'live') {
      return this.request<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' });
    }

    await this.mockDelay(120);
    let products = getStored<Product[]>('products', INITIAL_PRODUCTS);
    products = products.filter(p => p.id !== Number(id));
    setStored('products', products);
    return { success: true };
  }

  public async markProductSoldOut(id: number, isSoldOut: boolean): Promise<Product> {
    if (this.mode === 'live') {
      return this.request<Product>(`/products/${id}/sold-out`, {
        method: 'PATCH',
        body: JSON.stringify({ is_sold_out: isSoldOut })
      });
    }

    await this.mockDelay(100);
    const products = getStored<Product[]>('products', INITIAL_PRODUCTS);
    const prod = products.find(p => p.id === Number(id));
    if (!prod) throw new Error('Product not found');

    prod.is_sold_out = isSoldOut;
    if (isSoldOut) prod.stock_quantity = 0;
    setStored('products', products);
    return prod;
  }

  public async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    if (this.mode === 'live') {
      return this.request<Order>(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    }

    await this.mockDelay(150);
    const orders = getStored<Order[]>('orders', INITIAL_ORDERS);
    const order = orders.find(o => o.id === Number(orderId));
    if (!order) throw new Error('Order not found');

    order.order_status = status;
    if (status === 'accepted' || status === 'ready_for_pickup') {
      order.can_cancel = false;
    }
    setStored('orders', orders);
    return order;
  }

  public async replyToReview(reviewId: number, reply: string): Promise<Review> {
    if (this.mode === 'live') {
      return this.request<Review>(`/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply })
      });
    }

    await this.mockDelay(150);
    const reviews = getStored<Review[]>('reviews', INITIAL_REVIEWS);
    const rev = reviews.find(r => r.id === Number(reviewId));
    if (!rev) throw new Error('Review not found');

    rev.farmer_reply = {
      id: Date.now(),
      reply,
      created_at: new Date().toISOString()
    };

    setStored('reviews', reviews);
    return rev;
  }

  // ==========================================
  // ADMIN DASHBOARD & GOVERNANCE
  // ==========================================

  public async getAdminDashboard(): Promise<AdminDashboardStats> {
    if (this.mode === 'live') {
      return this.request<AdminDashboardStats>('/admin/dashboard');
    }

    await this.mockDelay(180);
    const users = getStored<User[]>('users', INITIAL_USERS);
    const markets = getStored<Market[]>('markets', INITIAL_MARKETS);
    const orders = getStored<Order[]>('orders', INITIAL_ORDERS);

    const farmers = users.filter(u => u.role === 'farmer');
    const customers = users.filter(u => u.role === 'customer');
    const pendingFarmers = farmers.filter(f => f.status === 'pending' || !f.farmer_profile?.is_approved);

    const totalVolume = orders.reduce((sum, o) => o.order_status !== 'cancelled' ? sum + o.total_amount : sum, 0);

    return {
      total_farmers: farmers.length,
      pending_farmers: pendingFarmers.length,
      total_customers: customers.length,
      total_markets: markets.length,
      total_orders: orders.length,
      platform_volume: Number(totalVolume.toFixed(2)),
      revenue_across_markets: [
        { market_name: 'Greenfield Community Farmers Market', orders_count: 58, volume: 1420.50 },
        { market_name: 'Oakridge Heritage Artisan Market', orders_count: 42, volume: 1180.00 },
        { market_name: 'Valley View Riverside Pavilion', orders_count: 31, volume: 840.25 }
      ],
      most_active_farmers: [
        { farmer_id: 2, stall_name: 'Meadowbrook Organics', orders_count: 46, rating: 4.9, volume: 1240.00 },
        { farmer_id: 3, stall_name: 'Golden Haven Honey & Bake', orders_count: 38, rating: 5.0, volume: 1090.50 }
      ]
    };
  }

  public async getUsers(): Promise<User[]> {
    if (this.mode === 'live') {
      return this.request<User[]>('/admin/users');
    }
    await this.mockDelay(120);
    return getStored<User[]>('users', INITIAL_USERS);
  }

  public async approveFarmer(userId: number): Promise<User> {
    if (this.mode === 'live') {
      return this.request<User>(`/admin/users/${userId}/approve`, { method: 'PATCH' });
    }

    await this.mockDelay(150);
    const users = getStored<User[]>('users', INITIAL_USERS);
    const user = users.find(u => u.id === Number(userId));
    if (!user) throw new Error('User not found');

    user.status = 'active';
    if (user.farmer_profile) {
      user.farmer_profile.is_approved = true;
    }
    setStored('users', users);
    return user;
  }

  public async toggleUserStatus(userId: number): Promise<User> {
    if (this.mode === 'live') {
      return this.request<User>(`/admin/users/${userId}/toggle-status`, { method: 'PATCH' });
    }

    await this.mockDelay(150);
    const users = getStored<User[]>('users', INITIAL_USERS);
    const user = users.find(u => u.id === Number(userId));
    if (!user) throw new Error('User not found');

    user.status = user.status === 'active' ? 'suspended' : 'active';
    setStored('users', users);
    return user;
  }

  public async deleteReview(id: number): Promise<{ success: boolean }> {
    if (this.mode === 'live') {
      return this.request<{ success: boolean }>(`/admin/reviews/${id}`, { method: 'DELETE' });
    }

    await this.mockDelay(100);
    let reviews = getStored<Review[]>('reviews', INITIAL_REVIEWS);
    reviews = reviews.filter(r => r.id !== Number(id));
    setStored('reviews', reviews);
    return { success: true };
  }

  public async getReports(): Promise<any> {
    if (this.mode === 'live') {
      return this.request('/admin/reports');
    }
    await this.mockDelay(150);
    return {
      generated_at: new Date().toISOString(),
      report_type: 'Consolidated Market Volume & Farmer Compliance',
      total_sales_volume: 3440.75,
      active_markets_count: 3,
      verified_producers_pct: 92,
      average_fulfillment_rate: 98.4
    };
  }

  public async getCategories(): Promise<ProductCategory[]> {
    if (this.mode === 'live') {
      return this.request<ProductCategory[]>('/admin/categories');
    }
    await this.mockDelay(80);
    return getStored<ProductCategory[]>('categories', INITIAL_CATEGORIES);
  }

  public async storeCategory(payload: { name: string; slug: string; description?: string }): Promise<ProductCategory> {
    if (this.mode === 'live') {
      return this.request<ProductCategory>('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(150);
    const cats = getStored<ProductCategory[]>('categories', INITIAL_CATEGORIES);
    const newCat: ProductCategory = {
      id: Date.now(),
      name: payload.name,
      slug: payload.slug || payload.name.toLowerCase().replace(/\s+/g, '-'),
      description: payload.description || ''
    };
    cats.push(newCat);
    setStored('categories', cats);
    return newCat;
  }

  public async deleteCategory(id: number): Promise<{ success: boolean }> {
    if (this.mode === 'live') {
      return this.request<{ success: boolean }>(`/admin/categories/${id}`, { method: 'DELETE' });
    }
    await this.mockDelay(100);
    let cats = getStored<ProductCategory[]>('categories', INITIAL_CATEGORIES);
    cats = cats.filter(c => c.id !== Number(id));
    setStored('categories', cats);
    return { success: true };
  }

  public async storeMarket(payload: {
    name: string;
    address: string;
    city: string;
    operating_days: string[];
    timings: string;
    latitude: number;
    longitude: number;
    description?: string;
  }): Promise<Market> {
    if (this.mode === 'live') {
      return this.request<Market>('/admin/markets', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(200);
    const markets = getStored<Market[]>('markets', INITIAL_MARKETS);
    const newMarket: Market = {
      id: Date.now(),
      name: payload.name,
      address: payload.address,
      city: payload.city,
      operating_days: payload.operating_days,
      timings: payload.timings,
      latitude: payload.latitude,
      longitude: payload.longitude,
      map_provider: 'OpenStreetMap',
      stall_count: 12,
      description: payload.description || 'Community farmers market pickup hub.',
      image_url: INITIAL_MARKETS[0].image_url
    };
    markets.push(newMarket);
    setStored('markets', markets);
    return newMarket;
  }

  public async updateMarket(id: number, payload: Partial<Market>): Promise<Market> {
    if (this.mode === 'live') {
      return this.request<Market>(`/admin/markets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    }

    await this.mockDelay(150);
    const markets = getStored<Market[]>('markets', INITIAL_MARKETS);
    const index = markets.findIndex(m => m.id === Number(id));
    if (index === -1) throw new Error('Market not found');

    markets[index] = { ...markets[index], ...payload };
    setStored('markets', markets);
    return markets[index];
  }

  public async deleteMarket(id: number): Promise<{ success: boolean }> {
    if (this.mode === 'live') {
      return this.request<{ success: boolean }>(`/admin/markets/${id}`, { method: 'DELETE' });
    }

    await this.mockDelay(100);
    let markets = getStored<Market[]>('markets', INITIAL_MARKETS);
    markets = markets.filter(m => m.id !== Number(id));
    setStored('markets', markets);
    return { success: true };
  }
}

export const api = new ApiClient();

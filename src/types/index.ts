export type UserRole = 'customer' | 'farmer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  farmer_profile?: FarmerProfile;
}

export interface FarmerProfile {
  id: number;
  user_id: number;
  stall_name: string;
  contact_person: string;
  contact_number: string;
  bio?: string;
  operating_days: string[]; // e.g. ["Wednesday", "Saturday", "Sunday"]
  pickup_windows: string[]; // e.g. ["08:00 - 11:00", "13:00 - 16:00"]
  address: string;
  latitude: number;
  longitude: number;
  markets: Market[];
  is_approved: boolean;
  avatar_url?: string;
}

export interface Market {
  id: number;
  name: string;
  address: string;
  city: string;
  operating_days: string[];
  timings: string;
  latitude: number;
  longitude: number;
  map_provider?: string;
  description?: string;
  stall_count?: number;
  image_url?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Product {
  id: number;
  farmer_id: number;
  farmer_name: string;
  stall_name: string;
  market_id?: number;
  market_name?: string;
  category_id: number;
  category_name: string;
  name: string;
  description: string;
  price: number;
  unit: string; // e.g., 'kg', 'bunch', 'box', 'jar', 'dozen'
  stock_quantity: number;
  is_sold_out: boolean;
  image_url: string;
  harvest_date?: string;
  organic_certified?: boolean;
  rating_avg?: number;
  reviews_count?: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string;
}

export type OrderStatus = 'placed' | 'accepted' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  farmer_id: number;
  farmer_name: string;
  stall_name: string;
  market_id: number;
  market_name: string;
  market_address: string;
  items: OrderItem[];
  total_amount: number;
  order_status: OrderStatus;
  pickup_date: string;
  pickup_time_slot: string;
  pickup_notes?: string;
  order_date: string;
  payment_method: 'cash_at_pickup';
  can_cancel: boolean;
  cancellation_reason?: string;
}

export interface Review {
  id: number;
  reviewable_type: 'product' | 'farmer';
  reviewable_id: number;
  customer_id: number;
  customer_name: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
  farmer_reply?: {
    id: number;
    reply: string;
    created_at: string;
  };
}

export interface Favorite {
  id: number;
  user_id: number;
  item_type: 'product' | 'farmer';
  item_id: number;
  created_at: string;
}

export interface FarmerDashboardStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  active_products_count: number;
  average_rating: number;
  best_selling_products: {
    product_id: number;
    name: string;
    units_sold: number;
    revenue: number;
  }[];
  recent_orders: Order[];
}

export interface AdminDashboardStats {
  total_farmers: number;
  pending_farmers: number;
  total_customers: number;
  total_markets: number;
  total_orders: number;
  platform_volume: number;
  revenue_across_markets: {
    market_name: string;
    orders_count: number;
    volume: number;
  }[];
  most_active_farmers: {
    farmer_id: number;
    stall_name: string;
    orders_count: number;
    rating: number;
    volume: number;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

import { Market, ProductCategory, Product, User, Review, Order, AdminDashboardStats, FarmerDashboardStats } from '../types';

import heroBasketImg from '../assets/images/marketlink_hero_basket_1790341493726.jpg';
import basketHarvest3DImg from '../assets/images/basket_harvest_3d_1790343235743.jpg';
import heroMarket3DImg from '../assets/images/hero_market_3d_render_1790343134303.jpg';
import farmerStallImg from '../assets/images/marketlink_farmer_stall_1790341508621.jpg';
import freshProduceImg from '../assets/images/marketlink_fresh_produce_1790341521044.jpg';
import artisanGoodsImg from '../assets/images/marketlink_artisan_goods_1790341534133.jpg';

// 3D Rendered Asset Icons
import iconProduce3D from '../assets/images/icon_fresh_produce_3d_1790342405882.jpg';
import iconMarket3D from '../assets/images/icon_farmers_market_3d_1790342422679.jpg';
import iconHoney3D from '../assets/images/icon_organic_honey_3d_1790342437173.jpg';
import iconPickup3D from '../assets/images/icon_pickup_box_3d_1790342451970.jpg';
import iconBread3D from '../assets/images/icon_artisan_bread_3d_1790342470390.jpg';
import iconDairy3D from '../assets/images/icon_farm_dairy_3d_1790342486447.jpg';
import iconHerbs3D from '../assets/images/icon_herbs_sprout_3d_1790342502130.jpg';
import iconFruits3D from '../assets/images/icon_seasonal_fruit_3d_1790342516457.jpg';

export {
  heroBasketImg,
  basketHarvest3DImg,
  heroMarket3DImg,
  farmerStallImg,
  freshProduceImg,
  artisanGoodsImg,
  iconProduce3D,
  iconMarket3D,
  iconHoney3D,
  iconPickup3D,
  iconBread3D,
  iconDairy3D,
  iconHerbs3D,
  iconFruits3D
};

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 1, name: 'Fresh Vegetables', slug: 'vegetables', description: 'Crisp root vegetables, leafy greens, and vine tomatoes harvested daily.', icon: iconProduce3D },
  { id: 2, name: 'Seasonal Fruits', slug: 'fruits', description: 'Sun-ripened orchard apples, stone fruits, and sweet seasonal berries.', icon: iconFruits3D },
  { id: 3, name: 'Artisanal Bakery', slug: 'bakery', description: 'Wood-fired sourdough, rustic crusts, and morning pastries.', icon: iconBread3D },
  { id: 4, name: 'Farm Dairy & Eggs', slug: 'dairy', description: 'Pasture-raised organic eggs, raw grass-fed milk, and farmstead cheeses.', icon: iconDairy3D },
  { id: 5, name: 'Herbs & Microgreens', slug: 'herbs', description: 'Aromatic culinary herbs, basil bundles, and nutrient-dense microgreens.', icon: iconHerbs3D },
  { id: 6, name: 'Honey & Preserves', slug: 'preserves', description: 'Pure raw comb honey, small-batch berry jams, and stone-ground preserves.', icon: iconHoney3D }
];

export const INITIAL_MARKETS: Market[] = [
  {
    id: 1,
    name: 'Greenfield Community Farmers Market',
    address: '142 Orchard Grove Boulevard, Greenfield Plaza',
    city: 'Greenfield',
    operating_days: ['Wednesday', 'Saturday'],
    timings: '07:30 AM - 01:30 PM',
    latitude: 37.7749,
    longitude: -122.4194,
    map_provider: 'OpenStreetMap',
    stall_count: 24,
    description: 'Our flagship morning open-air market featuring certified local organic producers, live acoustic music, and dedicated pre-order pickup stalls.',
    image_url: heroBasketImg
  },
  {
    id: 2,
    name: 'Valley View Riverside Pavilion',
    address: '88 Riverfront Walkway, Mill Valley Park',
    city: 'Valley View',
    operating_days: ['Friday', 'Sunday'],
    timings: '08:00 AM - 02:00 PM',
    latitude: 37.8044,
    longitude: -122.2712,
    map_provider: 'OpenStreetMap',
    stall_count: 18,
    description: 'Scenic riverbank pavilion market popular for fresh heirloom vegetables, pasture eggs, artisan sourdough, and cold-pressed farm juices.',
    image_url: farmerStallImg
  },
  {
    id: 3,
    name: 'Oakridge Heritage Artisan Market',
    address: '500 Heritage Square, Old Town Oakridge',
    city: 'Oakridge',
    operating_days: ['Saturday', 'Sunday'],
    timings: '08:30 AM - 02:30 PM',
    latitude: 37.8715,
    longitude: -122.2730,
    map_provider: 'OpenStreetMap',
    stall_count: 32,
    description: 'Historic town square hub connecting multigenerational family orchards, dairy farms, and natural beekeepers with enthusiastic local chefs.',
    image_url: artisanGoodsImg
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Admin Supervisor',
    email: 'admin@marketlink.org',
    role: 'admin',
    phone: '+1 (555) 019-2831',
    address: 'MarketLink HQ, 100 Eco Way',
    status: 'active',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    email: 'sarah@meadowbrookorganics.com',
    role: 'farmer',
    phone: '+1 (555) 349-8812',
    address: 'Meadowbrook Family Farm, 45 Country Rd',
    status: 'active',
    created_at: '2026-01-15T09:30:00Z',
    farmer_profile: {
      id: 101,
      user_id: 2,
      stall_name: 'Meadowbrook Organics',
      contact_person: 'Sarah & Ben Jenkins',
      contact_number: '+1 (555) 349-8812',
      bio: 'Third-generation regenerative family farm specializing in heritage heirloom tomatoes, vibrant root vegetables, and pesticide-free greenhouse greens.',
      operating_days: ['Wednesday', 'Saturday'],
      pickup_windows: ['08:00 AM - 10:00 AM', '10:30 AM - 01:00 PM'],
      address: 'Stall #14, Greenfield Community Market',
      latitude: 37.7751,
      longitude: -122.4190,
      markets: [INITIAL_MARKETS[0], INITIAL_MARKETS[1]],
      is_approved: true,
      avatar_url: farmerStallImg
    }
  },
  {
    id: 3,
    name: 'Marcus Vance',
    email: 'marcus@goldenhavenapiary.com',
    role: 'farmer',
    phone: '+1 (555) 782-9901',
    address: 'Golden Haven Apiaries, 12 Valley Hill',
    status: 'active',
    created_at: '2026-02-01T10:15:00Z',
    farmer_profile: {
      id: 102,
      user_id: 3,
      stall_name: 'Golden Haven Honey & Bake',
      contact_person: 'Marcus Vance',
      contact_number: '+1 (555) 782-9901',
      bio: 'Raw wildflower honey, cut honeycomb, wood-fired heritage wheat sourdough breads, and small batch seasonal fruit compotes.',
      operating_days: ['Saturday', 'Sunday'],
      pickup_windows: ['08:30 AM - 11:30 AM', '12:00 PM - 02:00 PM'],
      address: 'Stall #08, Oakridge Heritage Market',
      latitude: 37.8718,
      longitude: -122.2725,
      markets: [INITIAL_MARKETS[2]],
      is_approved: true,
      avatar_url: artisanGoodsImg
    }
  },
  {
    id: 4,
    name: 'Elena Rostova',
    email: 'customer@marketlink.org',
    role: 'customer',
    phone: '+1 (555) 621-4478',
    address: '742 Elm Street, Greenfield',
    status: 'active',
    created_at: '2026-02-14T11:00:00Z'
  },
  {
    id: 5,
    name: 'David Thorne',
    email: 'david@sunnycrestorchard.com',
    role: 'farmer',
    phone: '+1 (555) 441-2099',
    address: 'Sunnycrest Orchards, Ridge Mile 4',
    status: 'pending',
    created_at: '2026-03-01T14:20:00Z',
    farmer_profile: {
      id: 103,
      user_id: 5,
      stall_name: 'Sunnycrest Crisp Orchards',
      contact_person: 'David Thorne',
      contact_number: '+1 (555) 441-2099',
      bio: 'High-elevation crisp apples, heirloom pears, and freshly pressed unpasteurized cider.',
      operating_days: ['Friday', 'Sunday'],
      pickup_windows: ['09:00 AM - 12:00 PM'],
      address: 'Stall #04, Valley View Riverside Pavilion',
      latitude: 37.8040,
      longitude: -122.2708,
      markets: [INITIAL_MARKETS[1]],
      is_approved: false,
      avatar_url: freshProduceImg
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    farmer_id: 2,
    farmer_name: 'Sarah Jenkins',
    stall_name: 'Meadowbrook Organics',
    market_id: 1,
    market_name: 'Greenfield Community Farmers Market',
    category_id: 1,
    category_name: 'Fresh Vegetables',
    name: 'Heirloom Brandywine Tomatoes',
    description: 'Prized deep-red heirloom tomatoes with exceptional sweet, rich flavor and thin skins. Picked ripe at dawn.',
    price: 4.80,
    unit: 'kg',
    stock_quantity: 45,
    is_sold_out: false,
    image_url: freshProduceImg,
    harvest_date: '2026-09-24',
    organic_certified: true,
    rating_avg: 4.9,
    reviews_count: 18,
    created_at: '2026-09-20T08:00:00Z'
  },
  {
    id: 2,
    farmer_id: 2,
    farmer_name: 'Sarah Jenkins',
    stall_name: 'Meadowbrook Organics',
    market_id: 1,
    market_name: 'Greenfield Community Farmers Market',
    category_id: 1,
    category_name: 'Fresh Vegetables',
    name: 'Organic Sweet Bunch Carrots',
    description: 'Tender baby orange and purple carrots with vibrant lush leafy tops intact, perfect for roasting or raw snacking.',
    price: 3.50,
    unit: 'bunch',
    stock_quantity: 30,
    is_sold_out: false,
    image_url: heroBasketImg,
    harvest_date: '2026-09-25',
    organic_certified: true,
    rating_avg: 4.8,
    reviews_count: 12,
    created_at: '2026-09-21T09:15:00Z'
  },
  {
    id: 3,
    farmer_id: 2,
    farmer_name: 'Sarah Jenkins',
    stall_name: 'Meadowbrook Organics',
    market_id: 1,
    market_name: 'Greenfield Community Farmers Market',
    category_id: 5,
    category_name: 'Herbs & Microgreens',
    name: 'Fresh Italian Genovese Basil',
    description: 'Pungent, highly aromatic broadleaf basil grown in mineral-rich soil. Unwashed to preserve natural oils.',
    price: 2.75,
    unit: 'bunch',
    stock_quantity: 25,
    is_sold_out: false,
    image_url: freshProduceImg,
    harvest_date: '2026-09-25',
    organic_certified: true,
    rating_avg: 5.0,
    reviews_count: 8,
    created_at: '2026-09-22T08:30:00Z'
  },
  {
    id: 4,
    farmer_id: 3,
    farmer_name: 'Marcus Vance',
    stall_name: 'Golden Haven Honey & Bake',
    market_id: 3,
    market_name: 'Oakridge Heritage Artisan Market',
    category_id: 6,
    category_name: 'Honey & Preserves',
    name: 'Raw Spring Wildflower Honey',
    description: 'Unfiltered, unpasteurized honey harvested straight from hives bordering meadow clovers and blackberry brambles.',
    price: 11.50,
    unit: '500g jar',
    stock_quantity: 18,
    is_sold_out: false,
    image_url: artisanGoodsImg,
    harvest_date: '2026-09-15',
    organic_certified: true,
    rating_avg: 5.0,
    reviews_count: 24,
    created_at: '2026-09-18T10:00:00Z'
  },
  {
    id: 5,
    farmer_id: 3,
    farmer_name: 'Marcus Vance',
    stall_name: 'Golden Haven Honey & Bake',
    market_id: 3,
    market_name: 'Oakridge Heritage Artisan Market',
    category_id: 3,
    category_name: 'Artisanal Bakery',
    name: 'Country Sourdough Boule',
    description: 'Slow 36-hour cold fermented sourdough loaf with dark caramelized blistered crust and open, custardy crumb.',
    price: 7.00,
    unit: 'loaf',
    stock_quantity: 12,
    is_sold_out: false,
    image_url: artisanGoodsImg,
    harvest_date: '2026-09-25',
    organic_certified: true,
    rating_avg: 4.9,
    reviews_count: 31,
    created_at: '2026-09-24T05:00:00Z'
  },
  {
    id: 6,
    farmer_id: 2,
    farmer_name: 'Sarah Jenkins',
    stall_name: 'Meadowbrook Organics',
    market_id: 1,
    market_name: 'Greenfield Community Farmers Market',
    category_id: 1,
    category_name: 'Fresh Vegetables',
    name: 'Rainbow Swiss Chard',
    description: 'Vibrant golden, ruby, and white-stemmed greens packed with minerals. Crisp stems and tender leaves.',
    price: 3.20,
    unit: 'bunch',
    stock_quantity: 0,
    is_sold_out: true,
    image_url: freshProduceImg,
    harvest_date: '2026-09-23',
    organic_certified: true,
    rating_avg: 4.7,
    reviews_count: 9,
    created_at: '2026-09-21T07:45:00Z'
  },
  {
    id: 7,
    farmer_id: 3,
    farmer_name: 'Marcus Vance',
    stall_name: 'Golden Haven Honey & Bake',
    market_id: 3,
    market_name: 'Oakridge Heritage Artisan Market',
    category_id: 4,
    category_name: 'Farm Dairy & Eggs',
    name: 'Pasture-Raised Free-Range Brown Eggs',
    description: 'Dozen farm-fresh eggs from heritage Rhode Island Reds foraging freely in organic pastures. Deep golden yolks.',
    price: 6.50,
    unit: 'dozen',
    stock_quantity: 20,
    is_sold_out: false,
    image_url: heroBasketImg,
    harvest_date: '2026-09-24',
    organic_certified: true,
    rating_avg: 4.9,
    reviews_count: 15,
    created_at: '2026-09-23T06:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    reviewable_type: 'product',
    reviewable_id: 1,
    customer_id: 4,
    customer_name: 'Elena Rostova',
    rating: 5,
    comment: 'The sweetest tomatoes I have ever tasted! Made the best Caprese salad. Pre-ordering made pickup completely hassle-free.',
    created_at: '2026-09-22T14:32:00Z',
    farmer_reply: {
      id: 1001,
      reply: 'Thank you so much Elena! The sunny days last week really intensified the sugars. See you this Saturday!',
      created_at: '2026-09-22T16:10:00Z'
    }
  },
  {
    id: 2,
    reviewable_type: 'farmer',
    reviewable_id: 2,
    customer_id: 4,
    customer_name: 'Elena Rostova',
    rating: 5,
    comment: 'Meadowbrook stall is always impeccably organized. Produce was packed in a sturdy box waiting with my name tag.',
    created_at: '2026-09-21T18:20:00Z'
  },
  {
    id: 3,
    reviewable_type: 'product',
    reviewable_id: 5,
    customer_id: 4,
    customer_name: 'Elena Rostova',
    rating: 5,
    comment: 'Incredible sourdough! Crunchy crust and soft airy interior. Best bakery stall in the Valley.',
    created_at: '2026-09-20T11:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 101,
    order_number: 'ML-2026-0981',
    customer_id: 4,
    customer_name: 'Elena Rostova',
    customer_phone: '+1 (555) 621-4478',
    customer_email: 'customer@marketlink.org',
    farmer_id: 2,
    farmer_name: 'Sarah Jenkins',
    stall_name: 'Meadowbrook Organics',
    market_id: 1,
    market_name: 'Greenfield Community Farmers Market',
    market_address: '142 Orchard Grove Boulevard, Greenfield Plaza',
    items: [
      {
        id: 1,
        order_id: 101,
        product_id: 1,
        product_name: 'Heirloom Brandywine Tomatoes',
        unit: 'kg',
        quantity: 2,
        unit_price: 4.80,
        subtotal: 9.60,
        image_url: freshProduceImg
      },
      {
        id: 2,
        order_id: 101,
        product_id: 2,
        product_name: 'Organic Sweet Bunch Carrots',
        unit: 'bunch',
        quantity: 2,
        unit_price: 3.50,
        subtotal: 7.00,
        image_url: heroBasketImg
      }
    ],
    total_amount: 16.60,
    order_status: 'ready_for_pickup',
    pickup_date: '2026-09-26',
    pickup_time_slot: '08:00 AM - 10:00 AM',
    pickup_notes: 'Please pack in reusable cardboard crate if possible.',
    order_date: '2026-09-24T10:14:00Z',
    payment_method: 'cash_at_pickup',
    can_cancel: false
  },
  {
    id: 102,
    order_number: 'ML-2026-0985',
    customer_id: 4,
    customer_name: 'Elena Rostova',
    customer_phone: '+1 (555) 621-4478',
    customer_email: 'customer@marketlink.org',
    farmer_id: 3,
    farmer_name: 'Marcus Vance',
    stall_name: 'Golden Haven Honey & Bake',
    market_id: 3,
    market_name: 'Oakridge Heritage Artisan Market',
    market_address: '500 Heritage Square, Old Town Oakridge',
    items: [
      {
        id: 3,
        order_id: 102,
        product_id: 4,
        product_name: 'Raw Spring Wildflower Honey',
        unit: '500g jar',
        quantity: 1,
        unit_price: 11.50,
        subtotal: 11.50,
        image_url: artisanGoodsImg
      },
      {
        id: 4,
        order_id: 102,
        product_id: 5,
        product_name: 'Country Sourdough Boule',
        unit: 'loaf',
        quantity: 1,
        unit_price: 7.00,
        subtotal: 7.00,
        image_url: artisanGoodsImg
      }
    ],
    total_amount: 18.50,
    order_status: 'placed',
    pickup_date: '2026-09-27',
    pickup_time_slot: '08:30 AM - 11:30 AM',
    pickup_notes: 'Holding order for Sunday morning pickup.',
    order_date: '2026-09-25T08:05:00Z',
    payment_method: 'cash_at_pickup',
    can_cancel: true
  }
];

export const INITIAL_FAVORITES = [
  { id: 1, user_id: 4, item_type: 'product' as const, item_id: 1, created_at: '2026-09-20T12:00:00Z' },
  { id: 2, user_id: 4, item_type: 'farmer' as const, item_id: 2, created_at: '2026-09-21T09:00:00Z' }
];

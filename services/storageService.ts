
import { Order, User, SiteSettings, Product, UserRole, Event, OrderStatus } from '../types';

/**
 * ELITE PERSISTENCE ENGINE v3.0
 * Designed for absolute data safety. 
 * This engine handles migrations without data loss.
 */

const STORAGE_VERSION = '3.0';

const KEYS = {
  VERSION: 'elite_storage_version',
  ORDERS: 'elite_orders',
  USERS: 'elite_users',
  SETTINGS: 'elite_settings',
  PRODUCTS: 'elite_products',
  CURRENT_USER: 'elite_auth_session'
};

export const IMG_ROBUX = "https://lh3.googleusercontent.com/d/1JKYFlAaX6JLuqi6VHPAUNhOI7cCrvQQi=s0";
export const IMG_GIFT_CARDS = "https://lh3.googleusercontent.com/d/1kvQuB_u0Grx58B0QGrwCQJUAwtcaI9bQ=s0";

const DEFAULT_SETTINGS: SiteSettings = {
  name: 'Elite Robux Shop',
  description: 'Elite Robux Shop is a trusted Bangladesh-based store for buying Robux and Roblox Gift Cards easily and securely through Roblox Groups.',
  logoUrl: 'https://lh3.googleusercontent.com/d/19j3CzSflC7AUrmiWimrzTNVDhJvFIQs9=s0',
  faviconUrl: 'https://lh3.googleusercontent.com/d/19j3CzSflC7AUrmiWimrzTNVDhJvFIQs9=s0',
  carouselImages: [
    'https://lh3.googleusercontent.com/d/1eLp1_Ks1gnQiupH6lCaY09PlK4UEO0PX=s0',
    'https://lh3.googleusercontent.com/d/1DHCWUS4cbyT4oEsIVwS3JqdCvFocAz4z=s0',
    'https://lh3.googleusercontent.com/d/1KHZzxgmxbPwx-jfooglpKwUBOQp20eRy=s0'
  ],
  events: []
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'robux-custom',
    type: 'robux',
    title: 'Robux',
    price: 3.0,
    amount: 1,
    description: 'Direct Robux transfer to your account.',
    image: IMG_ROBUX,
    active: true
  },
  {
    id: 'gc-demo',
    type: 'giftcard',
    title: '$10 Roblox Gift Card',
    price: 1200,
    amount: 10,
    description: 'Redeem for 800 Robux + Exclusive Virtual Item',
    image: IMG_GIFT_CARDS,
    active: true
  }
];

const safeParse = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data === null || data === "undefined") return defaultValue;
    return JSON.parse(data) as T;
  } catch (e) {
    console.warn(`Storage Notice: Structure mismatch for ${key}. Using safe fallback.`);
    return defaultValue;
  }
};

export const storageService = {
  // Utility for converting Google Drive links to direct image uplinks
  formatImageUrl: (url: string): string => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}=s0`;
      }
    }
    return url;
  },

  // ID Generator to prevent collisions in the database
  generateId: (prefix: string = 'ID'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  },

  init: () => {
    // 1. Check for legacy version and perform passive migration
    const currentVer = localStorage.getItem(KEYS.VERSION);
    
    // 2. Additive-Only Initialization: We only set defaults if the database is empty (null)
    // This ensures your orders and users are NEVER cleared by a code update.
    if (localStorage.getItem(KEYS.PRODUCTS) === null) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (localStorage.getItem(KEYS.USERS) === null) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
    if (localStorage.getItem(KEYS.SETTINGS) === null) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (localStorage.getItem(KEYS.ORDERS) === null) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    }

    // 3. Authority Guard: Ensure the Main Admin exists without resetting their password/settings
    const users = storageService.getUsers();
    const adminEmail = 'saminsingdho@gmail.com';
    const hasAdmin = users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
    
    if (!hasAdmin) {
      const mainAdmin: User = {
        id: 'ADMIN-CORE-001',
        username: 'samin080g',
        email: adminEmail,
        passwordHash: 'Apon474001',
        role: 'main_admin',
        createdAt: Date.now()
      };
      users.push(mainAdmin);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }

    // 4. Update Version Stamp without touching the data
    localStorage.setItem(KEYS.VERSION, STORAGE_VERSION);
    console.log(`ELITE PERSISTENCE ENGINE v${STORAGE_VERSION} ACTIVE`);
  },

  // USER ACCESSORS
  getUsers: (): User[] => safeParse(KEYS.USERS, []),
  
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const session = safeParse<User | null>(KEYS.CURRENT_USER, null);
    if (!session) return null;
    const users = storageService.getUsers();
    // Verification: Ensure the session user still exists in DB
    const dbUser = users.find(u => u.id === session.id);
    return dbUser || null;
  },

  login: (user: User) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
  logout: () => localStorage.removeItem(KEYS.CURRENT_USER),

  // SETTINGS ACCESSORS
  getSettings: (): SiteSettings => safeParse(KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (s: SiteSettings) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)),

  // PRODUCT ACCESSORS
  getProducts: (): Product[] => safeParse(KEYS.PRODUCTS, DEFAULT_PRODUCTS),
  
  saveProduct: (product: Product) => {
    const products = storageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push(product);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  deleteProduct: (id: string) => {
    const products = storageService.getProducts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  // ORDER ACCESSORS
  getOrders: (): Order[] => safeParse(KEYS.ORDERS, []),
  
  getUserOrders: (userId: string): Order[] => {
    return storageService.getOrders().filter(o => o.userId === userId);
  },

  saveOrder: (order: Order) => {
    const orders = storageService.getOrders();
    // Add to the beginning of the array for reverse chronological order
    orders.unshift(order);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const orders = storageService.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
  }
};

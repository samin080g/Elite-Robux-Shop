
export type PaymentMethod = 'Nagad' | 'bKash';
export type UserRole = 'user' | 'admin' | 'main_admin';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  DONE = 'Done',
  CANCELLED = 'Cancelled'
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: number;
}

export interface Event {
  id: string;
  name: string;
  targetDate: number; // Timestamp
  active: boolean;
  discountPercentage?: number;
  applicableProductIds?: string[];
}

export interface SiteSettings {
  name: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  carouselImages: string[];
  events: Event[];
}

export interface Product {
  id: string;
  type: 'robux' | 'giftcard';
  title: string;
  price: number; // Base price
  originalPrice?: number; // Visual reference for static discounts
  amount: number | string;
  description: string;
  image: string;
  active: boolean;
}

export interface GiftCard {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  robloxUsername: string;
  productName: string;
  amount: number | string;
  quantity: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  transactionId: string;
  status: OrderStatus;
  timestamp: number;
}

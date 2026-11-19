export type PageView =
  | 'home'
  | 'menu'
  | 'offers'
  | 'orders'
  | 'about'
  | 'profile'
  | 'admin';

export type FoodCategory =
  | 'Healthy Meals'
  | 'Quick Bites'
  | 'Sandwiches & Wraps'
  | 'Fresh Drinks'
  | 'Late Night Combos';

export type OrderStatus =
  | 'Order Placed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered';

export type PaymentMethod = 'Cash on Delivery' | 'Demo Online Payment (UPI / Card)';

export interface Product {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isBestseller: boolean;
  isAvailable: boolean;
  prepTime: string;
  calories: string;
  ecoPackaging: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DeliveryLocation {
  hostelName: string;
  roomNumber: string;
  landmark?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerMobile: string;
  hostelName: string;
  roomNumber: string;
  deliveryInstructions: string;
  paymentMethod: PaymentMethod;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode: string | null;
  total: number;
  status: OrderStatus;
  estimatedTime: string;
  ecoBadge: boolean;
}

export interface CustomerProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  mobile: string;
  hostelName: string;
  roomNumber: string;
  referralCode: string;
  favorites: string[];
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  type: 'percent' | 'flat' | 'free_delivery';
  value: number;
  maxDiscount?: number;
  minOrder: number;
  tag: string;
}

export interface AppSettings {
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  campusName: string;
  operatingHours: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

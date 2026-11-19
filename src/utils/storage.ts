import {
  AppSettings,
  CartItem,
  Coupon,
  CustomerProfile,
  DeliveryLocation,
  Order,
  Product,
} from '../types';
import {
  INITIAL_CUSTOMER_PROFILE,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  STUDENT_COUPONS,
} from '../data/seedData';

const KEYS = {
  PRODUCTS: 'greenbite_products_v1',
  CART: 'greenbite_cart_v1',
  ORDERS: 'greenbite_orders_v1',
  PROFILE: 'greenbite_profile_v1',
  COUPON: 'greenbite_coupon_v1',
  LOCATION: 'greenbite_location_v1',
  SETTINGS: 'greenbite_settings_v1',
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}

export function getInitialProducts(): Product[] {
  return loadFromStorage<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function saveProducts(products: Product[]): void {
  saveToStorage(KEYS.PRODUCTS, products);
}

export function getInitialCart(): CartItem[] {
  return loadFromStorage<CartItem[]>(KEYS.CART, []);
}

export function saveCart(cart: CartItem[]): void {
  saveToStorage(KEYS.CART, cart);
}

export function getInitialOrders(): Order[] {
  return loadFromStorage<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
}

export function saveOrders(orders: Order[]): void {
  saveToStorage(KEYS.ORDERS, orders);
}

export function getInitialProfile(): CustomerProfile {
  return loadFromStorage<CustomerProfile>(KEYS.PROFILE, INITIAL_CUSTOMER_PROFILE);
}

export function saveProfile(profile: CustomerProfile): void {
  saveToStorage(KEYS.PROFILE, profile);
}

export function getInitialCoupon(): string | null {
  return loadFromStorage<string | null>(KEYS.COUPON, null);
}

export function saveCoupon(code: string | null): void {
  saveToStorage(KEYS.COUPON, code);
}

export function getInitialLocation(): DeliveryLocation {
  return loadFromStorage<DeliveryLocation>(KEYS.LOCATION, {
    hostelName: INITIAL_CUSTOMER_PROFILE.hostelName,
    roomNumber: INITIAL_CUSTOMER_PROFILE.roomNumber,
  });
}

export function saveLocation(location: DeliveryLocation): void {
  saveToStorage(KEYS.LOCATION, location);
}

export function getInitialSettings(): AppSettings {
  return loadFromStorage<AppSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  saveToStorage(KEYS.SETTINGS, settings);
}

export function resetAllDemoData(): void {
  Object.values(KEYS).forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // Ignore
    }
  });
}

export function calculateDiscount(
  subtotal: number,
  deliveryFee: number,
  couponCode: string | null
): { discount: number; effectiveDeliveryFee: number; coupon: Coupon | null; error?: string } {
  if (!couponCode) {
    return { discount: 0, effectiveDeliveryFee: deliveryFee, coupon: null };
  }
  const normalized = couponCode.trim().toUpperCase();
  const coupon = STUDENT_COUPONS.find((c) => c.code === normalized) || null;
  if (!coupon) {
    return {
      discount: 0,
      effectiveDeliveryFee: deliveryFee,
      coupon: null,
      error: 'Invalid promo code. Try FIRST20, ROOMIE20, or STUDY15.',
    };
  }
  if (subtotal < coupon.minOrder) {
    return {
      discount: 0,
      effectiveDeliveryFee: deliveryFee,
      coupon,
      error: `Minimum order of ₹${coupon.minOrder} required for ${coupon.code}.`,
    };
  }
  if (coupon.type === 'free_delivery') {
    return {
      discount: deliveryFee,
      effectiveDeliveryFee: 0,
      coupon,
    };
  }
  if (coupon.type === 'flat') {
    return {
      discount: Math.min(coupon.value, subtotal),
      effectiveDeliveryFee: deliveryFee,
      coupon,
    };
  }
  const rawPercent = Math.round((subtotal * coupon.value) / 100);
  const capped = coupon.maxDiscount ? Math.min(rawPercent, coupon.maxDiscount) : rawPercent;
  return {
    discount: capped,
    effectiveDeliveryFee: deliveryFee,
    coupon,
  };
}

export function buildWhatsAppOrderUrl(
  whatsappNumber: string,
  items: { name: string; quantity: number; price: number }[],
  location: DeliveryLocation,
  customerName?: string
): string {
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '') || '919876543210';
  const lines: string[] = [
    'Hi GreenBite Team! I would like to place a late-night campus order:',
    '',
  ];

  if (items.length > 0) {
    let sum = 0;
    items.forEach((item) => {
      const lineTotal = item.price * item.quantity;
      sum += lineTotal;
      lines.push(`• ${item.quantity}x ${item.name} — ₹${lineTotal}`);
    });
    lines.push('');
    lines.push(`Subtotal: ₹${sum}`);
  } else {
    lines.push('• 1x Late Night Study Combo — ₹179');
    lines.push('• 1x Paneer Wrap — ₹129');
    lines.push('');
    lines.push('Sample Order Total: ₹308');
  }

  lines.push('');
  lines.push(`Hostel: ${location.hostelName}`);
  lines.push(`Room No: ${location.roomNumber || 'Main Gate'}`);
  if (customerName) {
    lines.push(`Name: ${customerName}`);
  }
  lines.push('Packaging: 100% Biodegradable & Plastic-Free');

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function generateOrderId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `GB-2611-${randomDigits}`;
}

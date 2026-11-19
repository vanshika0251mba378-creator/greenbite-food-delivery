import React, { useState } from 'react';
import {
  ArrowRight,
  Leaf,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import {
  AppSettings,
  CartItem,
  CustomerProfile,
  DeliveryLocation,
  Product,
} from '../types';
import { STUDENT_COUPONS } from '../data/seedData';
import { buildWhatsAppOrderUrl, calculateDiscount } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  appliedCoupon: string | null;
  onApplyCoupon: (code: string | null) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onBrowseMenu: () => void;
  settings: AppSettings;
  location: DeliveryLocation;
  profile: CustomerProfile;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  appliedCoupon,
  onApplyCoupon,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  onBrowseMenu,
  settings,
  location,
  profile,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const detailedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((entry): entry is { product: Product; quantity: number } => entry !== null);

  const subtotal = detailedItems.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );

  const baseDeliveryFee =
    subtotal === 0 || subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;

  const { discount, effectiveDeliveryFee, error } = calculateDiscount(
    subtotal,
    baseDeliveryFee,
    appliedCoupon
  );

  const totalPayable = Math.max(0, subtotal + effectiveDeliveryFee - (appliedCoupon === 'GREENFREE' ? 0 : discount));

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const result = calculateDiscount(subtotal, baseDeliveryFee, code);
    if (result.error) {
      setCouponFeedback(result.error);
    } else {
      onApplyCoupon(code);
      setCouponFeedback(`Promo code ${code} applied!`);
      setCouponInput('');
    }
  };

  const whatsappUrl = buildWhatsAppOrderUrl(
    settings.whatsappNumber,
    detailedItems.map((entry) => ({
      name: entry.product.name,
      quantity: entry.quantity,
      price: entry.product.price,
    })),
    location,
    profile.name
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#12241A]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-[#FAF8F3] h-full flex flex-col border-l border-[#E4DFD3] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E4DFD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#143D29]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#12241A]">
              Your GreenBite Cart
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-lg text-[#4A5D52] hover:bg-[#F2EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {detailedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F2EDE2] text-[#143D29] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#12241A]">
                Your study meal bag is empty
              </h3>
              <p className="text-sm text-[#4A5D52] mt-1 max-w-xs">
                Add fresh wraps, healthy bowls, or a Late Night Study Combo delivered in 15–20 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBrowseMenu();
                }}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-medium transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-white border border-[#E4DFD3] flex items-center gap-2.5 text-xs text-[#143D29]">
                <Leaf className="w-4 h-4 text-[#2D7A47] shrink-0" aria-hidden="true" />
                <span>
                  100% plastic-free biodegradable packaging included free with every order.
                </span>
              </div>

              <div className="divide-y divide-[#E4DFD3] bg-white border border-[#E4DFD3] rounded-xl">
                {detailedItems.map(({ product, quantity }) => (
                  <div key={product.id} className="p-3.5 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-[#F2EDE2] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-semibold text-[#12241A] truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#6E7E74] font-mono tabular-nums mt-0.5">
                        ₹{product.price} × {quantity} = ₹{product.price * quantity}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-[#E4DFD3] rounded-lg bg-[#FAF8F3]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, -1)}
                            aria-label={`Decrease ${product.name}`}
                            className="p-1.5 text-[#143D29] hover:bg-[#E4DFD3]/60 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 font-mono text-xs font-semibold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, 1)}
                            aria-label={`Increase ${product.name}`}
                            className="p-1.5 text-[#143D29] hover:bg-[#E4DFD3]/60 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="p-1.5 text-[#6E7E74] hover:text-[#B91C1C] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="bg-white border border-[#E4DFD3] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#12241A] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#2D7A47]" aria-hidden="true" />
                    Student Promo Code
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyCoupon(null);
                        setCouponFeedback(null);
                      }}
                      className="text-xs text-[#B91C1C] hover:underline"
                    >
                      Remove {appliedCoupon}
                    </button>
                  )}
                </div>

                <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code (e.g. FIRST20)"
                    className="flex-1 px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47] uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#143D29] hover:bg-[#2D7A47] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>

                {(couponFeedback || error) && (
                  <p className={`text-xs ${error ? 'text-[#B91C1C]' : 'text-[#2D7A47]'}`}>
                    {error || couponFeedback}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {STUDENT_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        const res = calculateDiscount(subtotal, baseDeliveryFee, c.code);
                        if (res.error) {
                          setCouponFeedback(res.error);
                        } else {
                          onApplyCoupon(c.code);
                          setCouponFeedback(`Applied ${c.code}`);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ${
                        appliedCoupon === c.code
                          ? 'bg-[#143D29] text-white border-[#143D29]'
                          : 'bg-[#FAF8F3] text-[#143D29] border-[#E4DFD3] hover:border-[#2D7A47]'
                      }`}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bill Summary & Actions */}
        {detailedItems.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E4DFD3] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#4A5D52]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#4A5D52]">
                <span>
                  Hostel Delivery{' '}
                  {subtotal >= settings.freeDeliveryThreshold && '(Free above ₹249)'}
                </span>
                <span className="font-mono tabular-nums">
                  {effectiveDeliveryFee === 0 ? 'FREE' : `₹${effectiveDeliveryFee}`}
                </span>
              </div>
              {(discount > 0 || appliedCoupon === 'GREENFREE') && (
                <div className="flex justify-between text-[#2D7A47] font-medium">
                  <span>Promo Discount ({appliedCoupon})</span>
                  <span className="font-mono tabular-nums">
                    -₹{appliedCoupon === 'GREENFREE' ? baseDeliveryFee : discount}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-[#F2EDE2] flex justify-between text-base font-bold text-[#12241A]">
                <span>Total Payable</span>
                <span className="font-mono tabular-nums">₹{totalPayable}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-[#143D29] hover:bg-[#2D7A47] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-[#2D7A47] text-[#143D29] hover:bg-[#F2EDE2] font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

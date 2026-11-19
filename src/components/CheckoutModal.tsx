import React, { useState } from 'react';
import { Banknote, CheckCircle2, CreditCard, Leaf, ShieldAlert, X } from 'lucide-react';
import {
  AppSettings,
  CartItem,
  CustomerProfile,
  DeliveryLocation,
  Order,
  PaymentMethod,
  Product,
} from '../types';
import { CAMPUS_HOSTELS } from '../data/seedData';
import { calculateDiscount, generateOrderId } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  appliedCoupon: string | null;
  profile: CustomerProfile;
  location: DeliveryLocation;
  settings: AppSettings;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  appliedCoupon,
  profile,
  location,
  settings,
  onOrderComplete,
}) => {
  const [customerName, setCustomerName] = useState(profile.name || '');
  const [customerMobile, setCustomerMobile] = useState(profile.mobile || '');
  const [hostelName, setHostelName] = useState(location.hostelName || CAMPUS_HOSTELS[0]);
  const [roomNumber, setRoomNumber] = useState(location.roomNumber || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [formError, setFormError] = useState<string | null>(null);

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

  const { discount, effectiveDeliveryFee } = calculateDiscount(
    subtotal,
    baseDeliveryFee,
    appliedCoupon
  );

  const total = Math.max(
    0,
    subtotal + effectiveDeliveryFee - (appliedCoupon === 'GREENFREE' ? 0 : discount)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    const cleanPhone = customerMobile.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!roomNumber.trim()) {
      setFormError('Please enter your room number or hostel gate detail.');
      return;
    }

    const newOrder: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerMobile: cleanPhone.slice(-10),
      hostelName,
      roomNumber: roomNumber.trim(),
      deliveryInstructions: deliveryInstructions.trim() || 'Deliver to hostel reception / room door',
      paymentMethod,
      items: detailedItems.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })),
      subtotal,
      deliveryFee: effectiveDeliveryFee,
      discount: appliedCoupon === 'GREENFREE' ? baseDeliveryFee : discount,
      couponCode: appliedCoupon,
      total,
      status: 'Order Placed',
      estimatedTime: '15–20 minutes',
      ecoBadge: true,
    };

    onOrderComplete(newOrder);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12241A]/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E4DFD3] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#FAF8F3] border-b border-[#E4DFD3] flex items-center justify-between">
          <div>
            <h2 id="checkout-title" className="font-display text-xl font-bold text-[#12241A]">
              Campus Hostel Checkout
            </h2>
            <p className="text-xs text-[#4A5D52] mt-0.5">
              15–20 min delivery · DBS Global University, Dehradun
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-lg text-[#4A5D52] hover:bg-[#E4DFD3]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formError && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Student / Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Vanshika Sharma"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Hostel / Campus Block *
              </label>
              <select
                value={hostelName}
                onChange={(e) => setHostelName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              >
                {CAMPUS_HOSTELS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Room Number / Gate *
              </label>
              <input
                type="text"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. G-304 or Main Gate"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
              Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="e.g. Call on arrival, leave with hostel guard, less spicy"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-[#12241A]">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#143D29] bg-[#FAF8F3] ring-1 ring-[#143D29]'
                    : 'border-[#E4DFD3] bg-white hover:bg-[#FAF8F3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#12241A]">
                    <Banknote className="w-4 h-4 text-[#2D7A47]" />
                    <span>Cash on Delivery</span>
                  </div>
                  {paymentMethod === 'Cash on Delivery' && (
                    <CheckCircle2 className="w-4 h-4 text-[#2D7A47]" />
                  )}
                </div>
                <p className="text-xs text-[#4A5D52] mt-1">
                  Pay cash or campus UPI directly on hostel delivery.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Demo Online Payment (UPI / Card)')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'Demo Online Payment (UPI / Card)'
                    ? 'border-[#143D29] bg-[#FAF8F3] ring-1 ring-[#143D29]'
                    : 'border-[#E4DFD3] bg-white hover:bg-[#FAF8F3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-sm text-[#12241A]">
                    <CreditCard className="w-4 h-4 text-[#2D7A47]" />
                    <span>Demo Online Payment</span>
                  </div>
                  {paymentMethod === 'Demo Online Payment (UPI / Card)' && (
                    <CheckCircle2 className="w-4 h-4 text-[#2D7A47]" />
                  )}
                </div>
                <p className="text-xs text-[#4A5D52] mt-1">
                  Simulated UPI / Card confirmation for prototype testing.
                </p>
              </button>
            </div>

            {paymentMethod === 'Demo Online Payment (UPI / Card)' && (
              <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2 text-xs text-[#92400E]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Demo Prototype Notice: No real money is charged or card/UPI data processed. Clicking Confirm Order simulates instant payment success.
                </span>
              </div>
            )}
          </div>

          {/* Summary Bar */}
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E4DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#2D7A47]">
                <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Delivered with Care for the Planet</span>
              </div>
              <p className="text-sm text-[#4A5D52]">
                {detailedItems.reduce((s, i) => s + i.quantity, 0)} items · Total Payable:{' '}
                <span className="font-mono font-bold text-[#12241A] tabular-nums">₹{total}</span>
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Confirm Order · ₹{total}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

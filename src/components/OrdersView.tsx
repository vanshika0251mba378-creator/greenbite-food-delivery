import React from 'react';
import {
  CheckCircle2,
  Clock,
  Leaf,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Order, OrderStatus, PageView } from '../types';

interface OrdersViewProps {
  orders: Order[];
  latestOrderId: string | null;
  onAdvanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onReorder: (order: Order) => void;
  onNavigate: (page: PageView) => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'Order Placed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  latestOrderId,
  onAdvanceOrderStatus,
  onReorder,
  onNavigate,
}) => {
  const latestOrder = latestOrderId
    ? orders.find((o) => o.id === latestOrderId) || orders[0]
    : null;

  const renderTracker = (order: Order) => {
    const currentIdx = ORDER_STEPS.indexOf(order.status);
    const nextStatus =
      currentIdx >= 0 && currentIdx < ORDER_STEPS.length - 1
        ? ORDER_STEPS[currentIdx + 1]
        : null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ORDER_STEPS.map((step, index) => {
            const isCompleted = index <= currentIdx;
            const isCurrent = index === currentIdx;
            return (
              <div
                key={step}
                className={`p-3 rounded-xl border transition-colors ${
                  isCurrent
                    ? 'bg-[#143D29] text-white border-[#143D29]'
                    : isCompleted
                      ? 'bg-[#FAF8F3] text-[#143D29] border-[#2D7A47]'
                      : 'bg-white text-[#6E7E74] border-[#E4DFD3]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span>0{index + 1}</span>
                  {index === 0 && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {index === 1 && <Package className="w-3.5 h-3.5" />}
                  {index === 2 && <Truck className="w-3.5 h-3.5" />}
                  {index === 3 && <Leaf className="w-3.5 h-3.5" />}
                </div>
                <p className="text-xs font-semibold">{step}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#4A5D52]">
          <span>
            Simulated order tracking (no live rider GPS) · Estimated arrival: {order.estimatedTime}
          </span>
          {nextStatus && (
            <button
              type="button"
              onClick={() => onAdvanceOrderStatus(order.id, nextStatus)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2EDE2] hover:bg-[#E4DFD3] text-[#143D29] font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Simulate: Mark &ldquo;{nextStatus}&rdquo;</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#12241A]">
            My Orders &amp; Tracking
          </h1>
          <p className="text-sm sm:text-base text-[#4A5D52] mt-1">
            Follow your meal from kitchen prep to your hostel room.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('menu')}
          className="px-4 py-2 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors self-start sm:self-auto"
        >
          Order More Food
        </button>
      </div>

      {/* Confirmation Banner for Newly Placed Order */}
      {latestOrder && (
        <section className="bg-white border-2 border-[#2D7A47] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#F2EDE2]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7A47]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Order Confirmed</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#12241A]">
                Thank you, {latestOrder.customerName}! Order{' '}
                <span className="font-mono">{latestOrder.id}</span>
              </h2>
              <p className="text-sm text-[#4A5D52]">
                Delivering to {latestOrder.hostelName}, Room {latestOrder.roomNumber} ·{' '}
                {latestOrder.paymentMethod}
              </p>
            </div>

            <div className="bg-[#FAF8F3] border border-[#E4DFD3] rounded-xl px-4 py-3 text-left md:text-right">
              <span className="text-xs text-[#6E7E74] block">Estimated Delivery Time</span>
              <span className="font-display text-lg font-bold text-[#143D29] inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                15–20 minutes
              </span>
            </div>
          </div>

          {renderTracker(latestOrder)}

          <div className="bg-[#FAF8F3] border border-[#E4DFD3] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-[#12241A]">
                {latestOrder.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D7A47]">
                <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Delivered with Care for the Planet</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#6E7E74] block">Total Paid / Payable</span>
              <span className="font-mono text-xl font-bold text-[#12241A] tabular-nums">
                ₹{latestOrder.total}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* All Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white border border-[#E4DFD3] rounded-2xl p-12 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-[#2D7A47] mx-auto" />
          <h2 className="font-display text-xl font-bold text-[#12241A]">
            No orders placed yet
          </h2>
          <p className="text-sm text-[#4A5D52]">
            Order a healthy wrap, veg bowl, or study combo to see simulated live tracking here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="px-5 py-2.5 rounded-lg bg-[#143D29] text-white text-sm font-semibold"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <h2 className="font-display text-xl font-bold text-[#12241A]">
            Order History ({orders.length})
          </h2>

          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white border border-[#E4DFD3] rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2EDE2]">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E7E74]">
                    <span className="font-mono font-bold text-[#143D29] text-sm">
                      {order.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#2D7A47]">{order.status}</span>
                  </div>
                  <p className="text-sm text-[#4A5D52] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2D7A47] shrink-0" aria-hidden="true" />
                    <span>
                      {order.customerName} · {order.hostelName}, Room {order.roomNumber}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#6E7E74] block">Total</span>
                    <span className="font-mono text-lg font-bold text-[#12241A] tabular-nums">
                      ₹{order.total}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onReorder(order)}
                    className="px-4 py-2 rounded-lg border border-[#E4DFD3] bg-[#FAF8F3] hover:bg-[#143D29] hover:text-white text-xs font-semibold text-[#143D29] transition-colors whitespace-nowrap"
                  >
                    Reorder
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E4DFD3]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-[#F2EDE2] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#12241A] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs font-mono text-[#4A5D52] tabular-nums">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.status !== 'Delivered' && renderTracker(order)}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F2EDE2] text-xs text-[#4A5D52]">
                <span className="inline-flex items-center gap-1.5 text-[#2D7A47] font-medium">
                  <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
                  Delivered with Care for the Planet
                </span>
                <span>Payment: {order.paymentMethod}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Check,
  Edit3,
  MessageCircle,
  Package,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {
  AppSettings,
  FoodCategory,
  Order,
  OrderStatus,
  PageView,
  Product,
} from '../types';
import { FOOD_CATEGORIES, INITIAL_PRODUCTS, WEEKLY_SALES_DATA } from '../data/seedData';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  settings: AppSettings;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleAvailability: (productId: string) => void;
  onUpdateSettings: (next: AppSettings) => void;
  onResetDemo: () => void;
  onNavigate: (page: PageView) => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'settings';

const STATUS_OPTIONS: OrderStatus[] = [
  'Order Placed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

const SAMPLE_IMAGE_PRESETS = INITIAL_PRODUCTS.map((p) => ({
  label: p.name,
  url: p.image,
}));

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  orders,
  settings,
  onUpdateOrderStatus,
  onSaveProduct,
  onDeleteProduct,
  onToggleAvailability,
  onUpdateSettings,
  onResetDemo,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Product Form Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Settings State
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappNumber);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState(String(settings.deliveryFee));
  const [freeThresholdInput, setFreeThresholdInput] = useState(
    String(settings.freeDeliveryThreshold)
  );
  const [hoursInput, setHoursInput] = useState(settings.operatingHours);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Compute Analytics Metrics
  const metrics = useMemo(() => {
    const baseRevenue = WEEKLY_SALES_DATA.reduce((s, d) => s + d.revenue, 0);
    const baseOrders = WEEKLY_SALES_DATA.reduce((s, d) => s + d.orders, 0);
    const liveOrdersRevenue = orders.reduce((s, o) => s + o.total, 0);

    const totalOrdersCount = baseOrders + orders.length;
    const totalSalesAmount = baseRevenue + liveOrdersRevenue;
    const uniqueCustomers = new Set(orders.map((o) => o.customerMobile)).size + 142;

    // Bestselling products tally from orders + baseline popularity
    const tally = new Map<string, { name: string; units: number; revenue: number }>();
    products.forEach((p) => {
      tally.set(p.id, {
        name: p.name,
        units: Math.round(p.reviewCount * 0.45),
        revenue: Math.round(p.reviewCount * 0.45) * p.price,
      });
    });

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = tally.get(item.productId) || {
          name: item.name,
          units: 0,
          revenue: 0,
        };
        existing.units += item.quantity;
        existing.revenue += item.price * item.quantity;
        tally.set(item.productId, existing);
      });
    });

    const bestsellers = Array.from(tally.values())
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    return {
      totalOrdersCount,
      totalSalesAmount,
      uniqueCustomers,
      bestsellers,
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
      if (
        q &&
        !o.id.toLowerCase().includes(q) &&
        !o.customerName.toLowerCase().includes(q) &&
        !o.hostelName.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const openNewProductModal = () => {
    setEditingProduct({
      id: `gb-${Date.now()}`,
      name: '',
      category: 'Healthy Meals',
      price: 119,
      description: '',
      image: SAMPLE_IMAGE_PRESETS[0].url,
      rating: 4.8,
      reviewCount: 1,
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      prepTime: '12 min',
      calories: '320 kcal',
      ecoPackaging: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct({ ...product });
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;
    onSaveProduct({
      ...editingProduct,
      name: editingProduct.name.trim(),
      description: editingProduct.description.trim() || 'Freshly prepared healthy campus meal.',
      price: Math.max(1, Number(editingProduct.price) || 99),
    });
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      whatsappNumber: whatsappInput.replace(/[^\d]/g, '') || '919876543210',
      deliveryFee: Math.max(0, Number(deliveryFeeInput) || 0),
      freeDeliveryThreshold: Math.max(0, Number(freeThresholdInput) || 0),
      operatingHours: hoursInput.trim() || settings.operatingHours,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const maxWeeklyRevenue = Math.max(...WEEKLY_SALES_DATA.map((d) => d.revenue), 1);
  const maxBestsellerUnits = Math.max(...metrics.bestsellers.map((b) => b.units), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4DFD3]">
        <div>
          <p className="text-xs font-semibold text-[#2D7A47] uppercase tracking-wide">
            Demo Admin Console
          </p>
          <h1 className="font-display text-3xl font-bold text-[#12241A]">
            GreenBite Kitchen Operations
          </h1>
          <p className="text-sm text-[#4A5D52] mt-1">
            Manage menu items, live demo orders, sales analytics, and WhatsApp storefront settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="px-4 py-2 rounded-lg border border-[#E4DFD3] bg-white hover:bg-[#F2EDE2] text-sm font-semibold text-[#143D29] transition-colors"
          >
            View Live Menu
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E4DFD3] bg-white hover:bg-[#FEF2F2] hover:text-[#B91C1C] text-sm font-medium text-[#4A5D52] transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#F2EDE2] p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
        {(
          [
            { id: 'overview', label: 'Analytics & Overview', icon: BarChart3 },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Menu Products (${products.length})`, icon: Package },
            { id: 'settings', label: 'WhatsApp & Settings', icon: Settings },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-white text-[#143D29] shadow-xs font-semibold'
                  : 'text-[#4A5D52] hover:text-[#12241A]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI Strip (Always Visible on Overview, Orders) */}
      {(activeTab === 'overview' || activeTab === 'orders') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E4DFD3] rounded-xl p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#6E7E74]">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
            </div>
            <p className="font-mono text-2xl font-bold text-[#12241A] tabular-nums">
              {metrics.totalOrdersCount}
            </p>
            <p className="text-xs text-[#2D7A47] font-medium">
              {orders.filter((o) => o.status !== 'Delivered').length} active campus orders
            </p>
          </div>

          <div className="bg-white border border-[#E4DFD3] rounded-xl p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#6E7E74]">
              <span>Total Sales</span>
              <TrendingUp className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
            </div>
            <p className="font-mono text-2xl font-bold text-[#12241A] tabular-nums">
              ₹{metrics.totalSalesAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-[#4A5D52]">7-day campus revenue + live orders</p>
          </div>

          <div className="bg-white border border-[#E4DFD3] rounded-xl p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#6E7E74]">
              <span>Total Customers</span>
              <Users className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
            </div>
            <p className="font-mono text-2xl font-bold text-[#12241A] tabular-nums">
              {metrics.uniqueCustomers}
            </p>
            <p className="text-xs text-[#4A5D52]">DBS Global University students</p>
          </div>

          <div className="bg-white border border-[#E4DFD3] rounded-xl p-5 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#6E7E74]">
              <span>Top Selling Item</span>
              <Package className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-bold text-[#12241A] truncate">
              {metrics.bestsellers[0]?.name || 'Late Night Study Combo'}
            </p>
            <p className="text-xs font-mono text-[#2D7A47] tabular-nums">
              {metrics.bestsellers[0]?.units || 0} units sold
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 7-Day Revenue Bar Chart */}
            <div className="lg:col-span-7 bg-white border border-[#E4DFD3] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#12241A]">
                    Weekly Revenue Analytics (₹)
                  </h2>
                  <p className="text-xs text-[#4A5D52]">
                    Hover any bar to inspect daily revenue and order volume.
                  </p>
                </div>
                {hoveredDay !== null && (
                  <div className="text-right font-mono text-xs bg-[#FAF8F3] border border-[#E4DFD3] px-3 py-1.5 rounded-lg tabular-nums">
                    <span className="font-bold text-[#143D29]">
                      {WEEKLY_SALES_DATA[hoveredDay].day}: ₹
                      {WEEKLY_SALES_DATA[hoveredDay].revenue.toLocaleString('en-IN')}
                    </span>{' '}
                    <span className="text-[#4A5D52]">
                      ({WEEKLY_SALES_DATA[hoveredDay].orders} orders)
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <div className="grid grid-cols-7 gap-3 items-end h-52 border-b border-[#E4DFD3] pb-3">
                  {WEEKLY_SALES_DATA.map((d, idx) => {
                    const heightPct = Math.round((d.revenue / maxWeeklyRevenue) * 100);
                    const isHovered = hoveredDay === idx;
                    return (
                      <div
                        key={d.day}
                        onMouseEnter={() => setHoveredDay(idx)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="h-full flex flex-col justify-end items-center gap-2 cursor-pointer"
                      >
                        <span className="font-mono text-[11px] text-[#4A5D52] tabular-nums">
                          ₹{(d.revenue / 1000).toFixed(1)}k
                        </span>
                        <div className="w-full max-w-[44px] h-36 flex items-end">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-lg transition-colors duration-150 ${
                              isHovered ? 'bg-[#2D7A47]' : 'bg-[#143D29]'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-7 gap-3 pt-2 text-center text-xs font-medium text-[#4A5D52]">
                  {WEEKLY_SALES_DATA.map((d) => (
                    <span key={d.day}>{d.day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bestselling Products Horizontal Bar Chart */}
            <div className="lg:col-span-5 bg-white border border-[#E4DFD3] rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-[#12241A]">
                  Bestselling Products
                </h2>
                <p className="text-xs text-[#4A5D52]">
                  Ranked by total campus units ordered.
                </p>
              </div>

              <div className="space-y-4">
                {metrics.bestsellers.map((item) => {
                  const pct = Math.round((item.units / maxBestsellerUnits) * 100);
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#12241A] truncate pr-2">
                          {item.name}
                        </span>
                        <span className="font-mono text-[#4A5D52] tabular-nums shrink-0">
                          {item.units} sold · ₹{item.revenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-[#F2EDE2] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-[#2D7A47] rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Orders Quick Table */}
          <div className="bg-white border border-[#E4DFD3] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E4DFD3] flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#12241A]">
                Recent Campus Orders
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#2D7A47] hover:underline"
              >
                Manage All Orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#E4DFD3] text-xs text-[#6E7E74]">
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Customer &amp; Hostel</th>
                    <th className="py-3 px-4 font-semibold">Items</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE2]">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF8F3]/60">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-[#143D29]">
                        {order.id}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#12241A]">{order.customerName}</p>
                        <p className="text-xs text-[#6E7E74]">
                          {order.hostelName}, {order.roomNumber}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#4A5D52] max-w-xs truncate">
                        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#12241A] text-right tabular-nums">
                        ₹{order.total}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          aria-label={`Change status for ${order.id}`}
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="px-2.5 py-1.5 text-xs font-medium bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg text-[#143D29] focus:outline-none focus:border-[#2D7A47]"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E4DFD3] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#E4DFD3] flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#6E7E74] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, student, or hostel..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value as OrderStatus | 'All')}
              className="px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
            >
              <option value="All">All Order Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#E4DFD3] text-xs text-[#6E7E74]">
                  <th className="py-3 px-4 font-semibold">Order ID &amp; Time</th>
                  <th className="py-3 px-4 font-semibold">Student &amp; Hostel</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold text-right">Total</th>
                  <th className="py-3 px-4 font-semibold">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE2]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-[#4A5D52]">
                      No orders match your current filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF8F3]/60">
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-xs font-bold text-[#143D29]">{order.id}</p>
                        <p className="text-xs text-[#6E7E74] mt-0.5">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#12241A]">{order.customerName}</p>
                        <p className="text-xs text-[#4A5D52]">
                          {order.hostelName} · Room {order.roomNumber}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#4A5D52]">
                        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#4A5D52]">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#12241A] text-right tabular-nums">
                        ₹{order.total}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Status for order ${order.id}`}
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="px-3 py-1.5 text-xs font-semibold bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg text-[#143D29] focus:outline-none focus:border-[#2D7A47]"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[#12241A]">
              Editable Demo Menu Products
            </h2>
            <button
              type="button"
              onClick={openNewProductModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Food Product</span>
            </button>
          </div>

          <div className="bg-white border border-[#E4DFD3] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF8F3] border-b border-[#E4DFD3] text-xs text-[#6E7E74]">
                    <th className="py-3 px-4 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                    <th className="py-3 px-4 font-semibold">Availability</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE2]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-[#FAF8F3]/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-lg object-cover bg-[#F2EDE2] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#12241A] truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-[#6E7E74] truncate max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#4A5D52] whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#12241A] text-right tabular-nums">
                        ₹{product.price}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleAvailability(product.id)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors whitespace-nowrap ${
                            product.isAvailable
                              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#143D29]'
                              : 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
                          }`}
                        >
                          {product.isAvailable ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(product)}
                            className="p-2 rounded-lg text-[#143D29] hover:bg-[#F2EDE2] transition-colors"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {confirmDeleteId === product.id ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteProduct(product.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2.5 py-1 rounded bg-[#B91C1C] text-white text-xs font-semibold"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded bg-[#F2EDE2] text-xs font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(product.id)}
                              className="p-2 rounded-lg text-[#6E7E74] hover:text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WHATSAPP & STOREFRONT SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white border border-[#E4DFD3] rounded-2xl p-6 max-w-2xl space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#12241A]">
                WhatsApp &amp; Delivery Configuration
              </h2>
              <p className="text-xs text-[#4A5D52] mt-0.5">
                Configure the official WhatsApp Business number used across all Order via WhatsApp buttons.
              </p>
            </div>
            {settingsSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D7A47]">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
              Configurable WhatsApp Business Number (with country code, e.g. 919876543210)
            </label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-[#2D7A47] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Standard Hostel Delivery Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryFeeInput}
                onChange={(e) => setDeliveryFeeInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={freeThresholdInput}
                onChange={(e) => setFreeThresholdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
              Late-Night Operating Hours
            </label>
            <input
              type="text"
              value={hoursInput}
              onChange={(e) => setHoursInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors"
          >
            Save Storefront Settings
          </button>
        </form>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12241A]/50 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="bg-white border border-[#E4DFD3] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F2EDE2] pb-3">
              <h3 className="font-display text-lg font-bold text-[#12241A]">
                {products.some((p) => p.id === editingProduct.id)
                  ? 'Edit Food Product'
                  : 'Add New Food Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-[#4A5D52] hover:bg-[#F2EDE2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#12241A] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="e.g. Avocado Quinoa Salad"
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12241A] mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as FoodCategory,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
                  >
                    {FOOD_CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12241A] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12241A] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12241A] mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={editingProduct.prepTime}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, prepTime: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#12241A] mb-1">
                    Photo Preset
                  </label>
                  <select
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg"
                  >
                    {SAMPLE_IMAGE_PRESETS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label} Photo
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium text-[#12241A]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })
                    }
                    className="accent-[#143D29]"
                  />
                  <span>In Stock / Available</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestseller}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })
                    }
                    className="accent-[#143D29]"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.ecoPackaging}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, ecoPackaging: e.target.checked })
                    }
                    className="accent-[#143D29]"
                  />
                  <span>Eco Packaging Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F2EDE2]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E4DFD3] text-sm font-medium text-[#4A5D52] hover:bg-[#FAF8F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

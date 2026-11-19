import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  AppSettings,
  CartItem,
  CustomerProfile,
  DeliveryLocation,
  FoodCategory,
  Order,
  OrderStatus,
  PageView,
  Product,
  ToastMessage,
} from './types';
import {
  INITIAL_CUSTOMER_PROFILE,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from './data/seedData';
import {
  getInitialCart,
  getInitialCoupon,
  getInitialLocation,
  getInitialOrders,
  getInitialProducts,
  getInitialProfile,
  getInitialSettings,
  resetAllDemoData,
  saveCart,
  saveCoupon,
  saveLocation,
  saveOrders,
  saveProducts,
  saveProfile,
  saveSettings,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { OffersView } from './components/OffersView';
import { OrdersView } from './components/OrdersView';
import { AboutView } from './components/AboutView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [products, setProducts] = useState<Product[]>(getInitialProducts);
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);
  const [profile, setProfile] = useState<CustomerProfile>(getInitialProfile);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(getInitialCoupon);
  const [location, setLocation] = useState<DeliveryLocation>(getInitialLocation);
  const [settings, setSettings] = useState<AppSettings>(getInitialSettings);

  const [menuCategory, setMenuCategory] = useState<FoodCategory | 'All'>('All');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state to localStorage
  useEffect(() => saveProducts(products), [products]);
  useEffect(() => saveCart(cart), [cart]);
  useEffect(() => saveOrders(orders), [orders]);
  useEffect(() => saveProfile(profile), [profile]);
  useEffect(() => saveCoupon(appliedCoupon), [appliedCoupon]);
  useEffect(() => saveLocation(location), [location]);
  useEffect(() => saveSettings(settings), [settings]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleToggleFavorite = (productId: string) => {
    const exists = profile.favorites.includes(productId);
    const nextFavorites = exists
      ? profile.favorites.filter((id) => id !== productId)
      : [...profile.favorites, productId];
    setProfile({ ...profile, favorites: nextFavorites });
    showToast(exists ? 'Removed from favourites' : 'Saved to favourites', 'info');
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setCheckoutOpen(false);
    setCartOpen(false);
    setLatestOrderId(newOrder.id);
    setLocation({
      hostelName: newOrder.hostelName,
      roomNumber: newOrder.roomNumber,
    });
    setCurrentPage('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order ${newOrder.id} confirmed!`);
  };

  const handleReorder = (order: Order) => {
    const validItems: CartItem[] = [];
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId && p.isAvailable);
      if (prod) {
        validItems.push({ productId: prod.id, quantity: item.quantity });
      }
    });
    if (validItems.length === 0) {
      showToast('Items from that order are currently unavailable', 'error');
      return;
    }
    setCart(validItems);
    setCartOpen(true);
    showToast('Previous order items added to cart');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    showToast(`${product.name} saved to menu`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.productId !== productId));
    showToast('Product deleted from menu', 'info');
  };

  const handleToggleAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  const handleResetDemo = () => {
    resetAllDemoData();
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setProfile(INITIAL_CUSTOMER_PROFILE);
    setAppliedCoupon(null);
    setSettings(INITIAL_SETTINGS);
    setLocation({
      hostelName: INITIAL_CUSTOMER_PROFILE.hostelName,
      roomNumber: INITIAL_CUSTOMER_PROFILE.roomNumber,
    });
    setLatestOrderId(null);
    showToast('Demo data restored to defaults', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#12241A]">
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'menu') {
            setMenuCategory('All');
            setMenuSearch('');
          }
          setCurrentPage(page);
        }}
        cartCount={totalCartItems}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            products={products}
            cart={cart}
            profile={profile}
            location={location}
            settings={settings}
            onUpdateLocation={setLocation}
            onSearchToMenu={(query) => {
              setMenuCategory('All');
              setMenuSearch(query);
              setCurrentPage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCategoryToMenu={(cat) => {
              setMenuCategory(cat);
              setMenuSearch('');
              setCurrentPage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={setSelectedProduct}
            onApplyCoupon={(code) => {
              setAppliedCoupon(code);
              showToast(`Promo code ${code} applied to cart`);
            }}
          />
        )}

        {currentPage === 'menu' && (
          <MenuView
            key={`${menuCategory}-${menuSearch}`}
            products={products}
            cart={cart}
            profile={profile}
            initialCategory={menuCategory}
            initialSearch={menuSearch}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {currentPage === 'offers' && (
          <OffersView
            profile={profile}
            settings={settings}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={(code) => {
              setAppliedCoupon(code);
              showToast(`Promo code ${code} ready in your cart`);
            }}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersView
            orders={orders}
            latestOrderId={latestOrderId}
            onAdvanceOrderStatus={handleUpdateOrderStatus}
            onReorder={handleReorder}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            settings={settings}
            location={location}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'profile' && (
          <ProfileView
            profile={profile}
            products={products}
            orders={orders}
            onUpdateProfile={(next) => {
              setProfile(next);
              setLocation({
                hostelName: next.hostelName,
                roomNumber: next.roomNumber,
              });
              showToast('Student profile updated');
            }}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'admin' && (
          <AdminView
            products={products}
            orders={orders}
            settings={settings}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleAvailability={handleToggleAvailability}
            onUpdateSettings={(next) => {
              setSettings(next);
              showToast('Storefront settings saved');
            }}
            onResetDemo={handleResetDemo}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer
        onNavigate={(page) => setCurrentPage(page)}
        settings={settings}
        location={location}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onBrowseMenu={() => setCurrentPage('menu')}
        settings={settings}
        location={location}
        profile={profile}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        products={products}
        appliedCoupon={appliedCoupon}
        profile={profile}
        location={location}
        settings={settings}
        onOrderComplete={handleOrderComplete}
      />

      <ProductModal
        product={selectedProduct}
        quantity={
          selectedProduct
            ? cart.find((c) => c.productId === selectedProduct.id)?.quantity || 0
            : 0
        }
        isFavorite={
          selectedProduct ? profile.favorites.includes(selectedProduct.id) : false
        }
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddToCart}
        onUpdateQty={handleUpdateQty}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Non-intrusive Toast Stack */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto bg-[#143D29] text-white px-4 py-3 rounded-xl shadow-lg border border-white/15 flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[#A7E3BA] shrink-0" aria-hidden="true" />
                <span className="truncate">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-white/70 hover:text-white shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Check,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from 'lucide-react';
import { CustomerProfile, Order, PageView, Product } from '../types';
import { CAMPUS_HOSTELS } from '../data/seedData';

interface ProfileViewProps {
  profile: CustomerProfile;
  products: Product[];
  orders: Order[];
  onUpdateProfile: (next: CustomerProfile) => void;
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onNavigate: (page: PageView) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  products,
  orders,
  onUpdateProfile,
  onAddToCart,
  onToggleFavorite,
  onNavigate,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [mobileInput, setMobileInput] = useState(profile.mobile);
  const [hostelInput, setHostelInput] = useState(profile.hostelName);
  const [roomInput, setRoomInput] = useState(profile.roomNumber);
  const [savedNotice, setSavedNotice] = useState(false);

  const [loginName, setLoginName] = useState('Vanshika Sharma');
  const [loginMobile, setLoginMobile] = useState('9876543210');

  const favoriteProducts = products.filter((p) => profile.favorites.includes(p.id));
  const recentOrders = orders.slice(0, 3);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: nameInput.trim() || profile.name,
      email: emailInput.trim() || profile.email,
      mobile: mobileInput.trim() || profile.mobile,
      hostelName: hostelInput,
      roomNumber: roomInput.trim() || profile.roomNumber,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = loginName.trim() || 'Vanshika Sharma';
    const cleanMobile = loginMobile.replace(/\D/g, '').slice(-10) || '9876543210';
    onUpdateProfile({
      ...profile,
      isLoggedIn: true,
      name: cleanName,
      mobile: cleanMobile,
      referralCode: `${cleanName.split(' ')[0].toUpperCase()}-GB20`,
    });
    setNameInput(cleanName);
    setMobileInput(cleanMobile);
  };

  const handleLogout = () => {
    onUpdateProfile({
      ...profile,
      isLoggedIn: false,
    });
  };

  if (!profile.isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-[#E4DFD3] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#143D29] text-white flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#12241A]">
              Demo Student Sign In
            </h1>
            <p className="text-sm text-[#4A5D52]">
              No password required. Enter your name &amp; campus contact to save your hostel address and order history locally.
            </p>
          </div>

          <form onSubmit={handleDemoLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                required
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={loginMobile}
                onChange={(e) => setLoginMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47] font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue as Demo Student</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#F2EDE2] text-center">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D7A47] hover:underline"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Demo Admin Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#12241A]">
            Student Account
          </h1>
          <p className="text-sm text-[#4A5D52] mt-1">
            Demo campus profile · Saved hostel address, favourites &amp; orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F2EDE2] hover:bg-[#E4DFD3] text-[#143D29] text-sm font-semibold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
            <span>Demo Admin Dashboard</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E4DFD3] bg-white hover:bg-[#FEF2F2] hover:text-[#B91C1C] text-sm font-semibold text-[#4A5D52] transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Saved Profile & Hostel Address Form */}
        <form
          onSubmit={handleSaveDetails}
          className="lg:col-span-6 bg-white border border-[#E4DFD3] rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#12241A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
              <span>Contact &amp; Saved Hostel Address</span>
            </h2>
            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D7A47]">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#12241A] mb-1">
              University Email
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1">
                Saved Hostel / PG
              </label>
              <select
                value={hostelInput}
                onChange={(e) => setHostelInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              >
                {CAMPUS_HOSTELS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12241A] mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors"
          >
            Save Profile &amp; Hostel Address
          </button>
        </form>

        {/* Recent Order History Summary */}
        <div className="lg:col-span-6 bg-white border border-[#E4DFD3] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#12241A] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
              <span>Previous Orders</span>
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-[#2D7A47] hover:underline"
            >
              View All Orders
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-[#4A5D52] py-6">
              You haven&apos;t placed any orders yet.
            </p>
          ) : (
            <div className="divide-y divide-[#F2EDE2]">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#12241A] truncate">
                      <span className="font-mono text-[#143D29] mr-2">{order.id}</span>
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                    </p>
                    <p className="text-xs text-[#6E7E74] mt-0.5">
                      {order.hostelName} · {order.status}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#12241A] tabular-nums shrink-0">
                    ₹{order.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Favourite Food Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#12241A] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C83E3B] fill-[#C83E3B]" aria-hidden="true" />
            <span>Favourite Food Items ({favoriteProducts.length})</span>
          </h2>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="bg-white border border-[#E4DFD3] rounded-2xl p-8 text-center">
            <p className="text-sm text-[#4A5D52]">
              Tap the heart icon on any meal in the menu to save your late-night favourites here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E4DFD3] rounded-xl p-3.5 flex items-center gap-3.5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-[#F2EDE2] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-bold text-[#12241A] truncate">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs text-[#4A5D52] tabular-nums">
                    ₹{item.price}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(item.id)}
                      className="px-3 py-1 rounded-md bg-[#143D29] hover:bg-[#2D7A47] text-white text-xs font-semibold transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      className="text-xs text-[#6E7E74] hover:text-[#B91C1C]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

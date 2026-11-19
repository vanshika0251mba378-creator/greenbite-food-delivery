import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Leaf,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
} from 'lucide-react';
import {
  AppSettings,
  CartItem,
  CustomerProfile,
  DeliveryLocation,
  FoodCategory,
  PageView,
  Product,
} from '../types';
import {
  CAMPUS_HOSTELS,
  ECO_PACKAGING_IMAGE,
  FOOD_CATEGORIES,
  HERO_IMAGE,
  STUDENT_COUPONS,
} from '../data/seedData';
import { buildWhatsAppOrderUrl } from '../utils/storage';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  cart: CartItem[];
  profile: CustomerProfile;
  location: DeliveryLocation;
  settings: AppSettings;
  onUpdateLocation: (loc: DeliveryLocation) => void;
  onSearchToMenu: (query: string) => void;
  onCategoryToMenu: (cat: FoodCategory | 'All') => void;
  onNavigate: (page: PageView) => void;
  onAddToCart: (productId: string) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onToggleFavorite: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onApplyCoupon: (code: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  cart,
  profile,
  location,
  settings,
  onUpdateLocation,
  onSearchToMenu,
  onCategoryToMenu,
  onNavigate,
  onAddToCart,
  onUpdateQty,
  onToggleFavorite,
  onSelectProduct,
  onApplyCoupon,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [heroImgError, setHeroImgError] = useState(false);
  const [ecoImgError, setEcoImgError] = useState(false);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const featuredItems = bestsellers.length >= 3 ? bestsellers : products.slice(0, 4);

  const getQty = (id: string) => cart.find((c) => c.productId === id)?.quantity || 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchToMenu(heroSearch.trim());
  };

  const whatsappUrl = buildWhatsAppOrderUrl(
    settings.whatsappNumber,
    [],
    location,
    profile.name
  );

  return (
    <div className="space-y-16 sm:space-y-20 pb-8">
      {/* 1. Hero Section */}
      <section className="pt-8 sm:pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Copy & Ordering Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold tracking-wide text-[#2D7A47] uppercase">
                  Eat Fresh. Study Better. Stay Green.
                </p>

                <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#12241A] tracking-tight leading-[1.1] [text-wrap:balance]">
                  Late Night Hunger? We&apos;ve Got You Covered!
                </h1>

                <p className="text-base sm:text-lg text-[#4A5D52] leading-relaxed max-w-xl">
                  Fresh, healthy and affordable meals delivered to your hostel in 15–20 minutes.
                </p>
              </div>

              {/* Delivery Hostel Selector + Search */}
              <div className="bg-white border border-[#E4DFD3] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7 relative">
                    <MapPin
                      className="w-4 h-4 text-[#2D7A47] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      aria-label="Select Hostel or Campus Block"
                      value={location.hostelName}
                      onChange={(e) =>
                        onUpdateLocation({ ...location, hostelName: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg text-[#12241A] focus:outline-none focus:border-[#2D7A47]"
                    >
                      {CAMPUS_HOSTELS.map((hostel) => (
                        <option key={hostel} value={hostel}>
                          {hostel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      aria-label="Room number"
                      value={location.roomNumber}
                      onChange={(e) =>
                        onUpdateLocation({ ...location, roomNumber: e.target.value })
                      }
                      placeholder="Room No. (e.g. G-304)"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg text-[#12241A] focus:outline-none focus:border-[#2D7A47]"
                    />
                  </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-[#6E7E74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder="Search your favourite food..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg text-[#12241A] focus:outline-none focus:border-[#2D7A47]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    Order Now
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#4A5D52]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2D7A47]" aria-hidden="true" />
                    15–20 min campus delivery · {settings.operatingHours}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#143D29] hover:text-[#2D7A47] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#2D7A47]" aria-hidden="true" />
                    Quick WhatsApp Order
                  </a>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#E4DFD3] bg-[#F2EDE2] min-h-[300px] lg:min-h-[420px]">
              {!heroImgError ? (
                <img
                  src={HERO_IMAGE}
                  alt="GreenBite fresh healthy bowls, grilled paneer wrap, and cold-pressed juices on a study table"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="w-full h-full object-cover lg:absolute lg:inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-[#143D29]">
                  <span className="font-display text-xl font-bold">
                    GreenBite Fresh Campus Kitchen
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#12241A]/85 via-[#12241A]/45 to-transparent text-white">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#D6E6DC]">Serving DBS Global University, Dehradun</p>
                    <p className="font-display text-lg font-semibold mt-0.5">
                      Zero Junk. 100% Plastic-Free Campus Delivery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCategoryToMenu('Late Night Combos')}
                    className="px-4 py-2 rounded-lg bg-white text-[#143D29] hover:bg-[#FAF8F3] text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    Try ₹179 Study Combo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Campus Promise Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white border border-[#E4DFD3] rounded-xl p-4">
              <p className="font-mono text-lg font-bold text-[#143D29] tabular-nums">15–20 min</p>
              <p className="text-xs text-[#4A5D52] mt-0.5">Direct to hostel gate &amp; room</p>
            </div>
            <div className="bg-white border border-[#E4DFD3] rounded-xl p-4">
              <p className="font-mono text-lg font-bold text-[#143D29] tabular-nums">₹89 – ₹179</p>
              <p className="text-xs text-[#4A5D52] mt-0.5">Student-friendly daily pricing</p>
            </div>
            <div className="bg-white border border-[#E4DFD3] rounded-xl p-4">
              <p className="font-mono text-lg font-bold text-[#143D29] tabular-nums">100% Veg</p>
              <p className="text-xs text-[#4A5D52] mt-0.5">Fresh ingredients prepared nightly</p>
            </div>
            <div className="bg-white border border-[#E4DFD3] rounded-xl p-4">
              <p className="font-mono text-lg font-bold text-[#143D29] tabular-nums">0% Plastic</p>
              <p className="text-xs text-[#4A5D52] mt-0.5">Biodegradable kraft &amp; bagasse</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Food Category Sections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#12241A]">
              Explore by Category
            </h2>
            <p className="text-sm text-[#4A5D52] mt-1">
              Wholesome options built for late-night study sessions in Dehradun.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCategoryToMenu('All')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#143D29] hover:text-[#2D7A47] transition-colors whitespace-nowrap"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FOOD_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => onCategoryToMenu(cat.name)}
              className="group text-left bg-white border border-[#E4DFD3] hover:border-[#2D7A47] rounded-xl p-5 transition-all duration-150 hover:-translate-y-0.5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-[#2D7A47] block">
                  {cat.itemCountLabel}
                </span>
                <h3 className="font-display text-base font-bold text-[#12241A] group-hover:text-[#2D7A47] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#4A5D52] leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#143D29]">
                View items <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Popular & Bestselling Food */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#12241A]">
              Campus Bestsellers
            </h2>
            <p className="text-sm text-[#4A5D52] mt-1">
              Most ordered healthy picks across Aryabhatta, Gargi, and Kalpana Chawla Hostels.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCategoryToMenu('All')}
            className="px-4 py-2 rounded-lg border border-[#E4DFD3] bg-white hover:bg-[#F2EDE2] text-sm font-semibold text-[#143D29] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            View All {products.length} Items
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getQty(product.id)}
              isFavorite={profile.favorites.includes(product.id)}
              onAdd={onAddToCart}
              onUpdateQty={onUpdateQty}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. Special Student Offers & WhatsApp Quick Order */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#F2EDE2] border border-[#E4DFD3] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#12241A]">
                Special Student Offers
              </h2>
              <p className="text-sm text-[#4A5D52] mt-1">
                Apply a campus code in one click before checkout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('offers')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#143D29] hover:text-[#2D7A47]"
            >
              <span>All Offers &amp; Referral Program</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STUDENT_COUPONS.slice(0, 3).map((offer) => (
              <div
                key={offer.code}
                className="bg-white border border-[#E4DFD3] rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#2D7A47] font-semibold">
                    <span>{offer.tag}</span>
                    <span className="font-mono text-[#143D29]">{offer.code}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#12241A]">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-[#4A5D52] leading-relaxed">
                    {offer.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onApplyCoupon(offer.code);
                    onNavigate('menu');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#FAF8F3] hover:bg-[#143D29] text-[#143D29] hover:text-white border border-[#E4DFD3] text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Apply {offer.code} &amp; Order</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Eco-Friendly Packaging Banner & Demo Admin Quick Access */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#E4DFD3] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 relative min-h-[240px] bg-[#F2EDE2]">
            {!ecoImgError ? (
              <img
                src={ECO_PACKAGING_IMAGE}
                alt="GreenBite 100% biodegradable kraft boxes, sugarcane bagasse bowls, and wooden cutlery"
                referrerPolicy="no-referrer"
                onError={() => setEcoImgError(true)}
                className="w-full h-full object-cover lg:absolute lg:inset-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-6 text-[#143D29]">
                <Leaf className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D7A47]">
                <Leaf className="w-4 h-4" aria-hidden="true" />
                <span>Delivered with Care for the Planet</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#12241A]">
                100% Biodegradable &amp; Plastic-Free Campus Delivery
              </h2>
              <p className="text-sm sm:text-base text-[#4A5D52] leading-relaxed">
                Every GreenBite meal arrives in compostable sugarcane bagasse bowls, unbleached kraft paper wraps, and birchwood cutlery—eliminating single-use plastic waste across DBS Global University hostels.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-semibold transition-colors"
              >
                Read Our Sustainability Pledge
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E4DFD3] bg-[#FAF8F3] hover:bg-[#F2EDE2] text-[#143D29] text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span>Order via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-[#4A5D52] hover:text-[#143D29] hover:bg-[#FAF8F3] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

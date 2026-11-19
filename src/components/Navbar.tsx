import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: { id: PageView; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'offers', label: 'Offers' },
  { id: 'orders', label: 'My Orders' },
  { id: 'about', label: 'About Us' },
  { id: 'profile', label: 'Profile' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E4DFD3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D7A47] rounded-lg"
          aria-label="GreenBite Home"
        >
          <span className="w-8 h-8 rounded-lg bg-[#143D29] text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-[#143D29]">
            GreenBite
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A5D52]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D7A47] rounded ${
                  isActive
                    ? 'text-[#143D29] font-semibold'
                    : 'hover:text-[#143D29]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-[#2D7A47]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action (Cart) + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143D29] hover:bg-[#0E2B1D] text-white text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D7A47] focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Cart</span>
            <span className="font-mono text-xs tabular-nums bg-white/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-lg border border-[#E4DFD3] bg-white text-[#143D29] hover:bg-[#F2EDE2] transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E4DFD3] bg-[#FAF8F3] px-4 py-3">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#143D29] text-white'
                      : 'text-[#12241A] hover:bg-[#F2EDE2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium border-t border-[#E4DFD3] mt-1 pt-3 transition-colors ${
                currentPage === 'admin'
                  ? 'bg-[#143D29] text-white'
                  : 'text-[#2D7A47] hover:bg-[#F2EDE2]'
              }`}
            >
              Demo Admin Dashboard
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

import React, { useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { CartItem, CustomerProfile, FoodCategory, Product } from '../types';
import { FOOD_CATEGORIES } from '../data/seedData';
import { ProductCard } from './ProductCard';

interface MenuViewProps {
  products: Product[];
  cart: CartItem[];
  profile: CustomerProfile;
  initialCategory: FoodCategory | 'All';
  initialSearch: string;
  onAddToCart: (productId: string) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onToggleFavorite: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

type PriceRange = 'all' | 'under100' | '100to139' | '140plus';
type SortMode = 'popular' | 'price_asc' | 'price_desc' | 'rating';

export const MenuView: React.FC<MenuViewProps> = ({
  products,
  cart,
  profile,
  initialCategory,
  initialSearch,
  onAddToCart,
  onUpdateQty,
  onToggleFavorite,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sortBy, setSortBy] = useState<SortMode>('popular');

  const getQty = (id: string) => cart.find((c) => c.productId === id)?.quantity || 0;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) {
          return false;
        }
        if (priceRange === 'under100' && p.price >= 100) return false;
        if (priceRange === '100to139' && (p.price < 100 || p.price > 139)) return false;
        if (priceRange === '140plus' && p.price < 140) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
        return b.reviewCount - a.reviewCount;
      });
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
    setSortBy('popular');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#12241A]">
            Fresh Late-Night Menu
          </h1>
          <p className="text-sm sm:text-base text-[#4A5D52] mt-1">
            Prepared fresh for DBS Global University hostels in 100% plastic-free packaging.
          </p>
        </div>
        <p className="text-xs font-mono text-[#4A5D52] tabular-nums">
          Showing {filteredProducts.length} of {products.length} items
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
            selectedCategory === 'All'
              ? 'bg-[#143D29] text-white'
              : 'bg-white border border-[#E4DFD3] text-[#4A5D52] hover:text-[#12241A]'
          }`}
        >
          All Categories
        </button>
        {FOOD_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat.name
                ? 'bg-[#143D29] text-white'
                : 'bg-white border border-[#E4DFD3] text-[#4A5D52] hover:text-[#12241A]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search, Price Filter & Sort Bar */}
      <div className="bg-white border border-[#E4DFD3] rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-5 relative">
          <Search
            className="w-4 h-4 text-[#6E7E74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your favourite food..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#4A5D52] shrink-0" aria-hidden="true" />
          <select
            aria-label="Filter by price"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as PriceRange)}
            className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
          >
            <option value="all">All Prices</option>
            <option value="under100">Under ₹100</option>
            <option value="100to139">₹100 – ₹139</option>
            <option value="140plus">₹140 &amp; Above</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            aria-label="Sort menu items"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortMode)}
            className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#E4DFD3] rounded-lg focus:outline-none focus:border-[#2D7A47]"
          >
            <option value="popular">Sort: Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#E4DFD3] rounded-2xl p-12 text-center space-y-3">
          <h2 className="font-display text-xl font-bold text-[#12241A]">
            No matching meals found
          </h2>
          <p className="text-sm text-[#4A5D52] max-w-md mx-auto">
            Try clearing your search query or switching back to All Categories and All Prices.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#143D29] text-white text-sm font-medium hover:bg-[#2D7A47] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
};

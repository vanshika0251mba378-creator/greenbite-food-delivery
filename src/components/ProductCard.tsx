import React, { useState } from 'react';
import { Heart, Leaf, Minus, Plus, Star, Utensils } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  isFavorite: boolean;
  onAdd: (productId: string) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onToggleFavorite: (productId: string) => void;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  isFavorite,
  onAdd,
  onUpdateQty,
  onToggleFavorite,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group bg-white border border-[#E4DFD3] rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 4:3 Image Slot with Zero-Broken-Image Fallback */}
      <div className="relative aspect-[4/3] bg-[#F2EDE2] overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            onClick={() => onSelect(product)}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            onClick={() => onSelect(product)}
            className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F2EDE2] to-[#E4DFD3] text-[#143D29] cursor-pointer px-4 text-center"
          >
            <Utensils className="w-8 h-8 opacity-60" aria-hidden="true" />
            <span className="font-display text-sm font-semibold">{product.name}</span>
          </div>
        )}

        {/* Favourite button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          aria-label={isFavorite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
          className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm border border-[#E4DFD3] flex items-center justify-center text-[#143D29] hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-[#C83E3B] text-[#C83E3B]' : 'text-[#4A5D52]'
            }`}
          />
        </button>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-[#12241A]/55 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-white text-[#12241A] text-xs font-semibold rounded-md">
              Currently Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Unboxed Metadata Line (Zero-Pill Rule) */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#6E7E74]">
            <div className="flex items-center gap-2 min-w-0">
              {/* Indian Vegetarian Indicator */}
              <span
                title={product.isVeg ? 'Pure Vegetarian' : 'Contains Non-Veg'}
                className={`inline-flex items-center justify-center w-3.5 h-3.5 border shrink-0 rounded-[2px] ${
                  product.isVeg ? 'border-[#2D7A47]' : 'border-[#B91C1C]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    product.isVeg ? 'bg-[#2D7A47]' : 'bg-[#B91C1C]'
                  }`}
                />
              </span>
              <span className="truncate">{product.category}</span>
              {product.isBestseller && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#143D29] shrink-0">Bestseller</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 text-[#12241A] font-medium tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" aria-hidden="true" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(product)}
            className="text-left block w-full focus:outline-none focus-visible:underline"
          >
            <h3 className="font-display text-lg font-semibold text-[#12241A] leading-snug group-hover:text-[#2D7A47] transition-colors">
              {product.name}
            </h3>
          </button>

          <p className="text-sm text-[#4A5D52] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.ecoPackaging && (
            <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-[#2D7A47]">
              <Leaf className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Delivered with Care for the Planet</span>
            </div>
          )}
        </div>

        {/* Price & Action Baseline */}
        <div className="pt-3 border-t border-[#F2EDE2] flex items-center justify-between gap-3">
          <div>
            <span className="font-mono text-lg font-semibold text-[#12241A] tabular-nums">
              ₹{product.price}
            </span>
            <span className="ml-2 text-xs text-[#6E7E74] tabular-nums">
              {product.prepTime}
            </span>
          </div>

          {!product.isAvailable ? (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded-lg bg-[#F2EDE2] text-[#6E7E74] text-sm font-medium cursor-not-allowed whitespace-nowrap shrink-0"
            >
              Unavailable
            </button>
          ) : quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(product.id)}
              className="px-4 py-2 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D7A47]"
            >
              Add to Cart
            </button>
          ) : (
            <div className="inline-flex items-center bg-[#143D29] text-white rounded-lg overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, -1)}
                aria-label={`Decrease quantity of ${product.name}`}
                className="px-2.5 py-2 hover:bg-[#2D7A47] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 font-mono text-sm font-medium tabular-nums min-w-[28px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(product.id, 1)}
                aria-label={`Increase quantity of ${product.name}`}
                className="px-2.5 py-2 hover:bg-[#2D7A47] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

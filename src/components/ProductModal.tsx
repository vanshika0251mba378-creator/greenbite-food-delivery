import React, { useState } from 'react';
import { Clock, Flame, Heart, Leaf, Minus, Plus, Star, Utensils, X } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  quantity: number;
  isFavorite: boolean;
  onClose: () => void;
  onAdd: (productId: string) => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onToggleFavorite: (productId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  quantity,
  isFavorite,
  onClose,
  onAdd,
  onUpdateQty,
  onToggleFavorite,
}) => {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12241A]/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E4DFD3] rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] md:aspect-auto bg-[#F2EDE2]">
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center gap-2 text-[#143D29]">
              <Utensils className="w-10 h-10 opacity-60" />
              <span className="font-display font-semibold">{product.name}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="md:hidden absolute top-3 right-3 w-9 h-9 rounded-lg bg-white/95 text-[#12241A] flex items-center justify-center border border-[#E4DFD3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#6E7E74]">
                <span
                  className={`inline-flex items-center justify-center w-3.5 h-3.5 border rounded-[2px] ${
                    product.isVeg ? 'border-[#2D7A47]' : 'border-[#B91C1C]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      product.isVeg ? 'bg-[#2D7A47]' : 'bg-[#B91C1C]'
                    }`}
                  />
                </span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-[#12241A] font-medium tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="hidden md:flex p-1.5 rounded-lg text-[#4A5D52] hover:bg-[#F2EDE2] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2
                id="product-modal-title"
                className="font-display text-2xl font-bold text-[#12241A]"
              >
                {product.name}
              </h2>
              <p className="mt-2 text-sm text-[#4A5D52] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F2EDE2] text-xs text-[#4A5D52]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span>Prep: {product.prepTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#2D7A47]" aria-hidden="true" />
                <span className="tabular-nums">{product.calories}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#E4DFD3] flex items-start gap-2.5 text-xs text-[#143D29]">
              <Leaf className="w-4 h-4 text-[#2D7A47] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Delivered with Care for the Planet</p>
                <p className="text-[#4A5D52] mt-0.5">
                  Packed fresh in 100% biodegradable kraft &amp; sugarcane bagasse boxes with zero single-use plastic.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4DFD3] flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#6E7E74] block">Student Price</span>
              <span className="font-mono text-2xl font-bold text-[#12241A] tabular-nums">
                ₹{product.price}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                aria-label="Toggle favourite"
                className="p-2.5 rounded-lg border border-[#E4DFD3] hover:bg-[#F2EDE2] transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-[#C83E3B] text-[#C83E3B]' : 'text-[#4A5D52]'
                  }`}
                />
              </button>

              {!product.isAvailable ? (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 rounded-lg bg-[#F2EDE2] text-[#6E7E74] text-sm font-medium cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => onAdd(product.id)}
                  className="px-5 py-2.5 rounded-lg bg-[#143D29] hover:bg-[#2D7A47] text-white text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="inline-flex items-center bg-[#143D29] text-white rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(product.id, -1)}
                    className="px-3 py-2.5 hover:bg-[#2D7A47] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-mono text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(product.id, 1)}
                    className="px-3 py-2.5 hover:bg-[#2D7A47] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

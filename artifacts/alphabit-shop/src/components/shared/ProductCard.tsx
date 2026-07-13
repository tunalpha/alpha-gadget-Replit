import React from 'react';
import { Link } from 'wouter';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@workspace/api-client-react';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOnSale = product.on_sale && product.sale_price !== null && product.sale_price !== undefined;
  const currentPrice = isOnSale ? product.sale_price! : product.price;
  const discountPct = isOnSale
    ? Math.round((1 - product.sale_price! / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={`/prodotto/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
        )}

        {/* Discount badge */}
        {isOnSale && discountPct > 0 && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'linear-gradient(135deg, #ec4899, #ef4444)' }}
          >
            -{discountPct}%
          </span>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-full border">Esaurito</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <Link
          href={`/prodotti?category=${encodeURIComponent(product.category)}`}
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: '#7c3aed' }}
        >
          {product.category}
        </Link>

        <Link
          href={`/prodotto/${product.id}`}
          className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-purple-700 transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            {isOnSale ? (
              <>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="font-black text-lg" style={{ color: '#7c3aed' }}>{formatPrice(currentPrice)}</span>
              </>
            ) : (
              <span className="font-black text-lg" style={{ color: '#7c3aed' }}>{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            disabled={product.stock <= 0}
            onClick={(e) => {
              e.preventDefault();
              addItem({
                product_id: product.id,
                quantity: 1,
                name: product.name,
                price: currentPrice,
                image: product.image,
                stock: product.stock,
              });
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 disabled:opacity-40 transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}
            aria-label="Aggiungi al carrello"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

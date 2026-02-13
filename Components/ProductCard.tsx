'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import { List } from 'lucide-react';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const inStock = product.stock_quantity > 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      {/* Quick View Icon */}
      <button className="absolute top-3 right-3 z-10 bg-white p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
        <List className="w-4 h-4 text-gray-600" />
      </button>

      {/* Image Container */}
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-64 bg-gray-50 overflow-hidden">
          <Image
            src={product.image_url || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!inStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
              Out of Stock
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 hover:text-orange-500 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
          {product.price > 50 && (
            <div className="text-sm text-gray-400 line-through">
              {formatPrice(product.price * 1.3)}
            </div>
          )}
        </div>

        {/* Stock Info */}
        {inStock && (
          <div className="text-xs text-gray-500 mb-3">
            ${product.price.toFixed(2)} - ${(product.price * 1.2).toFixed(2)}
          </div>
        )}

        {/* Shop Now Button */}
        <Link href={`/products/${product.id}`}>
          <button
            className={cn(
              'w-full bg-orange-500 text-white font-semibold py-2.5 px-4 rounded',
              'hover:bg-orange-600 transition-colors duration-200 text-sm',
              'disabled:bg-gray-300 disabled:cursor-not-allowed'
            )}
            disabled={!inStock}
          >
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

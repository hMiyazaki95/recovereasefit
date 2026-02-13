'use client';

import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/CartContext';
import { cn } from '@/lib/utils';

interface Props {
  product: Product;
  disabled?: boolean;
}

const AddToCartButton = ({ product, disabled = false }: Props) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (disabled || quantity < 1) return;

    setIsAdding(true);
    addItem(product, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className={cn(
              'p-2 hover:bg-gray-100 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-medium">{quantity}</span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
            className={cn(
              'p-2 hover:bg-gray-100 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        className={cn(
          'w-full flex items-center justify-center space-x-2',
          'bg-blue-600 text-white font-bold py-4 px-8 rounded-lg',
          'hover:bg-blue-700 active:scale-95 transition-all duration-200',
          'disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none'
        )}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{isAdding ? 'Added to Cart!' : 'Add to Cart'}</span>
      </button>
    </div>
  );
};

export default AddToCartButton;

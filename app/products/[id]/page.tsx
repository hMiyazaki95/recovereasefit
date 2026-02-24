import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/Components/AddToCartButton';
import { Package, ShieldCheck, Truck } from 'lucide-react';

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Premium Store`,
    description: product.description,
  };
}

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const inStock = product.stock_quantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image_url || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="text-3xl font-bold text-orange-500 mb-6">
            {formatPrice(product.price)}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {inStock ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Package className="w-5 h-5" />
                <span className="font-medium">
                  In Stock ({product.stock_quantity} available)
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <Package className="w-5 h-5" />
                <span className="font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="mb-8">
            <AddToCartButton product={product} disabled={!inStock} />
          </div>

          {/* Features */}
          <div className="border-t pt-8 space-y-4">
            <div className="flex items-start space-x-3">
              <Truck className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">
                  On orders over £50
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  100% secure transactions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Package className="w-6 h-6 text-orange-500 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900">30-Day Returns</h3>
                <p className="text-sm text-gray-600">
                  Money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
        <div className="flex items-center space-x-3 mb-8">
          <div className="text-4xl font-bold text-gray-900">4.9</div>
          <div>
            <div className="text-yellow-400 text-xl">★★★★★</div>
            <p className="text-sm text-gray-500">Based on 127 reviews</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah M.',
              rating: 5,
              date: 'January 2025',
              title: 'Excellent quality!',
              body: 'Really impressed with this product. Exactly as described and arrived quickly. Will definitely be ordering again.',
            },
            {
              name: 'James T.',
              rating: 5,
              date: 'December 2024',
              title: 'Great for recovery',
              body: 'I use this after every gym session and it has made a noticeable difference to my recovery time. Highly recommend.',
            },
            {
              name: 'Emma R.',
              rating: 5,
              date: 'January 2025',
              title: 'Perfect gift',
              body: 'Bought this as a gift for my partner who is into fitness. He loves it. Good build quality and does the job perfectly.',
            },
            {
              name: 'David K.',
              rating: 4,
              date: 'February 2025',
              title: 'Good value for money',
              body: 'Works well and feels sturdy. Delivery was fast and packaging was solid. Very happy with this purchase.',
            },
            {
              name: 'Priya S.',
              rating: 5,
              date: 'January 2025',
              title: 'Highly recommend',
              body: 'I was a bit sceptical ordering online but this exceeded my expectations. Great product at a fair price.',
            },
            {
              name: 'Tom B.',
              rating: 5,
              date: 'December 2024',
              title: 'Does exactly what it says',
              body: 'Simple, effective, and well made. I&apos;ve tried more expensive versions and this is just as good.',
            },
          ].map((review) => (
            <div key={review.name} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
                <div className="text-yellow-400">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="font-medium text-gray-800 mb-1">{review.title}</p>
              <p className="text-sm text-gray-600">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

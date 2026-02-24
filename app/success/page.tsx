'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful purchase
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully processed.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-2 text-gray-700 mb-4">
            <Package className="w-5 h-5" />
            <span className="font-medium">Order ID: </span>
            <span className="font-mono text-sm">
              {sessionId || 'Processing...'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your email address with order details.
          </p>
        </div>

        {/* What's Next */}
        <div className="mb-8 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What happens next?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  We&apos;re preparing your order for shipment
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Shipping Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You&apos;ll receive a tracking number via email within 24-48 hours
                </p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your order will arrive within 5-7 business days
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-orange-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-gray-200 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

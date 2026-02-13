import React from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/Components/ProductCard';
import Link from 'next/link';

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false});

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  const bestSellers = products.slice(0, 4);
  const popularCategories = products.slice(4);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative text-white overflow-hidden min-h-[500px] lg:min-h-[600px] flex items-center"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Enhance Your Workout and Recovery
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow">
              Explore our range of massage and fitness equipment for peak performance.
            </p>
            <Link href="#products">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl">
                Shop Massage Equipment
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600">
              Please check back later or contact support for assistance.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Popular Categories Section */}
      {popularCategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Discover Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover <span className="text-orange-500">Top-Rated</span> Equipment for{' '}
            <span className="text-orange-500">Fitness and Recovery</span>
          </h2>
        </div>
      </div>

      {/* Our Story Section */}
      <div id="story" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-snug">
                Built by athletes,<br />for athletes.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fitness Gear was founded with one mission: to make premium recovery and training equipment accessible to everyone — from weekend warriors to elite competitors.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We obsess over the details so you don&apos;t have to. Every product in our catalog is rigorously tested for durability, performance, and comfort before it reaches your door.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Based in Los Angeles, we&apos;re a team of coaches, trainers, and fitness enthusiasts who believe recovery is just as important as the workout itself.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '10K+', label: 'Happy Customers' },
                { stat: '50+',  label: 'Premium Products' },
                { stat: '4.9★', label: 'Average Rating' },
                { stat: '2-Day', label: 'Fast Shipping' },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">Contact Us</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-gray-500 max-w-md mx-auto">
              Have a question about an order or product? We&apos;re here to help — reach out any time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: '📍', title: 'Address', body: '123 Fitness St., Los Angeles, CA 90001' },
              { icon: '📞', title: 'Phone',   body: '+1 (800) 123-4567' },
              { icon: '✉️', title: 'Email',   body: 'support@fitnessgear.com' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="font-semibold text-gray-900 mb-1">{title}</p>
                <p className="text-sm text-gray-500">{body}</p>
              </div>
            ))}
          </div>
          <div className="max-w-xl mx-auto bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Name</label>
                <input type="text" placeholder="Jane Doe" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-800 transition-colors bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-800 transition-colors bg-white" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Message</label>
              <textarea rows={4} placeholder="How can we help?" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-800 transition-colors resize-none bg-white" />
            </div>
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1a2332] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#products" className="text-gray-300 hover:text-orange-500 transition-colors">Shop</a></li>
                <li><a href="#story" className="text-gray-300 hover:text-orange-500 transition-colors">Our Story</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Fitness Gear</h3>
              <p className="text-gray-300">123 Fitness St.</p>
              <p className="text-gray-300">Los Angeles, CA 90001</p>
              <p className="text-gray-300 mt-2">+1 (800) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

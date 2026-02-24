'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  User,
  X,
  Plus,
  Minus,
  Trash2,
  Menu,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/utils';

const ShopNavbar = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  const [isScrolled, setIsScrolled]     = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [cartOpen, setCartOpen]         = useState(false);
  const [authOpen, setAuthOpen]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [authTab, setAuthTab]           = useState<'login' | 'register'>('login');

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── Sticky shadow on scroll ── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Auto-focus search input ── */
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  /* ── Global ESC to close any overlay ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
        setCartOpen(false);
        setAuthOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── Lock body scroll when overlay open ── */
  useEffect(() => {
    document.body.style.overflow =
      cartOpen || authOpen || mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, authOpen, mobileOpen]);

  /* ── Smooth scroll helper ── */
  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* ── Close search ── */
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* ═══════════════════════════════════ HEADER */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled
            ? 'shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
            : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">

            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 flex items-center group"
              aria-label="RecoverEaseFit – Home"
            >
              <span className="text-xl lg:text-[22px] font-bold tracking-tight text-gray-900 transition-opacity group-hover:opacity-80">
                RecoverEase<span className="text-orange-500">Fit</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {(['Shop', 'Our Story', 'Contact'] as const).map((label) => {
                const id = label === 'Shop' ? 'products' : label === 'Our Story' ? 'story' : 'contact';
                return (
                  <button
                    key={label}
                    onClick={() => scrollTo(id)}
                    className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 group py-1"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-orange-500 rounded-full transition-all duration-300 group-hover:w-full" />
                  </button>
                );
              })}
            </nav>

            {/* Right icons cluster */}
            <div className="flex items-center gap-0.5">

              {/* ── Search ── */}
              <div className="flex items-center">
                {/* Expanding input */}
                <div
                  className={`flex items-center gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    searchOpen
                      ? 'w-44 sm:w-60 border-b border-gray-800 mr-1'
                      : 'w-0'
                  }`}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none py-1 px-1"
                  />
                  {searchOpen && (
                    <button
                      onClick={closeSearch}
                      aria-label="Close search"
                      className="shrink-0 p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
                  aria-label="Search"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Search className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* ── Account ── */}
              <button
                onClick={() => setAuthOpen(true)}
                aria-label="My account"
                className="hidden sm:flex p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <User className="w-[18px] h-[18px]" />
              </button>

              {/* ── Cart ── */}
              <button
                onClick={() => setCartOpen(true)}
                aria-label={`Cart (${totalItems} items)`}
                className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {totalItems > 0 && (
                  <span className="absolute top-[3px] right-[3px] min-w-[16px] h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* ── Mobile hamburger ── */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                className="md:hidden p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {mobileOpen ? (
                  <X className="w-[18px] h-[18px]" />
                ) : (
                  <Menu className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-5 py-3 space-y-0.5">
            {[
              { label: 'Shop', id: 'products' },
              { label: 'Our Story', id: 'story' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex w-full items-center justify-between py-3.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors border-b border-gray-50 last:border-0"
              >
                {label}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
              className="flex w-full items-center justify-between py-3.5 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
            >
              Account
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════ CART DRAWER */}

      {/* Overlay */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-[60] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">
              Your Cart
              {totalItems > 0 && (
                <span className="ml-1.5 text-sm font-normal text-gray-400">
                  ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-gray-200" />
              </div>
              <p className="font-medium text-gray-700">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add something to get started</p>
              <button
                onClick={() => { setCartOpen(false); scrollTo('products'); }}
                className="mt-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                Browse products <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 pb-5 border-b border-gray-50 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-7 h-7 text-gray-200" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 flex-1">
                        {item.product.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                        className="shrink-0 p-1 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-orange-500 mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-900 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 w-5 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-900 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <span className="ml-auto text-sm font-medium text-gray-700 tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-gray-100 space-y-4 bg-white">
            {/* Subtotal row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center -mt-2">
              Shipping & taxes calculated at checkout
            </p>

            {/* Checkout CTA */}
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="flex items-center justify-center gap-2.5 w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              Secure Checkout
            </Link>

            {/* Continue shopping */}
            <button
              onClick={() => { setCartOpen(false); scrollTo('products'); }}
              className="w-full text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      {/* ═══════════════════════════════════ AUTH MODAL */}

      {/* Overlay */}
      <div
        onClick={() => setAuthOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-[3px] z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          authOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Modal panel — stop propagation so clicking inside doesn't close */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden transition-all duration-300 ${
            authOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">My Account</h2>
            <button
              onClick={() => setAuthOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAuthTab(tab)}
                className={`flex-1 py-3 text-sm font-medium capitalize transition-all duration-200 ${
                  authTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="px-6 py-6 space-y-4">
            {authTab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-800 transition-colors placeholder-gray-300"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-800 transition-colors placeholder-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-800 transition-colors placeholder-gray-300"
              />
            </div>

            {authTab === 'login' && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-xs text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <button className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm mt-1 shadow-sm">
              {authTab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              {authTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setAuthTab(authTab === 'login' ? 'register' : 'login')}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                {authTab === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopNavbar;

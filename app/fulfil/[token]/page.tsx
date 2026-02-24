'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface FulfilmentData {
  id: string;
  order_id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    cj_variant_id: string | null;
  }[];
  total_amount: number;
  created_at: string;
}

export default function FulfilPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<FulfilmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; cjOrderId?: string } | null>(null);

  useEffect(() => {
    fetch(`/api/fulfil/${token}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  async function handleConfirm() {
    setConfirming(true);
    try {
      const res = await fetch(`/api/fulfil/${token}`, { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setResult({ success: true, cjOrderId: json.cjOrderId });
        setData((prev) => prev ? { ...prev, status: 'fulfilled' } : prev);
      } else {
        setResult({ error: json.error || 'Something went wrong' });
      }
    } catch {
      setResult({ error: 'Network error — please try again' });
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!data || (data as any).error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Order not found or link has expired.</p>
      </div>
    );
  }

  const addr = data.shipping_address;
  const addressStr = [addr?.line1, addr?.line2, addr?.city, addr?.state, addr?.postal_code, addr?.country]
    .filter(Boolean)
    .join(', ');

  const alreadyFulfilled = data.status === 'fulfilled';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Confirm Order</h1>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              alreadyFulfilled
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {alreadyFulfilled ? 'Fulfilled' : 'Pending'}
          </span>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
          <p className="font-medium text-gray-900">{data.customer_name}</p>
          <p className="text-sm text-gray-500">{data.customer_email}</p>
          {data.customer_phone && <p className="text-sm text-gray-500">{data.customer_phone}</p>}
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Ship To</p>
          <p className="text-sm text-gray-700">{addressStr || 'No address provided'}</p>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Items</p>
          <div className="space-y-2">
            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-800">
                  {item.name} × {item.quantity}
                  {!item.cj_variant_id && (
                    <span className="ml-2 text-xs text-red-500">(⚠ no CJ variant ID)</span>
                  )}
                </span>
                <span className="text-gray-600">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>£{data.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {result?.success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
            <p className="text-green-700 font-semibold">Order sent to CJ Dropshipping!</p>
            <p className="text-sm text-green-600 mt-1">CJ Order ID: {result.cjOrderId}</p>
          </div>
        )}

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-700 text-sm">{result.error}</p>
          </div>
        )}

        {!alreadyFulfilled && !result?.success && (
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            {confirming ? 'Sending to CJ...' : '✅ Confirm & Send to CJ'}
          </button>
        )}

        {alreadyFulfilled && !result && (
          <p className="text-center text-sm text-gray-400">This order has already been sent to CJ.</p>
        )}
      </div>
    </div>
  );
}

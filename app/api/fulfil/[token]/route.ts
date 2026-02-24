import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { createCJOrder } from '@/lib/cj';

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('order_fulfillments')
    .select('*')
    .eq('token', params.token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = getServiceSupabase();

  const { data: fulfillment, error } = await supabase
    .from('order_fulfillments')
    .select('*')
    .eq('token', params.token)
    .single();

  if (error || !fulfillment) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (fulfillment.status !== 'pending') {
    return NextResponse.json(
      { error: 'This order has already been processed' },
      { status: 400 }
    );
  }

  const shipping = fulfillment.shipping_address;

  if (!shipping) {
    return NextResponse.json(
      { error: 'No shipping address on this order' },
      { status: 400 }
    );
  }

  // Check all products have a CJ variant ID set
  const missingVariant = fulfillment.items.find((i: any) => !i.cj_variant_id);
  if (missingVariant) {
    return NextResponse.json(
      { error: `Missing CJ variant ID for: ${missingVariant.name}. Set cj_variant_id in Supabase.` },
      { status: 400 }
    );
  }

  const products = fulfillment.items.map((item: any) => ({
    vid: item.cj_variant_id,
    quantity: item.quantity,
  }));

  // Place the order on CJ Dropshipping
  const cjResult = await createCJOrder({
    orderNumber: fulfillment.order_id,
    customerName: fulfillment.customer_name || 'Customer',
    phone: fulfillment.customer_phone || '',
    address: shipping.line1 || '',
    city: shipping.city || '',
    province: shipping.state || shipping.city || '',
    country: shipping.country === 'GB' ? 'United Kingdom' : (shipping.country || ''),
    countryCode: shipping.country || 'GB',
    zip: shipping.postal_code || '',
    products,
  });

  await supabase
    .from('order_fulfillments')
    .update({ status: 'fulfilled', cj_order_id: cjResult.orderId })
    .eq('token', params.token);

  return NextResponse.json({ success: true, cjOrderId: cjResult.orderId });
}
